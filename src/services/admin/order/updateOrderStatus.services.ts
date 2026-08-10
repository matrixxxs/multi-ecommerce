import prisma from "../../../config/prisma";
import { NotAllowed, NotFound, OutOfStock } from "../../../error/error";
import { formatOrderItems } from "../../../utils/formatOrderItems";

interface OrderItem {
  id: string;
  product_id: string | null;
  product_name: string;
  product_image_url: string | null;
  product_price: number;
  quantity: number;
  line_total: number;
}

interface UpdatedOrder {
  id: string;
  customer_name: string;
  customer_phone: string;
  status: string;
  store_id: string;
  created_at: Date | null;
  items: OrderItem[];
  total: number;
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
      select: {
        id: true,
        customer_name: true,
        customer_phone: true,
        status: true,
        store_id: true,
        created_at: true,

        order_items: {
          select: {
            id: true,
            product_id: true,
            product_name: true,
            product_image_url: true,
            product_price: true,
            quantity: true,
            line_total: true,
          },
        },
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
          throw new OutOfStock(
            `Product "${item.product_name}" is out of stock`,
          );
        }
      }
    }

    // When cancelling a confirmed order, return items to stock
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

    // Update order status
    const order = await tx.orders.update({
      where: {
        id,
        store_id,
      },
      data: {
        status,
      },
    });

    const itemsForFormatting = findOrder.order_items.map((item) => ({
      ...item,
      product_price: item.product_price.toNumber(),
      line_total: item.line_total.toNumber(),
    }));

    const { items, total } = formatOrderItems(itemsForFormatting);

    return {
      id: order.id,
      customer_name: order.customer_name,
      customer_phone: order.customer_phone,
      status: order.status,
      store_id: order.store_id,
      created_at: order.created_at,
      items,
      total,
    };
  });

  return updatedOrder;
};
