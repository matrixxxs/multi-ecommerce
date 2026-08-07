import z, { coerce } from "zod";

export const product_id_image_id = z.object({
  image_id: z.string().uuid(),
  id: z.string().uuid(),
});
