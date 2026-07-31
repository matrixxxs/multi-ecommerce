import { deleteFromCloudinary } from "../../utils/uploadToClodinary";
import prisma from "../../config/prisma";
import { Prisma } from "../../../generated/prisma/client";
import { NotFound } from "../../error/error";

export const deleteProduct = async (
  store_id: string,
  id: string,
): Promise<void> => {
  try {
    await prisma.products.update({
      where: { id, store_id, is_deleted: false },
      data: {
        is_deleted: true,
        deleted_at: new Date(),
      },
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      throw new NotFound("Product not found");
    }
    throw error;
  }
};

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  image_public_id: string;
  category: string;
  in_stock: boolean;
  store_id: string;
  is_deleted: boolean;
  deleted_at: Date | null;
  created_at: Date;
}

export const cleanupDeletedProducts = async (): Promise<void> => {
  const fifteenDaysAgo = new Date();
  fifteenDaysAgo.setDate(fifteenDaysAgo.getDate() - 15);

  const get_deleted_products = await prisma.products.findMany({
    where: {
      is_deleted: true,
      deleted_at: { lte: fifteenDaysAgo },
    },
    select: {
      id: true,
      name: true,
      category: true,
      description: true,
      price: true,
      image_public_id: true,
      image_url: true,
      in_stock: true,
      deleted_at: true,
      created_at: true,
      is_deleted: true,
      store_id: true,
      qty: true,
    },
  });

  for (const product of get_deleted_products) {
    try {
      if (product.image_public_id) {
        await deleteFromCloudinary(product.image_public_id);
      }
      await prisma.products.delete({
        where: { id: product.id },
      });
    } catch (error) {
      console.error(`Failed to clean up product ${product.id}:`, error);
    }
  }
};
