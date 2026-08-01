import { id } from "zod/v4/locales";
import prisma from "../../config/prisma";
import { NotFound, OutOfStock } from "../../error/error";
import { order_schema } from "../../schemas/orders/order.scheme";
import z from "zod";
import { product } from "../../schemas/production/getProducts.schema";
type OrdersData = z.infer<typeof order_schema>;
interface OrdersDetails {
  id: string;
  total: number;
  items: {
    product_id: string;
    product_name: string;
    product_image_url: string | null;
    product_price: number;
    quantity: number;
    line_total: number;
  }[];
}

const getStoreId = async (slug: string): Promise<string> => {
  const get = await prisma.stores.findFirst({
    where: {
      slug,
    },
    select: {
      id: true,
    },
  });
  if (!get) {
    throw new NotFound("store can not be found");
  }

  return get.id;
};

export const createOrder = async (
  data: OrdersData,
  slug: string,
): Promise<OrdersDetails> => {
  const store_id = await getStoreId(slug);

  const product = await prisma.products.findMany({
    where: {
      store_id,
      is_deleted: false,
      id: {
        in: data.items.map((product) => product.product_id),
      },
    },
  });
  const orderItems = data.items.map((currentItem) => {
    const productItems = product.find(
      (product) => product.id === currentItem.product_id,
    );
    if (!productItems) {
      throw new NotFound("Product can not be found");
    }
    return {
      product_id: productItems.id,
      product_name: productItems.name,
      product_image_url: productItems.image_url,
      product_price: Number(productItems.price),
      quantity: currentItem.quantity,
      line_total: currentItem.quantity * Number(productItems.price),
    };
  });
  const total = orderItems.reduce((sum, items) => sum + items.line_total, 0);
  const order = await prisma.$transaction(async (tx) => {
    const result = await tx.orders.create({
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
        order_id: result.id,
      })),
    });
    for (const item of orderItems) {
      const updateResult = await tx.products.updateMany({
        where: {
          id: item.product_id,
          qty: { gte: item.quantity },
        },
        data: {
          qty: {
            decrement: item.quantity,
          },
        },
      });
      if (updateResult.count === 0) {
        throw new OutOfStock("out of stock");
      }
    }
    return result;
  });
  return {
    id: order.id,
    total,
    items: orderItems,
  };
};
