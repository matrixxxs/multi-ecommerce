import express from "express";
import CreateOrders from "../controler/order/order.controler";
import GetOrder from "../controler/order/getOrder.controler";
import { authMiddleware } from "../middleware/auth";
import { ValidateParam } from "../middleware/validat";
import { productId } from "../schemas/production/getProductsById.schema";
import { getOrderById } from "../controler/order/getOrderById.controler";
const router = express.Router();

router.post("/:slug/orders", CreateOrders);
router.get("/orders-list", authMiddleware, GetOrder);
router.get(
  "/order/:id",
  authMiddleware,
  ValidateParam(productId),
  getOrderById,
);

export default router;
