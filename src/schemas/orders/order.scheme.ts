import z from "zod";

export const order = z.object({
  name: z.string().min(3),
  phone_number: z.coerce.number(),
  adress: z.string(),
  qty: z.coerce.number().int().min(0),
});
