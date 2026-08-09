import { Request, Response, NextFunction } from "express";
import { getSummary } from "../../services/admin/dashboard/summary.service";

export const Summary = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const { store_id } = req.admin as { store_id: string };
};
