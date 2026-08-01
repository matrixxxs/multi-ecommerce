import prisma from "../../config/prisma";
import { Prisma } from "../../../generated/prisma/browser";
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
  image_url: string;
  category: string;
  price: number;
}

export interface Product {
  data: DisplayProduct[];
  pagination: {
    limit: number;
    total: number;
    totalPage: number;
    current: number;
  };
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
export const display = async (
  date: ProductToken,
  slug: string,
): Promise<Product> => {
  const store_id = await getStoreId(slug);
  const where: Prisma.productsWhereInput = {
    store_id,
    is_deleted: false,
  };
  if (date.name) {
    where.name = {
      contains: date.name,
      mode: "insensitive",
    };
  }
  if (date.category !== "All") {
    where.category = date.category;
  }
  const offset = (date.page - 1) * date.limit;

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
        image_url: true,
      },
      orderBy: { created_at: "desc" },
      take: date.limit,
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
      limit: date.limit,
      total: total,
      totalPage: Math.ceil(total / date.limit),
      current: date.page,
    },
  };
};
