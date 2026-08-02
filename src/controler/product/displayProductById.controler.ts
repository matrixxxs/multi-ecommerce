import { productByIdParams } from "../../schemas/product/displayProductById.schema";
import { Request, Response, NextFunction } from "express";
import { getProductByIdService } from "../../services/product/displayProductById.services";

export const productById = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { id, slug } = productByIdParams.parse(req.params);

    const result = await getProductByIdService(id, slug);
    res.status(200).json(result);
  } catch (error) {
    return next(error);
  }
};
