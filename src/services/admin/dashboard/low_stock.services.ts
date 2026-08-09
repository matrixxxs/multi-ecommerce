import prisma from "../../../config/prisma";

export interface LowStockResult {
  data: {
    id: string;
    name: string;
    qty: number;
    image_url: string | null;
  }[];
}

export const getLowStock = async (
  store_id: string,
): Promise<LowStockResult> => {
  const lowStock = await prisma.products.findMany({
    where: {
      store_id,
      is_deleted: false,
      qty: {
        lte: 3,
      },
    },
    select: {
      id: true,
      name: true,
      qty: true,
      images: {
        where: {
          is_main: true,
        },
        select: {
          image_url: true,
        },
      },
    },
    orderBy: {
      qty: "asc",
    },
  });

  return {
    data: lowStock.map((product) => ({
      id: product.id,
      name: product.name,
      qty: product.qty ?? 0,
      image_url: product.images[0]?.image_url ?? null,
    })),
  };
};
