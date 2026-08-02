import z from "zod";
export const getOrderSchema = z.object({
  customer_name: z.string().min(3).optional(),
  status: z
    .enum(["pending", "confirmed", "shipped", "delivered", "cancelled"])
    .optional(),
  limit: z.coerce.number().positive().max(100).default(10),
  page: z.coerce.number().positive().default(1),
});
