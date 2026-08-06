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
  is_main: boolean;
}

export interface Product {
  id: string;
  store_id: string;
  name: string;
  description: string;

  in_stock: boolean;
  category: string;
  price: number;
  qty: number;
  product_image: {
    id: string;
    image_url: string;
    image_public_id: string | null;
    is_main: boolean;
  }[];
}
interface UploadedImage {
  secure_url: string;
  public_id: string;
}

export const uploadImage = async (
  data: Express.Multer.File[],
): Promise<UploadedImage[]> => {
  const result = await Promise.all(
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
  files: Express.Multer.File[],
  store_id: string,
): Promise<Product> => {
  let uploadedImages: UploadedImage[] | null = null;

  try {
    uploadedImages = await uploadImage(files);

    const [mainImage] = uploadedImages;

    const product = await prisma.products.create({
      data: {
        store_id,
        name: data.name,
        category: data.category,
        description: data.description,
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
        qty: true,
      },
    });
    const productImage = await Promise.all(
      uploadedImages.map((images, index) =>
        prisma.product_images.create({
          data: {
            product_id: product.id,
            image_url: images.secure_url,
            image_public_id: images.public_id,
            is_main: index === 0,
          },
          select: {
            id: true,
            image_url: true,
            image_public_id: true,
            is_main: true,
          },
        }),
      ),
    );
    if (!product) {
      throw new Error("Failed to create product");
    }

    return {
      ...product,
      price: product.price.toNumber(),
      qty: product.qty ?? 0,
      product_image: productImage,
    };
  } catch (error) {
    if (uploadedImages) {
      try {
        await Promise.all(
          uploadedImages.map((Image) => deleteFromCloudinary(Image.public_id)),
        );
      } catch (cleanupError) {
        console.error("Failed to delete image from Cloudinary:", cleanupError);
      }
    }
    throw error;
  }
};
