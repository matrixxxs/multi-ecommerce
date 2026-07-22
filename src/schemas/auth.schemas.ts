import z from "zod";

export const admin_user = z.object({
  email: z.string().trim().email(),
  password: z.string().min(8),
});
