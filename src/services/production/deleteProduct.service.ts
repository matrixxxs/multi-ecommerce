import pool from "../../config/db";

const deleteProduct = async (store_id: string, id: string): Promise<void> => {
  const result = await pool.query(
    `
    UPDATE ecommerce.products
    SET is_deleted = true
    WHERE id = $1 
    AND store_id = $2
    `,
    [id, store_id],
  );

  if (result.rowCount === 0) {
    throw new Error("Product not found");
  }
};
