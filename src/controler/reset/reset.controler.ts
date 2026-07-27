import { Request, Response, NextFunction } from "express";
import {
  createResetToken,
  resetPassword,
  verifyResetToken,
} from "../../services/reset.service";

import { sendResetEmail } from "../../services/email.service";
// Request a password reset link (generates + stores token)
export const resetToken = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const { email } = req.body;
  const rawToken = await createResetToken(email);

  await sendResetEmail(email, rawToken);
  res.status(200).json("A reset link as been sent");
};

// Verify token + update password
export const reset_password = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const { resetToken, newPassword } = req.body;

  await resetPassword(resetToken, newPassword);

  res.status(200).json("Password reset successful");
};
