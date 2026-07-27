import z from "zod";

export const update = z.object({
  name: z.string().optional(),
  categoty: z.string().optional(),
  description: z.string().optional(),
  price: z.coerce.number().optional(),
  image_ur: z.string().optional(),
});
