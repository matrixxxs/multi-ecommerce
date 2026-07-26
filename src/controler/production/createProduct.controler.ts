import { Request, Response } from "express";
import { ValidationError } from "../../error/error";
import {
  CreateProduct,
  createProduct,
} from "../../services/production/createProduct.service";

export const create = async (req: Request, res: Response): Promise<void> => {
  const { store_id } = req.admin as { store_id: string };
  const productData: CreateProduct = req.body;
  const file = (req as any).file?.buffer;
  if (file === undefined) {
    throw new ValidationError("Please upload a product image.");
  }
  const result = await createProduct(productData, file, store_id);
  res.status(201).json(result);
};
