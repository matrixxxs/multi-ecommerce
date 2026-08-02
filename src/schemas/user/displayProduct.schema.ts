import z from "zod";

export const displayProductSchema = z.object({
  name: z.string().trim().optional(),
  category: z.string().optional(),
  limit: z.coerce.number().positive().max(100).default(10),
  page: z.coerce.number().positive().default(1),
});
