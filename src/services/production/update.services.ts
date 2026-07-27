import pool from "../../config/db";
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
  image_public_id: string;
  price: number;
}

interface UpdateProductData {
  name?: string;
  category?: string;
  in_stock?: boolean;
  price?: number;
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
    const select = await pool.query<{
      image_url: string;
      image_public_id: string;
    }>(
      "SELECT image_url, image_public_id FROM ecommerce.products WHERE id = $1 AND store_id = $2",
      [id, store_id],
    );
    if (select.rows.length === 0) {
      throw new NotFound("Product not found");
    }
    const oldImage = select.rows[0];
    let image_url = oldImage.image_url;
    let public_id = oldImage.image_public_id;
    if (buffer) {
      uploadImage = await UploadImage(buffer);
      image_url = uploadImage.secure_url;
      public_id = uploadImage.public_id;
    }
    const query = `
UPDATE ecommerce.products
SET 
    name =  COLESCE($1,name),
    category = ($2,category),
    in_stock = ($3,in_stock),
    image_url = $4,
    image_public_id = $5,
    price = ($6,price)
WHERE id = $7 
AND store_id = $8
RETURNING
    id,
    name,
    category,
    in_stock,
    image_url,
    image_public_id,
    price;
`;
    const value: Array<string | boolean | number | undefined> = [
      data.name,
      data.category,
      data.in_stock,
      image_url,
      public_id,
      data.price,
      id,
      store_id,
    ];

    const result = await pool.query<UpdatedProduct>(query, value);
    if (result.rows.length === 0) {
      throw new NotFound("Product not found");
    }
    if (buffer && oldImage.image_public_id) {
      await deleteFromCloudinary(oldImage.image_public_id);
    }
    return result.rows[0];
  } catch (error) {
    if (uploadImage) {
      try {
        await deleteFromCloudinary(uploadImage.public_id);
      } catch (err) {
        console.error("faild to delete orphan from cloudinary:0", err);
      }
    }
    throw error;
  }
};
