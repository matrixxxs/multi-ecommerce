import z from "zod";

export const product = z
  .object({
    // Optional text filters — plain string match / partial search
    category: z.string().min(1).optional(),
    name: z.string().trim().min(1).optional(),

    // Stock filter — comes in as "true"/"false" string, converted to real boolean
    in_stock: z
      .enum(["true", "false"])
      .transform((val) => val === "true")
      .optional(),

    // Price range filters — coerced from string query params to numbers
    minPrice: z.coerce.number().positive().optional(),
    maxPrice: z.coerce.number().positive().optional(),

    // Pagination — always have a value, so no `.optional()` (default() already handles "missing")
    limit: z.coerce.number().positive().max(100).default(10),
    page: z.coerce.number().positive().default(1),
  })
  // Cross-field check — reject nonsensical ranges like minPrice=100, maxPrice=10
  .refine(
    (data) =>
      data.minPrice === undefined ||
      data.maxPrice === undefined ||
      data.minPrice <= data.maxPrice,
    {
      message: "minPrice can not be greater than maxPrice",
      path: ["minPrice"],
    },
  );
