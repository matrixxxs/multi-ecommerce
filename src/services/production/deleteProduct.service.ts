import pool from "../../config/db";
import { NotFound } from "../../error/error";

export const deleteProduct = async (
  store_id: string,
  id: string,
): Promise<void> => {
  const result = await pool.query(
    `
    UPDATE ecommerce.products
    SET is_deleted = true
    WHERE id = $1 ,
    AND store_id = $2
    AND is_deleted = false
    `,
    [id, store_id],
  );

  if (result.rowCount === 0) {
    throw new NotFound("Product not found");
  }
};
