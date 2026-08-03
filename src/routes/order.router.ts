import express from "express";
import CreateOrders from "../controler/order/order.controler";
import GetOrder from "../controler/order/getOrder.controler";
import { authMiddleware } from "../middleware/auth";
import { ValidateBody, ValidateParam } from "../middleware/validat";
import { productId } from "../schemas/production/getProductsById.schema";
import { getOrderById } from "../controler/order/getOrderById.controler";
import { updateOrderStatusController } from "../controler/order/updateOrderStatus.controler";
import { updateOrderStatusSchema } from "../schemas/orders/updateOrderStatus.schema";
const router = express.Router();

router.post("/:slug/orders", CreateOrders);
router.get("/orders-list", authMiddleware, GetOrder);
router.get(
  "/order/:id",
  authMiddleware,
  ValidateParam(productId),
  getOrderById,
);
router.patch(
  "/order/:id/status",
  authMiddleware,
  ValidateParam(productId),
  updateOrderStatusController,
);
export default router;
