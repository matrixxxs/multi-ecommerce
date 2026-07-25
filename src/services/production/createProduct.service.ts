import pool from "../../config/db";
import { uploadBufferToCloudinary } from "../../utils/uploadToClodinary";
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
  in_stock: boolean;
  category: string;
  price: number;
}
export const uploadImage = async (buffer: Buffer): Promise<string> => {
  const result = await uploadBufferToCloudinary(buffer);
  return result.secure_url;
};

export const createProduct = async (
  data: CreateProduct,
  buffer: Buffer,
  store_id: string,
): Promise<Product> => {
  const image_url = await uploadImage(buffer);

  const insert = await pool.query<Product>(
    `
    INSERT INTO ecommerce.products 
    (store_id,name, description, price, image_url, category, in_stock)
    VALUES ($1,$2,$3,$4,$5,$6,$7)
    RETURNING id,name,description,price,image_url,category,in_stock,store_id
    `,
    [
      store_id,
      data.name,
      data.description,
      data.price,
      image_url,
      data.category,
      data.in_stock,
    ],
  );

  const product = insert.rows[0];

  if (!product) {
    throw new Error("Failed to create product");
  }

  return product;
};
