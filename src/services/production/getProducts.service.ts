import prisma from "../../config/prisma";
import { Prisma } from "../../../generated/prisma/client";

// Input shape after schema validation + store_id from JWT
export interface ProductTokens {
  name?: string;
  category?: string;
  in_stock?: boolean;
  page: number;
  limit: number;
  maxPrice?: number;
  minPrice?: number;
}

// Single product row shape
interface Product {
  id: string;
  store_id: string;
  name: string;
  description: string;
  image_url: string;
  in_stock: boolean;
  category: string;
  price: number;
  created_at: Date | null;
  qty: number | null;
}

// Final response shape returned to the client
interface PaginatedProducts {
  data: Product[];
  pagination: {
    currentPage: number;
    limit: number;
    total: number;
    totalPage: number;
  };
}

export const getProducts = async (
  data: ProductTokens,
  store_id: string,
): Promise<PaginatedProducts> => {
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
  if (data.category) {
    where.category = data.category;
  }
  if (data.in_stock !== undefined) {
    where.in_stock = data.in_stock;
  }
  if (data.minPrice !== undefined || data.maxPrice !== undefined) {
    where.price = {};
    if (data.minPrice !== undefined) where.price.gte = data.minPrice;
    if (data.maxPrice !== undefined) where.price.lte = data.maxPrice;
  }
  const offset = (data.page - 1) * data.limit;

  const [rows, total] = await Promise.all([
    prisma.products.findMany({
      where,
      select: {
        id: true,
        name: true,
        category: true,
        description: true,
        price: true,
        in_stock: true,
        image_url: true,
        store_id: true,
        created_at: true,
        qty: true,
      },
      orderBy: { created_at: "desc" },
      take: data.limit,
      skip: offset,
    }),
    prisma.products.count({ where }),
  ]);

  const finalResult = rows.map((product) => ({
    ...product,
    price: product.price.toNumber(),
  }));

  return {
    data: finalResult,
    pagination: {
      currentPage: data.page,
      limit: data.limit,
      total,
      totalPage: Math.ceil(total / data.limit),
    },
  };
};
