import express from "express";
import {
  ValidateParam,
  ValidateQuery,
  ValidateBody,
} from "../middleware/validat";
import { createProduct } from "../schemas/production/createProduct.schema";
import { create } from "../controler/production/createProduct.controler";
import { upload } from "../middleware/upload";
import { authMiddleware } from "../middleware/auth";
import { product } from "../schemas/production/getProducts.schema";
import { getProduct } from "../controler/production/getProducts.controler";
import { productById } from "../controler/production/getProductById.controler";
import { productId } from "../schemas/production/getProductsById.schema";
import { updateProductController } from "../controler/production/updateProduct.contorler";
import { DeleteProduct } from "../controler/production/deleteProduct.controler";
import { setMainImage } from "../controler/production/setMainImage.controler";
import { product_id_image_id } from "../schemas/production/update_image_id.schema copy";
import {
  productByIdParams,
  productSlugParams,
} from "../schemas/product/displayProductById.schema";
const router = express.Router();

router.post(
  "/products",
  authMiddleware,
  upload.array("image", 3),
  ValidateBody(createProduct),
  create,
);

router.get("/products", authMiddleware, ValidateQuery(product), getProduct);
router.get(
  "/product/:id",
  authMiddleware,
  ValidateParam(productId),
  productById,
);
router.patch(
  "/products/:id",
  authMiddleware,
  upload.array("image", 3),
  ValidateParam(productId),
  updateProductController,
);
router.patch(
  "/products/:id/images/:imageId/set-main",
  authMiddleware,
  ValidateParam(product_id_image_id),
  setMainImage,
);
router.patch(
  "/product/delete/:id",
  authMiddleware,
  ValidateParam(productId),
  DeleteProduct,
);
export default router;
