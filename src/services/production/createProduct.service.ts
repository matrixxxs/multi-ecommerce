import pool from "../../config/db";
import prisma from "../../config/prisma";
import {
  uploadBufferToCloudinary,
  deleteFromCloudinary,
} from "../../utils/uploadToClodinary";
export interface CreateProduct {
  name: string;
  description: string;
  in_stock: boolean;
  category: string;
  price: number;
  qty: number;
}

export interface Product {
  id: string;
  store_id: string;
  name: string;
  description: string;
  image_url: string;
  image_public_id: string | null;
  in_stock: boolean;
  category: string;
  price: number;
  qty: number;
}
interface UploadedImage {
  secure_url: string;
  public_id: string;
}

export const uploadImage = async (
  data: Express.Multer.File[],
): Promise<UploadedImage[]> => {
  const result = Promise.all(
    data.map(async (image) => {
      const res = await uploadBufferToCloudinary(image.buffer);
      return {
        secure_url: res.secure_url,
        public_id: res.public_id,
      };
    }),
  );
  return result;
};

export const createProduct = async (
  data: CreateProduct,
  buffer: Buffer,
  store_id: string,
): Promise<Product> => {
  let uploadedImage: UploadedImage | null = null;

  try {
    uploadedImage = await uploadImage(buffer);
    const image_url = uploadedImage.secure_url;
    const image_public_id = uploadedImage.public_id;

    const product = await prisma.products.create({
      data: {
        store_id,
        name: data.name,
        category: data.category,
        description: data.description,
        image_url: image_url,
        image_public_id: image_public_id,
        price: data.price,
        in_stock: data.in_stock,
        qty: data.qty,
      },
      select: {
        store_id: true,
        id: true,
        name: true,
        category: true,
        price: true,
        description: true,
        in_stock: true,
        image_url: true,
        image_public_id: true,
        qty: true,
      },
    });

    if (!product) {
      throw new Error("Failed to create product");
    }

    return {
      ...product,
      price: product.price.toNumber(),
      qty: product.qty ?? 0,
    };
  } catch (error) {
    if (uploadedImage) {
      try {
        await deleteFromCloudinary(uploadedImage.public_id);
      } catch (cleanupError) {
        console.error("Failed to delete image from Cloudinary:", cleanupError);
      }
    }
    throw error;
  }
};
