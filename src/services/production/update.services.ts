import prisma from "../../config/prisma";
import { Prisma } from "../../../generated/prisma/client";
import { NotFound } from "../../error/error";
import {
  uploadBufferToCloudinary,
  deleteFromCloudinary,
} from "../../utils/uploadToClodinary";
import { uploadImage } from "./createProduct.service";
export interface UpdateImage {
  secure_url: string;
  public_id: string;
}
interface UpdatedProduct {
  id: string;
  name: string;
  category: string;
  in_stock: boolean;
  price: number;
  description: string;
  qty: number;
  product_image: {
    id: string;
    image_url: string;
    image_public_id: string | null;
    is_main: boolean;
  }[];
}

export interface UpdateProductData {
  name?: string;
  category?: string;
  in_stock?: boolean;
  price?: number;
  description?: string;
  qty?: number;
}

export const updateProduct = async (
  data: UpdateProductData,
  store_id: string,
  id: string,
  files: Express.Multer.File[],
): Promise<UpdatedProduct> => {
  let uploadImages: UpdateImage[] | null = null;
  try {
    const oldImage = await prisma.products.findFirst({
      where: {
        id,
        store_id,
      },
      include: {
        images: true,
      },
    });
    if (!oldImage) {
      throw new NotFound("Product not found");
    }

    let image_url = oldImage.images?.image_url;
    let public_id = oldImage.images?.image_public_id;

    uploadImages = await uploadImage(files);
    if (files.length > 0) {
      const [image] = uploadImages;
      image_url = image.secure_url;
      public_id = image.public_id;
    }
    const finalResult = await prisma.$transaction(async (tx) => {
      const result = await tx.products.update({
        where: { id, store_id },
        data: {
          name: data.name,
          category: data.category,
          description: data.description,
          price: data.price,
          in_stock: data.in_stock,
          qty: data.qty,
        },
        select: {
          id: true,
          store_id: true,
          name: true,
          description: true,
          in_stock: true,
          category: true,
          price: true,
          qty: true,
        },
      });

      if (uploadImages && uploadImages.length > 0) {
        await Promise.all(
          uploadImages.map((image, index) =>
            tx.product_images.updateMany({
              where: { product_id: id },
              data: {
                image_url: image.secure_url ?? undefined,
                image_public_id: image.public_id ?? undefined,
                is_main: index === 0,
              },
            }),
          ),
        );
      }

      const productImageResult = await tx.product_images.findMany({
        where: { product_id: id },
        select: {
          id: true,
          image_url: true,
          image_public_id: true,
          is_main: true,
        },
      });

      return {
        result,
        productImageResult,
      };
    });

    if (finalResult !== null && oldImage.images?.image_public_id) {
      await Promise.all(
        oldImage.images.map((image) =>
          deleteFromCloudinary(image.image_public_id!),
        ),
      );
    }

    return {
      ...finalResult.result,
      price: finalResult.result.price.toNumber(),
      qty: finalResult.result.qty ?? 0,
      product_image: finalResult.productImageResult,
    };
  } catch (error) {
    console.error("updateProduct failed:", error);

    if (uploadImages) {
      try {
        await await Promise.all(
          uploadImages.map((Image) => deleteFromCloudinary(Image.public_id)),
        );
      } catch (err) {
        console.error("failed to delete orphan from cloudinary:", err);
      }
    }

    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      throw new NotFound("Product not found");
    }

    throw error;
  }
};
