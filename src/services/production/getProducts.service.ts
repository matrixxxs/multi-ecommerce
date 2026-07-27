import pool from "../../config/db";

interface ProductTokens {
  store_id: string;
  name?: string;
  category?: string;
  in_stock?: boolean;
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
}

const getProducts = async (data: ProductTokens): Promise<Product[]> => {
  let query = `SELECT
    id,name,description,price,image_url,category,in_stock,store_id 
    FROM
    ecommerce.products 
    WHERE 1=1 
    AND
    store_id = $1 `;
  const values: Array<string | boolean> = [data.store_id];

  if (data.category) {
    values.push(data.category);
    query += `AND category = $${values.length} `;
  }

  if (data.name) {
    values.push(`%${data.name}%`);
    query += `AND name ILIKE $${values.length} `;
  }

  if (data.in_stock !== undefined) {
    values.push(data.in_stock);
    query += `AND in_stock = $${values.length} `;
  }

  const result = await pool.query<Product>(query, values);
  return result.rows[0];
};
