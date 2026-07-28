import { Request, Response, NextFunction } from "express";
import { update } from "../../schemas/production/update.schema";
import { productId } from "../../schemas/production/getProductsById.schema";
import {
  UpdateProductData,
  updateProduct,
} from "../../services/production/update.services";
import { ValidationError } from "../../error/error";
const updateProductController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const data = update.parse(req.body);
  const { store_id } = req.admin as { store_id: string };
  const { id } = productId.parse(req.params);
  //   const file = (req as any).file.buffer;
  const file = req.file?.buffer;
  const result = await updateProduct(data, store_id, id, file);
  res.status(200).json(result);
};
