import z from "zod";

export const userProduct = z.object({
  name: z.string().trim().min(1).optional(),
  category: z.string().min(1).default("All").optional(),
});
