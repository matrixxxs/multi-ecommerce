import express from "express";
import { Request, Response, NextFunction } from "express";
import { order_schema } from "../../schemas/orders/order.scheme";
import { createOrder } from "../../services/order/order.services";

const CreateOrders = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { slug } = req.params as { slug: string };
    const schema = order_schema.parse(req.body);

    const result = await createOrder(schema, slug);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};
export default CreateOrders;
