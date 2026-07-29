import { deleteFromCloudinary } from "../../utils/uploadToClodinary";
import pool from "../../config/db";
import { NotFound } from "../../error/error";
import { product } from "../../schemas/production/getProducts.schema";

export const deleteProduct = async (
  store_id: string,
  id: string,
): Promise<void> => {
  const result = await pool.query(
    `
    UPDATE ecommerce.products
    SET is_deleted = true,
     deleted_at = NOW()
    WHERE id = $1 
    AND store_id = $2
    AND is_deleted = false
    `,
    [id, store_id],
  );

  if (result.rowCount === 0) {
    throw new NotFound("Product not found");
  }
};

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  image_public_id: string;
  category: string;
  in_stock: boolean;
  store_id: string;
  is_deleted: boolean;
  deleted_at: Date | null;
  created_at: Date;
}

const cleanupDeletedProducts = async (
  store_id: string,
  product_id: string,
): Promise<void> => {
  const get_deleted_product = await pool.query<Product>(
    "SELECT * FROM ecommerce.products WHERE  is_deleted = true AND deleted_at < NOW() - INTERVAL '15 days'",
  );
  for (const product of get_deleted_product.rows) {
    try {
      await deleteFromCloudinary(product.image_public_id);
      await pool.query("DELETE FROM ecommerce.products WHERE id = $1 ", [
        product_id,
      ]);
    } catch (error) {
      console.error(`Failed to clean up product ${product_id}:`, error);
    }
  }
};
