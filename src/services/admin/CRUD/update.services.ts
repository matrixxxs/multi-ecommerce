import prisma from "../../../config/prisma";
import { Prisma } from "../../../../generated/prisma/client";
import { NotFound, ValidationError } from "../../../error/error";
import {
  uploadBufferToCloudinary,
  deleteFromCloudinary,
} from "../../../utils/uploadToClodinary";
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

interface ProductImageRecord {
  id: string;
  created_at: Date;
  product_id: string;
  image_url: string;
  image_public_id: string | null;
  is_main: boolean;
}

export interface UpdateProductData {
  name?: string;
  category?: string;
  in_stock?: boolean;
  price?: number;
  description?: string;
  qty?: number;
  image_id?: string;
}

const MAX_IMAGES = 3;

export const updateProduct = async (
  data: UpdateProductData,
  store_id: string,
  id: string,
  files: Express.Multer.File[],
): Promise<UpdatedProduct> => {
  if (files.length > MAX_IMAGES) {
    throw new ValidationError(`Maximum ${MAX_IMAGES} images allowed`);
  }

  if (files.length > 0 && !data.image_id) {
    throw new ValidationError(
      "image_id is required when uploading a replacement image",
    );
  }

  let uploadedImages: UpdateImage[] | null = null;

  try {
    const existingProduct = await prisma.products.findFirst({
      where: {
        id,
        store_id,
      },
      include: {
        images: true,
      },
    });
    if (!existingProduct) {
      throw new NotFound("Product not found");
    }

    if (files.length > 0) {
      uploadedImages = await uploadImage(files);
    }

    const oldImages = existingProduct.images;

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
      let productImageResult: ProductImageRecord[] = (oldImages ??
        []) as ProductImageRecord[];
      if (uploadedImages && uploadedImages.length > 0) {
        const deleteImage = productImageResult.find(
          (img) => img.id === data.image_id,
        );
        const wasMain = deleteImage?.is_main ?? false;
        await tx.product_images.deleteMany({
          where: { id: data.image_id, product_id: id },
        });

        const newImage = await Promise.all(
          uploadedImages.map((image, index) =>
            tx.product_images.create({
              data: {
                product_id: id,
                image_url: image.secure_url,
                image_public_id: image.public_id,
                is_main: wasMain && index === 0,
              },
            }),
          ),
        );
        productImageResult = [
          ...productImageResult.filter((img) => img.id !== data.image_id),
          ...newImage,
        ];
      }
      return { result, productImageResult };
    });

    if (uploadedImages && uploadedImages.length > 0) {
      const deletedImage = oldImages.find((img) => img.id === data.image_id);
      if (deletedImage?.image_public_id) {
        await deleteFromCloudinary(deletedImage.image_public_id);
      }
    }

    return {
      ...finalResult.result,
      price: finalResult.result.price.toNumber(),
      qty: finalResult.result.qty ?? 0,
      product_image: finalResult.productImageResult,
    };
  } catch (error) {
    console.error("updateProduct failed:", error);

    if (uploadedImages) {
      try {
        await Promise.all(
          uploadedImages.map((Image) => deleteFromCloudinary(Image.public_id)),
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
