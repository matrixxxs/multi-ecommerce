import pool from "../../config/db";

// Input shape after schema validation + store_id from JWT
export interface ProductTokens {
  name?: string;
  category?: string;
  in_stock?: boolean;
  page: number;
  limit: number;
  maxPrice?: number;
  minPrice?: number;
}

// Single product row shape
interface Product {
  id: string;
  store_id: string;
  name: string;
  description: string;
  image_url: string;
  in_stock: boolean;
  category: string;
  price: number;
  created_at: string;
}

// Final response shape returned to the client
interface PaginatedProducts {
  data: Product[];
  pagination: {
    currentPage: number;
    limit: number;
    total: number;
    totalPage: number;
  };
}

export const getProducts = async (
  data: ProductTokens,
  store_id: string,
): Promise<PaginatedProducts> => {
  // store_id always included and always first — tenant isolation is never optional
  let values: Array<string | number | boolean> = [store_id];
  const conditions: Array<string> = ["store_id = $1"];

  // Each filter appended only if provided, keeping params correctly indexed
  if (data.category) {
    values.push(data.category);
    conditions.push(`category = $${values.length}`);
  }
  if (data.name) {
    values.push(`%${data.name}%`);
    conditions.push(`name ILIKE $${values.length}`);
  }
  if (data.in_stock !== undefined) {
    values.push(data.in_stock);
    conditions.push(`in_stock = $${values.length}`);
  }
  if (data.minPrice !== undefined) {
    values.push(data.minPrice);
    conditions.push(`price >= $${values.length}`);
  }
  if (data.maxPrice !== undefined) {
    values.push(data.maxPrice);
    conditions.push(`price <= $${values.length}`);
  }

  // Combine all active filters into one WHERE clause
  const whereCase = conditions.join(" AND ");
  const offset = (data.page - 1) * data.limit;

  // Main query — newest first, paginated, plus total row count via window function
  const query = `SELECT id,name,description,price,image_url,category,in_stock,store_id,created_at, COUNT(*) OVER() AS total_count FROM ecommerce.products WHERE ${whereCase} ORDER BY created_at DESC LIMIT $${values.length + 1} OFFSET $${values.length + 2}`;
  values.push(data.limit, offset);

  const result = await pool.query<Product & { total_count: string }>(
    query,
    values,
  );

  // Total count comes back on every row identically — read once, guard against empty results
  const total =
    result.rows.length > 0 ? parseInt(result.rows[0].total_count, 10) : 0;

  // Strip the internal total_count field before returning products to the client
  const finalResult = result.rows.map(({ total_count, ...product }) => product);

  return {
    data: finalResult,
    pagination: {
      currentPage: data.page,
      limit: data.limit,
      total,
      totalPage: Math.ceil(total / data.limit),
    },
  };
};
