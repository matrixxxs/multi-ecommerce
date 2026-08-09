import prisma from "../../../config/prisma";
import { NotFound } from "../../../error/error";

export const setMainImageServices = async (
  store_id: string,
  image_id: string,
  id: string,
) => {
  const image = await prisma.product_images.findFirst({
    where: {
      id: image_id,
      product_id: id,
    },
    include: {
      products: true,
    },
  });

  if (!image || image?.products?.store_id !== store_id) {
    throw new NotFound("Image not found");
  }
  if (image.is_main) {
    return image;
  }
  const [_, updatedImage] = await prisma.$transaction([
    prisma.product_images.updateMany({
      where: {
        product_id: id,
        is_main: true,
      },
      data: {
        is_main: false,
      },
    }),
    prisma.product_images.update({
      where: {
        id: image_id,
      },
      data: {
        is_main: true,
      },
    }),
  ]);
  return updatedImage;
};
