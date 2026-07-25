import z from "zod";

export const createProduct = z.object({
  name: z.string().trim(),
  description: z.string(),
  image_url: z.file(),
  in_stock: z.boolean(),
  category: z.string(),
  price: z.number(),
});
