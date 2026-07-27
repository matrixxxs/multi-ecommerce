import pool from "../../config/db";
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
  price: number;
}

interface UpdateProductData {
  name?: string;
  category?: string;
  in_stock?: boolean;
  image_url?: string;
  price?: number;
  image_public_id: string;
}

const UploadImage = async (buffer: Buffer): Promise<UpdateImage> => {
  const result = await uploadBufferToCloudinary(buffer);
  if (!result) {
    throw new Error("buffer");
  }
  return {
    secure_url: result.secure_url,
    public_id: result.public_id,
  };
};

const updateProduct = async (
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
      "SELECT image_public_id,image_url FROM ecommerce.products WHERE id = $1 AND store_id = $2",
      [id, store_id],
    );
    if (select.rows.length === 0) {
      throw new Error("Product not found.");
    }
    const oldImage = select.rows[0];
    let imageUrl = oldImage.image_url;
    let publicId = oldImage.image_public_id;
    if (buffer) {
      uploadImage = await UploadImage(buffer);
      const newImage = uploadImage;
      ((imageUrl = newImage.secure_url), (publicId = newImage.public_id));
    }
    const query = ` UPDATE ecommerce.products
    SET
    name = $1,
    category = $2,
    in_stock = $3,
    image_url = $4,
          image_public_id = $5,
          price = $6
      WHERE id = $7
      AND store_id = $8
      RETURNING
      id,
      name,
      category,
      in_stock,
      image_url,
      image_public_id
      price;
      `;
    const value: Array<string | number | boolean | undefined> = [
      data.name,
      data.category,
      data.in_stock,
      imageUrl,
      publicId,
      data.price,
      id,
      store_id,
    ];
    const result = await pool.query<UpdatedProduct>(query, value);
    if (buffer && oldImage.image_public_id) {
      await deleteFromCloudinary(oldImage.image_public_id);
    }
    return result.rows[0];
  } catch (error) {
    if (uploadImage) {
      try {
        await deleteFromCloudinary(uploadImage.public_id);
      } catch (catchError) {
        console.error(
          `failed to deleate the orphan image from cloudinary:`,
          catchError,
        );
      }
    }
    throw error;
  }
};
