import express from "express";
import { ValidateBody, ValidateParam } from "../middleware/validat";
import { productId } from "../schemas/production/getProductsById.schema";
import { displayProductSchema } from "../schemas/product/displayProduct.schema";
import { productById } from "../controler/product/displayProductById.controler";

import displayProduct from "../controler/product/displayProsuct.controler";
const router = express.Router();

router.get("/:slug", displayProduct);
router.get("/product/:slug/:id", ValidateParam(productId), productById);
export default router;
