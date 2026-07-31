import z from "zod";

export const createProduct = z.object({
  name: z.string().trim().min(3),
  description: z.string().min(10),
  in_stock: z.enum(["true", "false"]).transform((val) => val === "true"),
  category: z.string(),
  price: z.coerce.number().positive(),
  qty: z.coerce.number().int().min(0),
});
