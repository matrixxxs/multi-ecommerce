import { getOrderSchema } from "../../schemas/orders/getOrders.schema";
import { getOrder } from "../../services/order/getOrders.services";
import { Request, Response, NextFunction } from "express";
export const GetOrder = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const schemas = getOrderSchema.parse(req.query);
    const { store_id } = req.admin as { store_id: string };
    const result = await getOrder(schemas, store_id);
    res.status(200).json(result);
  } catch (error) {
    return next(error);
  }
};
export default GetOrder;
