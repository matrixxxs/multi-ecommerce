import prisma from "../../config/prisma";
import { Prisma } from "../../../generated/prisma/client";
import { getStoreId } from "../../config/getStoreId";
import { NotFound } from "../../error/error";
export interface ProductToken {
  name?: string;
  category?: string;
  limit: number;
  page: number;
}

export interface DisplayProduct {
  id: string;
  store_id: string;
  name: string;
  description: string;
  images: {
    image_url: string;
    id: string;
    is_main: boolean;
  }[];
  category: string;
  price: number;
  in_stock: boolean;
  qty: number | null;
}

export interface Product {
  data: DisplayProduct[];
  pagination: {
    limit: number;
    total: number;
    totalPage: number;
    currentPage: number;
  };
}

export const display = async (
  data: ProductToken,
  slug: string,
): Promise<Product> => {
  const store_id = await getStoreId(slug);
  const where: Prisma.productsWhereInput = {
    store_id,
    is_deleted: false,
  };
  if (data.name) {
    where.name = {
      contains: data.name,
      mode: "insensitive",
    };
  }
  if (data.category !== undefined) {
    where.category = data.category;
  }
  const offset = (data.page - 1) * data.limit;

  const [row, total] = await Promise.all([
    prisma.products.findMany({
      where,
      select: {
        id: true,
        store_id: true,
        name: true,
        category: true,
        price: true,
        description: true,
        images: {
          where: { is_main: true },
          select: {
            image_url: true,
            id: true,
            is_main: true,
          },
        },
        in_stock: true,
        qty: true,
      },
      orderBy: { created_at: "desc" },
      take: data.limit,
      skip: offset,
    }),
    prisma.products.count({ where }),
  ]);
  const finalResult = row.map((product) => ({
    ...product,
    price: product.price.toNumber(),
  }));

  return {
    data: finalResult,
    pagination: {
      limit: data.limit,
      total: total,
      totalPage: Math.ceil(total / data.limit),
      currentPage: data.page,
    },
  };
};
