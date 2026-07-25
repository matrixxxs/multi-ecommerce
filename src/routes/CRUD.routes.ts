import express from "express";
import { ValidateBody } from "../middleware/validat";
import { createProduct } from "../schemas/production/createProduct.schema";
import { create } from "../controler/production/createProduct.controler";
import { upload } from "../middleware/upload";

const router = express.Router();

router.post(
  "/create-product",
  upload.single("image"),
  ValidateBody(createProduct),
  create,
);

export default router;
