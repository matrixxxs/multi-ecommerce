import express from "express";
import { ValidateBody, ValidateParam } from "../middleware/validat";
import { productId } from "../schemas/production/getProductsById.schema";
import { displayProductSchema } from "../schemas/product/displayProduct.schema";
import displayProduct from "../controler/product/displayProsuct.controler";
const router = express.Router();

router.get("/:slug", displayProduct);

export default router;
