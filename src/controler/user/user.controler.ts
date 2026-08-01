import { Request, Response, NextFunction } from "express";
import { userProduct } from "../../schemas/product/getProduct.schema";
import express from "express";
import { display } from "../../services/users/displayProduct.controler";
const router = express.Router();

const displayProduct = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const { slug } = req.params as { slug: string };
  const schema = userProduct.parse(req.body);

  await display(
    {
      ...schema,
      limit: Number(req.query.limit ?? 10),
      page: Number(req.query.page ?? 1),
    },
    slug,
  );
};
