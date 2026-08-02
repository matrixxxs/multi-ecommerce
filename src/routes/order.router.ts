import express from "express";
import CreateOrders from "../controler/order/order.controler";
import GetOrder from "../controler/order/getOrder.controler";
import { authMiddleware } from "../middleware/auth";
const router = express.Router();

router.post("/:slug/orders", CreateOrders);
router.get("/orders-list", authMiddleware, GetOrder);

export default router;
