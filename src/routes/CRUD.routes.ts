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
import { setMainImage } from "../controler/production/setMainImage.controler";
import { product_id_image_id } from "../schemas/production/update_image_id.schema copy";
const router = express.Router();

router.post(
  "/:slug/products",
  authMiddleware,
  upload.array("image", 3),
  ValidateBody(createProduct),
  create,
);

router.get(
  "/:slug/products",
  authMiddleware,
  ValidateBody(product),
  getProduct,
);
router.get(
  "/:slug/product/:id",
  authMiddleware,
  ValidateParam(productId),
  productById,
);
router.patch(
  "/:slug/products/:id/images/:imageId/edit-product",
  authMiddleware,
  upload.array("image", 3),
  ValidateParam(productId),
  ValidateBody(update),
  updateProductController,
);
router.patch(
  "/:slug/products/:id/images/:imageId/set-main",
  authMiddleware,
  ValidateParam(product_id_image_id),
  setMainImage,
);
router.patch(
  "/:slug/product/delete/:id",
  authMiddleware,
  ValidateParam(productId),
  DeleteProduct,
);
export default router;
