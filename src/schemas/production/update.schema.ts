import z from "zod";

export const updateScheme = z.object({
  name: z.string().trim().min(3).optional(),
  description: z.string().min(10).optional(),
  category: z.string().optional(),
  in_stock: z
    .enum(["true", "false"])
    .transform((val) => val === "true")
    .optional(),
  price: z.coerce.number().optional(),
  qty: z.coerce.number().int().optional(),
  image_id: z.string().uuid().optional(),
});
