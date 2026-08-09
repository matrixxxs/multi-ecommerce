import { Request, Response, NextFunction } from "express";
import { updateOrderStatus } from "../../services/admin/order/updateOrderStatus.services";
import { updateOrderStatusSchema } from "../../schemas/orders/updateOrderStatus.schema";
import { productId } from "../../schemas/production/getProductsById.schema";

export const updateOrderStatusController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { id } = productId.parse(req.params);
    const { status } = updateOrderStatusSchema.parse(req.body);
    const { store_id } = req.admin as { store_id: string };

    const result = await updateOrderStatus(id, store_id, status);
    res.status(200).json(result);
  } catch (error) {
    return next(error);
  }
};
