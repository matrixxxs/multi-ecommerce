import { Request, Response } from "express";
import { ValidationError } from "../../error/error";
import {
  CreateProduct,
  createProduct,
} from "../../services/production/createProduct.service";

export const create = async (req: Request, res: Response): Promise<void> => {
  const { store_id } = req.admin as { store_id: string };
  const productData: CreateProduct = req.body;
  const files = req.files as Express.Multer.File[];
  if (!files || files.length === 0) {
    throw new ValidationError("At least one image is required");
  }
  const result = await createProduct(productData, files, store_id);
  res.status(201).json(result);
};
