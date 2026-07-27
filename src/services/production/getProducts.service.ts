import { number, string } from "zod";
import pool from "../../config/db";

interface ProductTokens {
  store_id: string;
  name?: string;
  category?: string;
  in_stock?: boolean;
  pages: number;
  limit: number;
  maxPrice?: number;
  minPrice?: number;
}

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

interface PaginatedProduct {
  data: Product[];
  pagination: {
    pages: number;
    limit: number;
    total: number;
    totalPage: number;
  };
}
const getProducts = async (data: ProductTokens): Promise<PaginatedProduct> => {
  let values: Array<string | number | boolean> = [data.store_id];
  const conditions: Array<string> = ["store_id = $1"];

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

  const whereCase = conditions.join(" AND ");
  const offset = (data.pages - 1) * data.limit;

  const query = `SELECT id,name,description,price,image_url,category,in_stock,store_id,created_at, COUNT(*) OVER() AS total_count FROM ecommerce.products WHERE ${whereCase} ORDER BY created_at DESC LIMIT $${values.length + 1} OFFSET $${values.length + 2}`;
  values.push(data.limit, offset);
  const result = await pool.query<Product & { total_count: string }>(
    query,
    values,
  );
  const total =
    result.rows.length > 0 ? parseInt(result.rows[0].total_count, 10) : 0;
  const finalResult = result.rows.map(({ total_count, ...product }) => product);

  return {
    data: finalResult,
    pagination: {
      pages: data.pages,
      limit: data.limit,
      total,
      totalPage: Math.ceil(total / data.limit),
    },
  };
};
