import z from "zod";

export const createProduct = z.object({
  name: z.string().trim().min(6),
  description: z.string().min(10),
  in_stock: z.coerce.boolean(),
  category: z.string(),
  price: z.coerce.number().positive(),
});
