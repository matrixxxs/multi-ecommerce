import { number } from "zod";
import prisma from "../../../config/prisma";
import { completedOrderFilter } from "../../../utils/completedOrderFilter";

export interface RevenueResult {
  data: {
    date: string; // "YYYY-MM-DD"
    revenue: number;
  }[];
}

export const getRevenue = async (store_id: string): Promise<RevenueResult> => {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
  sevenDaysAgo.setHours(0, 0, 0, 0);
  const orders = await prisma.orders.findMany({
    where: {
      store_id,
      ...completedOrderFilter,
      created_at: {
        gte: sevenDaysAgo,
      },
    },
    include: {
      order_items: true,
    },
  });

  const data: Record<string, number> = {};

  for (let i = 0; i < 7; i++) {
    const date = new Date(sevenDaysAgo);
    date.setDate(date.getDate() + i);

    const dateKey = date.toISOString().split("T")[0];
    data[dateKey] = 0;
  }

  orders.forEach((order) => {
    const date = order.created_at?.toISOString().split("T")[0];
    if (!date) return;

    const orderRevenue = order.order_items.reduce(
      (sum, item) => sum + Number(item.product_price) * item.quantity,
      0,
    );

    data[date] = (data[date] || 0) + orderRevenue;
  });

  return {
    data: Object.entries(data).map(([date, revenue]) => ({
      date,
      revenue,
    })),
  };
};
