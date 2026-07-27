import path from "node:path";
import z from "zod";

const product = z
  .object({
    category: z.string().min(1).optional(),
    name: z.string().trim().min(1).optional(),
    is_stock: z
      .enum(["true", "false"])
      .transform((val) => val === "true")
      .optional(),
    minPrice: z.coerce.number().positive().optional(),
    maxPrice: z.coerce.number().positive().optional(),
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
