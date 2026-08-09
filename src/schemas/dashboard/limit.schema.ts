import z from "zod";
export const limitSchema = z.object({
  limit: z.coerce.number().positive().default(5),
});
