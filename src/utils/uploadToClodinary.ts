import cloudinary from "../config/cloudinary";
import { UploadApiResponse } from "cloudinary";

export const uploadBufferToCloudinary = (
  buffer: Buffer,
): Promise<UploadApiResponse> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: "multi-ecommerce" },
      (error, result) => {
        if (error) {
          reject(error);
        } else if (result) {
          resolve(result);
        } else {
          reject(
            new Error(
              "Image upload failed: Cloudinary returned no upload result.",
            ),
          );
        }
      },
    );
    uploadStream.end(buffer);
  });
};
