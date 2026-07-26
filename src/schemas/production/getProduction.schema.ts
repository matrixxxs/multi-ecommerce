import z from "zod";

const product = z.object({
  category: z.string(),
  name: z.string(),
});
