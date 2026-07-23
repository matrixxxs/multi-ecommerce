import z from "zod";

export const admin_user_schema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(8),
  store_id: z.string(),
});

export const admin_login_schema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(8),
});
