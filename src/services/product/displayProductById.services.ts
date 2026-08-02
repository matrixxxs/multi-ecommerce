import prisma from "../../config/prisma";
import { NotFound } from "../../error/error";

export interface GetId {
  id: string;
}

interface GetIdResult {
  id: string;
  store_id: string;
  name: string;
  description: string;
  image_url: string;
  category: string;
  price: number;
}

export const getProductByIdService = async (
  id: string,
  store_id: string,
): Promise<GetIdResult> => {
  const result = await prisma.products.findFirst({
    where: {
      id,
      store_id,
    },
    select: {
      id: true,
      store_id: true,
      name: true,
      description: true,
      image_url: true,
      category: true,
      price: true,
    },
  });

  if (!result) {
    throw new NotFound("Product not found");
  }

  return { ...result, price: result.price.toNumber() };
};
