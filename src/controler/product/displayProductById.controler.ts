import { productId } from "../../schemas/production/getProductsById.schema";
import { Request, Response, NextFunction } from "express";
import { getProductByIdService } from "../../services/product/displayProductById.services";

export const productById = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { id } = productId.parse(req.params);
    const { store_id } = req.admin as { store_id: string };
    const result = await getProductByIdService(id, store_id);
    res.status(200).json(result);
  } catch (error) {
    return next(error);
  }
};
