import prisma from "../../config/prisma";
import { NotFound } from "../../error/error";
export interface GetProductById {
  id: string;
  store_id: string;
  name: string;
  description: string;
  image_url: string;
  in_stock: boolean;
  category: string;
  price: number;
  created_at: Date | null;
}
export const getProductById = async (
  id: string,
  store_id: string,
): Promise<GetProductById> => {
  const result = await prisma.products.findFirst({
    where: {
      id,
      store_id,
      is_deleted: false,
    },
    select: {
      id: true,
      name: true,
      category: true,
      description: true,
      price: true,
      in_stock: true,
      image_url: true,
      store_id: true,
      created_at: true,
    },
  });

  if (!result) throw new NotFound("Product not found");
  return {
    ...result,
    price: result.price.toNumber(),
  };
};
