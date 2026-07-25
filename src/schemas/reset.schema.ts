import z from "zod";

export const forget_password = z.object({
  email: z.string().trim().email(),
});

export const reset_password_schema = z
  .object({
    token: z.string(),
    newPassword: z.string().min(8),
    confirmPassword: z.string(),
  })
  .refine((date) => date.newPassword === date.confirmPassword, {
    message: "Password do not match",
    path: ["confirmPassword"],
  });
