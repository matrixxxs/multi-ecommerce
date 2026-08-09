import { Request, Response, NextFunction } from "express";
import { getRevenue } from "../../services/admin/dashboard/revenue";
export const revenue = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { store_id } = req.admin as { store_id: string };
    const result = await getRevenue(store_id);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
