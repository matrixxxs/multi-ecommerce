import prisma from "../../config/prisma";
import { Prisma } from "../../../generated/prisma/client";
import { NotFound } from "../../error/error";
import {
  uploadBufferToCloudinary,
  deleteFromCloudinary,
} from "../../utils/uploadToClodinary";

export interface UpdateImage {
  secure_url: string;
  public_id: string;
}
interface UpdatedProduct {
  id: string;
  name: string;
  category: string;
  in_stock: boolean;
  image_url: string;
  image_public_id: string | null;
  price: number;
  description: string;
  qty: number;
}

export interface UpdateProductData {
  name?: string;
  category?: string;
  in_stock?: boolean;
  price?: number;
  description?: string;
  qty?: number;
}

const UploadImage = async (buffer: Buffer): Promise<UpdateImage> => {
  const result = await uploadBufferToCloudinary(buffer);
  if (!result) {
    throw new Error("Cloudinary upload failed: no result returned");
  }
  return {
    secure_url: result.secure_url,
    public_id: result.public_id,
  };
};
export const updateProduct = async (
  data: UpdateProductData,
  store_id: string,
  id: string,
  buffer?: Buffer,
): Promise<UpdatedProduct> => {
  let uploadImage: UpdateImage | null = null;
  try {
    const oldImage = await prisma.products.findFirst({
      where: { id, store_id },
      select: {
        image_public_id: true,
        image_url: true,
      },
    });
    if (!oldImage) {
      throw new NotFound("Product not found");
    }

    let image_url = oldImage.image_url;
    let public_id = oldImage.image_public_id;

    if (buffer) {
      uploadImage = await UploadImage(buffer);
      image_url = uploadImage.secure_url;
      public_id = uploadImage.public_id;
    }

    const result = await prisma.products.update({
      where: { id, store_id },
      data: {
        name: data.name,
        category: data.category,
        description: data.description,
        price: data.price,
        in_stock: data.in_stock,
        image_url,
        image_public_id: public_id,
        qty: data.qty,
      },
      select: {
        id: true,
        store_id: true,
        name: true,
        description: true,
        image_url: true,
        in_stock: true,
        category: true,
        price: true,
        image_public_id: true,
        qty: true,
      },
    });

    if (buffer && oldImage.image_public_id) {
      await deleteFromCloudinary(oldImage.image_public_id);
    }

    return { ...result, price: result.price.toNumber(), qty: result.qty ?? 0 };
  } catch (error) {
    console.error("updateProduct failed:", error);

    if (uploadImage) {
      try {
        await deleteFromCloudinary(uploadImage.public_id);
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
