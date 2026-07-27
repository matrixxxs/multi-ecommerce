import z from "zod";

export const product = z
  .object({
    category: z.string().min(1).optional(),
    name: z.string().trim().min(1).optional(),
    in_stock: z
      .enum(["true", "false"])
      .transform((val) => val === "true")
      .optional(),
    minPrice: z.coerce.number().positive().optional(),
    maxPrice: z.coerce.number().positive().optional(),
    limit: z.coerce.number().positive().max(100).default(10).optional(),
    page: z.coerce.number().positive().default(1).optional(),
  })
  .refine(
    (data) =>
      data.minPrice === undefined ||
      data.maxPrice === undefined ||
      data.minPrice <= data.maxPrice,
    {
      message: "minPrice can not be greater than maxPrice",
      path: ["minprice"],
    },
  );
