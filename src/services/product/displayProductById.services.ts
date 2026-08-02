import prisma from "../../config/prisma";
import { NotFound } from "../../error/error";

export interface GetId {
  id: string;
}

interface GetIdResult {
  id: string;
  customer_name: string;
  customer_phone: string;
  status: string;
  store_id: string;
  created_at: Date | null;
}

export const getOrderByIdService = async (
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
      customer_name: true,
      customer_phone: true,
      status: true,
      store_id: true,
      created_at: true,
    },
  });

  if (!result) {
    throw new NotFound("Product not found");
  }

  return result;
};
