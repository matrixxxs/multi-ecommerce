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
}

export interface Product {
  id: string;
  store_id: string;
  name: string;
  description: string;
  image_url: string;
  image_public_id: string;
  in_stock: boolean;
  category: string;
  price: number;
}
interface UploadedImage {
  secure_url: string;
  public_id: string;
}
export const uploadImage = async (buffer: Buffer): Promise<UploadedImage> => {
  const result = await uploadBufferToCloudinary(buffer);
  return {
    secure_url: result.secure_url,
    public_id: result.public_id,
  };
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

    const insert = await pool.query<Product>(
      `
    INSERT INTO ecommerce.products 
    (store_id,name, description, price, image_url,image_public_id, category, in_stock)
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
    RETURNING id,name,description,price,image_url,category,in_stock,store_id
    `,
      [
        store_id,
        data.name,
        data.description,
        data.price,
        image_url,
        image_public_id,
        data.category,
        data.in_stock,
      ],
    );

    // const product = prisma.products.create({
    //   data:{
    //     name: data.name,
    //     category:data.category,
    //     description: data.description,
    //     price:data.price,
    //     in_stock:data.in_stock

    //   },
    //   se
    // })

    if (!product) {
      throw new Error("Failed to create product");
    }

    return product;
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
