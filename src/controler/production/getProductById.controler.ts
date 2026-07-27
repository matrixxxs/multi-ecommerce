import { Request, Response, NextFunction } from "express";
import { getProductById } from "../../services/production/getProductById.service";
import { productId } from "../../schemas/production/getProductsById.schema";
export const productById = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const { id } = productId.parse(req.params);
  const { store_id } = req.admin as { store_id: string };
  const result = await getProductById(id, store_id);
  res.status(200).json(result);
};
