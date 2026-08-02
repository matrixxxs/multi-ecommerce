import prisma from "../../config/prisma";
import { NotFound } from "../../error/error";

interface UpdatedOrder {
  id: string;
  customer_name: string;
  customer_phone: string;
  status: string;
  store_id: string;
  created_at: Date | null;
}

export const updateOrderStatus = async (
  id: string,
  store_id: string,
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled",
): Promise<UpdatedOrder> => {
  const updateResult = await prisma.orders.updateMany({
    where: {
      id,
      store_id,
    },
    data: { status },
  });

  if (updateResult.count === 0) {
    throw new NotFound("Order can not be found");
  }

  const updatedOrder = await prisma.orders.findFirst({
    where: { id, store_id },
    select: {
      id: true,
      customer_name: true,
      customer_phone: true,
      status: true,
      store_id: true,
      created_at: true,
    },
  });

  return updatedOrder as UpdatedOrder;
};
