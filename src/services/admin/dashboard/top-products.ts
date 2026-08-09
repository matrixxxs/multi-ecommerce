import prisma from "../../../config/prisma";
import { completedOrderFilter } from "../../../utils/completedOrderFilter";

export interface TopProductsResult {
  data: {
    product_id: string;
    name: string;
    image_url: string | null; // main image, null if product/image was deleted
    quantity_sold: number;
  }[];
}
export const getTopProducts = async (
  store_id: string,
  limit: number,
): Promise<TopProductsResult> => {
  const topProduct = await prisma.order_items.findMany({
    where: {
      orders: {
        store_id,
        ...completedOrderFilter,
      },
    },
    select: {
      product_id: true,
      product_name: true,
      product_image_url: true,
      quantity: true,
    },
  });
  const productMap: Record<
    string,
    {
      product_id: string;
      name: string;
      image_url: string | null;
      quantity_sold: number;
    }
  > = {};

  topProduct.forEach((items) => {
    if (!items.product_id) return;
    const existingProduct = productMap[items.product_id];
    if (existingProduct) {
      existingProduct.quantity_sold += items.quantity;
    } else {
      productMap[items.product_id] = {
        product_id: items.product_id,
        name: items.product_name,
        image_url: items.product_image_url,
        quantity_sold: items.quantity,
      };
    }
  });
  const data = Object.values(getTopProducts)
    .sort((a, b) => b.quantity_sold - a.quantity_sold)
    .slice(0, limit);
  return {
    data,
  };
};
