import { Request, Response, NextFunction } from "express";
import { displayProductSchema } from "../../schemas/product/displayProduct.schema";
import { display } from "../../services/product/displayProduct.service";

export const displayProduct = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const { slug } = req.params as { slug: string };
  const schema = displayProductSchema.parse(req.query);

  const result = await display(schema, slug);

  res.status(200).json(result);
};

export default displayProduct;
