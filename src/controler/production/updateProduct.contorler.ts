import { Request, Response, NextFunction } from "express";
import { product_id_image_id } from "../../schemas/production/update_image_id.schema copy";
import {
  UpdateProductData,
  updateProduct,
} from "../../services/admin/CRUD/update.services";
import { productId } from "../../schemas/production/getProductsById.schema";
import { updateScheme } from "../../schemas/production/update.schema";
export const updateProductController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const data = updateScheme.parse(req.body);
    const { store_id } = req.admin as { store_id: string };
    const { id } = productId.parse(req.params);
    const files = req.files as Express.Multer.File[];
    const result = await updateProduct(data, store_id, id, files);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
