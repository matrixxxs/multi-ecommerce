import z from "zod";

export const order_schema = z.object({
  customer_name: z.string().min(3),
  customer_phone: z.string().min(10).max(15),
  customer_address: z.string().max(255),
  items: z
    .array(
      z.object({
        product_id: z.string().uuid().min(1),
        quantity: z.number().int().min(1),
      }),
    )
    .min(1),
});
