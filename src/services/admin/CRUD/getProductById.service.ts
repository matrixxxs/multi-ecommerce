import prisma from "../../../config/prisma";
import { NotFound } from "../../../error/error";
export interface GetProductById {
  id: string;
  store_id: string;
  name: string;
  description: string;
  images: {
    image_url: string;
    id: string;
    is_main: boolean;
  }[];
  in_stock: boolean;
  category: string;
  price: number;
  created_at: Date | null;
  qty: number | null;
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
      images: {
        select: {
          image_url: true,
          id: true,
          is_main: true,
        },
        orderBy: { is_main: "desc" },
      },
      store_id: true,
      created_at: true,
      qty: true,
    },
  });

  if (!result) throw new NotFound("Product not found");
  return {
    ...result,
    price: result.price.toNumber(),
  };
};
