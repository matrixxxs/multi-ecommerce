import prisma from "../../config/prisma";
import { NotFound } from "../../error/error";
import { getStoreId } from "../../config/getStoreId";

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
  in_stock: boolean;
  qty: number | null;
}

export const getProductByIdService = async (
  id: string,
  slug: string,
): Promise<GetIdResult> => {
  const store_id = await getStoreId(slug);
  if (!store_id) {
    throw new NotFound("Store not found");
  }
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
      in_stock: true,
      qty: true,
    },
  });

  if (!result) {
    throw new NotFound("Product not found");
  }

  return { ...result, price: result.price.toNumber() };
};
