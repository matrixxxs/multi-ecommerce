import prisma from "../../../config/prisma";
import { Prisma } from "../../../../generated/prisma/client";

interface GetOrderToken {
  customer_name?: string;
  status?: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
  limit: number;
  page: number;
}

interface GetOrder {
  id: string;
  customer_name: string;
  customer_phone: string;
  status: string;
  store_id: string;
  created_at: Date | null;
  item_count: number;
  total: number;
}

interface GetOrderResult {
  data: GetOrder[];
  pagination: {
    currentPage: number;
    limit: number;
    total: number;
    totalPage: number;
  };
}

export const getOrder = async (
  data: GetOrderToken,
  store_id: string,
): Promise<GetOrderResult> => {
  const where: Prisma.ordersWhereInput = {
    store_id,
  };
  if (data.customer_name) {
    where.customer_name = {
      contains: data.customer_name,
      mode: "insensitive",
    };
  }
  if (data.status !== undefined) {
    where.status = data.status;
  }

  const offset = (data.page - 1) * data.limit;

  const [rows, total] = await Promise.all([
    prisma.orders.findMany({
      where,
      select: {
        id: true,
        customer_name: true,
        customer_phone: true,
        status: true,
        store_id: true,
        created_at: true,
        order_items: {
          select: {
            quantity: true,
            line_total: true,
          },
        },
      },
      orderBy: {
        created_at: "desc",
      },
      take: data.limit,
      skip: offset,
    }),
    prisma.orders.count({ where }),
  ]);

  const finalResult = rows.map(({ order_items, ...order }) => ({
    ...order,
    item_count: order_items.length,
    total: order_items.reduce((sum, item) => sum + Number(item.line_total), 0),
  }));

  return {
    data: finalResult,
    pagination: {
      total,
      currentPage: data.page,
      limit: data.limit,
      totalPage: Math.ceil(total / data.limit),
    },
  };
};
