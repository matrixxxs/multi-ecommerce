import express from "express";
import CreateOrders from "../controler/order/order.controler";
const router = express.Router();

router.post("/:slug/orders", CreateOrders);

export default router;
