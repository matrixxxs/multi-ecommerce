import z, { coerce } from "zod";

export const productId = z.object({
  id: z.string(),
});
