import pool from "../../config/db";
import { NotFound } from "../../error/error";
export interface GetProductById {
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
export const getProductById = async (
  id: string,
  store_id: string,
): Promise<GetProductById> => {
  const get = await pool.query<GetProductById>(
    "SELECT id,name,description,price,image_url,category,in_stock,store_id,created_at FROM ecommerce.products  WHERE id = $1 AND store_id = $2 ",
    [id, store_id],
  );
  const result = get.rows[0];
  if (!result) throw new NotFound("Product not found");
  return result;
};
