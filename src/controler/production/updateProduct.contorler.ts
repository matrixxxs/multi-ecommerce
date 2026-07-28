import { Request, Response, NextFunction } from "express";
import { update } from "../../schemas/production/update.schema";
import { productId } from "../../schemas/production/getProductsById.schema";
import {
  UpdateProductData,
  updateProduct,
} from "../../services/production/update.services";
import { ValidationError } from "../../error/error";
export const updateProductController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  console.log("in_stock raw value:", JSON.stringify(req.body.in_stock));
  console.log("upcoming data:", req.body);
  const data = req.body as UpdateProductData;
  const { store_id } = req.admin as { store_id: string };
  const { id } = productId.parse(req.params);
  const file = req.file?.buffer;
  const result = await updateProduct(data, store_id, id, file);
  res.status(200).json(result);
};
