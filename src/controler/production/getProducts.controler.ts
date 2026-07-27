import { product } from "../../schemas/production/getProducts.schema";
import { getProducts } from "../../services/production/getProducts.service";
import { Request, Response, NextFunction } from "express";
export const getProduct = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { store_id } = req.admin as { store_id: string };
    const schema = product.parse(req.query);
    const result = await getProducts(schema, store_id);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
