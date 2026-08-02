import prisma from "../../config/prisma";
import { Prisma } from "../../../generated/prisma/client";

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
  date: GetOrderToken,
  store_id: string,
): Promise<GetOrderResult> => {
  const where: Prisma.ordersWhereInput = {
    store_id,
  };
  if (date.customer_name) {
    where.customer_name = {
      contains: date.customer_name,
      mode: "insensitive",
    };
  }
  if (date.status !== undefined) {
    where.status = date.status;
  }

  const offset = (date.page - 1) * date.limit;

  const [row, total] = await Promise.all([
    prisma.orders.findMany({
      where,
      select: {
        id: true,
        customer_name: true,
        customer_phone: true,
        status: true,
        store_id: true,
        created_at: true,
      },
      orderBy: {
        created_at: "desc",
      },
      take: date.limit,
      skip: offset,
    }),
    prisma.orders.count({ where }),
  ]);

  return {
    data: row,
    pagination: {
      total,
      currentPage: date.page,
      limit: date.limit,
      totalPage: Math.ceil(total / date.limit),
    },
  };
};
