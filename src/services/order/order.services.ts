import prisma from "../../config/prisma";
import { NotFound } from "../../error/error";
import { order_schema } from "../../schemas/orders/order.scheme";
import z from "zod";
type OrdersData = z.infer<typeof order_schema>;
interface OrdersDetails {
  id: string;
  total: number;
  items: {
    product_id: string;
    product_name: string;
    product_image_url: string | null;
    product_price: unknown;
    quantity: number;
    line_total: number;
  }[];
}

export const createOrder = async (
  data: OrdersData,
  store_id: string,
): Promise<OrdersDetails> => {
  const product = await prisma.products.findMany({
    where: {
      store_id,
      is_deleted: false,
      id: {
        in: data.items.map((id) => id.product_id),
      },
    },
  });

  const orderItems = data.items.map((cartItems) => {
    const productItems = product.find(
      (product) => product.id === cartItems.product_id,
    );

    if (!productItems) {
      throw new NotFound("product can not be found ");
    }

    return {
      product_id: productItems.id,
      product_name: productItems.name,
      product_image_url: productItems.image_url,
      product_price: productItems.price,
      quantity: cartItems.quantity,
      line_total: cartItems.quantity * Number(productItems.price),
    };
  });

  const total = orderItems.reduce((sum, item) => sum + item.line_total, 0);
  const result = await prisma.$transaction(async (tx) => {
    const order = await tx.orders.create({
      data: {
        customer_name: data.customer_name,
        customer_phone: data.customer_phone,
        customer_address: data.customer_address,
        store_id,
      },
    });
    await tx.order_items.createMany({
      data: orderItems.map((items) => ({
        ...items,
        order_id: order.id,
      })),
    });
    for (const item of orderItems) {
      const update_result = await tx.products.updateMany({
        where: {
          id: item.product_id,
          qty: { gte: item.quantity },
        },
        data: {
          qty: { decrement: item.quantity },
        },
      });
      if (update_result.count === 0) {
        throw new Error("out of stock");
      }
    }
    return order;
  });
  return {
    id: result.id,
    total,
    items: orderItems,
  };
};
