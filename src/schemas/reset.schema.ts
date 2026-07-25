import z from "zod";

export const forget_password = z.object({
  email: z.string().trim().email(),
});

export const reset_password_schema = z.object({
  token: z.string(),
  newPassword: z.string().min(8),
});
