import { productId } from "../../schemas/production/getProductsById.schema";
import { Request, Response, NextFunction } from "express";
import { getProductByIdService } from "../../services/product/displayProductById.services";

export const productById = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { id } = productId.parse(req.params);
    const { slug } = req.params as { slug: string };

    const result = await getProductByIdService(id, slug);
    res.status(200).json(result);
  } catch (error) {
    return next(error);
  }
};
