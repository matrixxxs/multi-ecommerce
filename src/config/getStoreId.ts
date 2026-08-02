import { NotFound } from "../error/error";
import prisma from "./prisma";
export const getStoreId = async (slug: string): Promise<string> => {
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
