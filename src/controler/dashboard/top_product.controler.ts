import { Request, Response, NextFunction } from "express";
import { limitSchema } from "../../schemas/dashboard/limit.schema";
import { getTopProducts } from "../../services/admin/dashboard/top-products";
export const top_product = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { store_id } = req.admin as { store_id: string };
    const { limit } = limitSchema.parse(req.query);
    const result = await getTopProducts(store_id, limit);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
