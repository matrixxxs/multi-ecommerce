import { Request, Response, NextFunction } from "express";
import { update } from "../../schemas/production/update.schema";
import { product_id_image_id } from "../../schemas/production/update_image_id.schema copy";
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
  const data = req.body as UpdateProductData;
  const { store_id } = req.admin as { store_id: string };
  const { id } = product_id_image_id.parse(req.params);
  const { image_id } = product_id_image_id.parse(req.params);
  const files = req.files as Express.Multer.File[];
  const result = await updateProduct(data, store_id, id, files, image_id);
  res.status(200).json(result);
};
