import { deleteProduct } from "../../services/admin/CRUD/deleteProduct.service";
import { Request, Response, NextFunction } from "express";
import { productId } from "../../schemas/production/getProductsById.schema";
export const DeleteProduct = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const { id } = productId.parse(req.params);
  const { store_id } = req.admin as { store_id: string };
  await deleteProduct(store_id, id);
  res.status(200).json({
    message: "Product deleted successfully",
  });
};
