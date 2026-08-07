import prisma from "../../config/prisma";
import { NotFound } from "../../error/error";

export interface GetId {
  id: string;
}

interface OrderItem {
  id: string;
  product_id: string | null;
  product_name: string;
  product_image_url: string | null;
  product_price: number;
  quantity: number;
  line_total: number;
}

interface GetIdResult {
  id: string;
  customer_name: string;
  customer_phone: string;
  status: string;
  store_id: string;
  created_at: Date | null;
  items: OrderItem[];
  total: number;
}

export const getOrderByIdService = async (
  id: string,
  store_id: string,
): Promise<GetIdResult> => {
  const result = await prisma.orders.findFirst({
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

  if (!result) {
    throw new NotFound("Order not found");
  }

  const items = result.order_items.map((item) => ({
    ...item,
    product_price: Number(item.product_price),
    line_total: Number(item.line_total),
  }));

  const total = items.reduce((sum, item) => sum + item.line_total, 0);

  return {
    id: result.id,
    customer_name: result.customer_name,
    customer_phone: result.customer_phone,
    status: result.status,
    store_id: result.store_id,
    created_at: result.created_at,
    items,
    total,
  };
};
