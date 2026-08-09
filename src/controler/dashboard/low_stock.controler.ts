import { getLowStock } from "../../services/admin/dashboard/low_stock.services";
import { Request, Response, NextFunction } from "express";
export const low_stock = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { store_id } = req.admin as { store_id: string };
    const result = await getLowStock(store_id);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
