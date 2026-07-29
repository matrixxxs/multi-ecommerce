import express from "express";
import { ValidateBody } from "../middleware/validat";
import { ValidateParam } from "../middleware/validat";
import { createProduct } from "../schemas/production/createProduct.schema";
import { create } from "../controler/production/createProduct.controler";
import { upload } from "../middleware/upload";
import { authMiddleware } from "../middleware/auth";
import { product } from "../schemas/production/getProducts.schema";
import { getProduct } from "../controler/production/getProducts.controler";
import { productById } from "../controler/production/getProductById.controler";
import { productId } from "../schemas/production/getProductsById.schema";
import { update } from "../schemas/production/update.schema";
import { updateProductController } from "../controler/production/updateProduct.contorler";
import { DeleteProduct } from "../controler/production/deleteProduct.controler";
const router = express.Router();

router.post(
  "/",
  authMiddleware,
  upload.single("image"),
  ValidateBody(createProduct),
  create,
);

router.get("/p", authMiddleware, ValidateBody(product), getProduct);
router.get("/:id", authMiddleware, ValidateParam(productId), productById);
router.patch(
  "/update/:id",
  authMiddleware,
  upload.single("image"),
  ValidateParam(productId),
  ValidateBody(update),
  updateProductController,
);
router.patch(
  "/delete/:id",
  authMiddleware,
  ValidateParam(productId),
  DeleteProduct,
);
export default router;
