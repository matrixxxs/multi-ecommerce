import { Router } from "express";
import { summary } from "../controler/dashboard/summary.controler";
import { revenue } from "../controler/dashboard/revenue.controler";
import { top_product } from "../controler/dashboard/top_product.controler";
import { authMiddleware } from "../middleware/auth";
const router = Router();
router.use(authMiddleware); // all dashboard routes require admin auth

router.get("/summary", summary);
router.get("/revenue", revenue);
router.get("/top-products", top_product);

export default router;
