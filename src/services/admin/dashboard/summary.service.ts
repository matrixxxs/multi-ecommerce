import prisma from "../../../config/prisma";

export interface SummaryResult {
  totalRevenue: number;
  totalOrders: number;
  pendingOrders: number;
  lowStockCount: number;
}
import { completedOrderFilter } from "../../../utils/completedOrderFilter";

export const getSummary = async (store_id: string): Promise<SummaryResult> => {
  const revenueAggregate = await prisma.orders.findMany({
    where: {
      store_id,
      ...completedOrderFilter,
    },
    select: {
      order_items: {
        select: {
          product_price: true,
          quantity: true,
        },
      },
    },
  });
  const totalRevenue = revenueAggregate.reduce((sum, product) => {
    const sumPrice = product.order_items.reduce(
      (sum, product) => sum + Number(product.product_price) * product.quantity,
      0,
    );
    return sum + sumPrice;
  }, 0);

  const totalOrders = await prisma.orders.count({
    where: { store_id },
  });
  const pendingOrders = await prisma.orders.count({
    where: {
      store_id,
      status: "pending",
    },
  });
  const lowStockCount = await prisma.products.count({
    where: {
      store_id,
      is_deleted: false,
      qty: {
        lte: 3,
      },
    },
  });

  return {
    totalRevenue,
    totalOrders,
    pendingOrders,
    lowStockCount,
  };
};
