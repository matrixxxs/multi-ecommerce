import prisma from "../../config/prisma";
import { NotAllowed, NotFound, OutOfStock } from "../../error/error";

interface UpdatedOrder {
  id: string;
  customer_name: string;
  customer_phone: string;
  status: string;
  store_id: string;
  created_at: Date | null;
}

type OrderStatus =
  | "pending"
  | "confirmed"
  | "shipped"
  | "delivered"
  | "cancelled";

const allowedTransitions: Record<OrderStatus, readonly OrderStatus[]> = {
  pending: ["confirmed", "cancelled"],
  confirmed: ["shipped", "cancelled"],
  shipped: ["delivered"],
  delivered: [],
  cancelled: [],
};

export const updateOrderStatus = async (
  id: string,
  store_id: string,
  status: OrderStatus,
): Promise<UpdatedOrder> => {
  const updatedOrder = await prisma.$transaction(async (tx) => {
    const findOrder = await tx.orders.findFirst({
      where: {
        id,
        store_id,
      },
      include: {
        order_items: true,
      },
    });

    if (!findOrder) {
      throw new NotFound("Order cannot be found");
    }

    const currentStatus = findOrder.status as OrderStatus;

    // Check if status transition is allowed
    if (!allowedTransitions[currentStatus].includes(status)) {
      throw new NotAllowed(
        `Cannot change order from ${currentStatus} to ${status}`,
      );
    }

    // When confirming order, remove items from stock
    if (currentStatus === "pending" && status === "confirmed") {
      for (const item of findOrder.order_items) {
        if (!item.product_id) {
          throw new NotFound("Product not found");
        }

        const result = await tx.products.updateMany({
          where: {
            id: item.product_id,
            qty: {
              gte: item.quantity,
            },
          },
          data: {
            qty: {
              decrement: item.quantity,
            },
          },
        });

        if (result.count === 0) {
          throw new OutOfStock("Product is out of stock");
        }
      }
    }

    // When cancelling order, return items back to stock
    if (currentStatus === "confirmed" && status === "cancelled") {
      for (const item of findOrder.order_items) {
        if (!item.product_id) {
          continue;
        }

        await tx.products.update({
          where: {
            id: item.product_id,
          },
          data: {
            qty: {
              increment: item.quantity,
            },
          },
        });
      }
    }

    return tx.orders.update({
      where: {
        id,
        store_id,
      },
      data: {
        status,
      },
    });
  });

  return updatedOrder;
};
