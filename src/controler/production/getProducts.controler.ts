import { string } from "zod";
import { product } from "../../schemas/production/getProducts.schema";
import { getProducts } from "../../services/admin/CRUD/getProducts.service";
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
  } catch (error: unknown) {
    next(error);
    if (error instanceof Error) {
      console.log(error.message);
    }
  }
};
