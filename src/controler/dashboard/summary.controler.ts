import { Request, Response, NextFunction } from "express";
import { getSummary } from "../../services/admin/dashboard/summary.service";

export const summary = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { store_id } = req.admin as { store_id: string };
    const result = await getSummary(store_id);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
