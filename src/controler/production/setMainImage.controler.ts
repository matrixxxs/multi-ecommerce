import { Request, Response, NextFunction } from "express";
import { product_id_image_id } from "../../schemas/production/update_image_id.schema copy";
import { setMainImageServices } from "../../services/admin/CRUD/setMainImage.services";

export const setMainImage = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { store_id } = req.admin as { store_id: string };
    const { id, image_id } = product_id_image_id.parse(req.params);
    const result = await setMainImageServices(store_id, image_id, id);
    res.status(200).json(result);
  } catch (error) {
    return next(error);
  }
};
