import z, { coerce } from "zod";

export const productByIdParams = z.object({
  id: z.string().uuid(),
  slug: z.string(),
});

export const productSlugParams = z.object({
  slug: z.string(),
});
