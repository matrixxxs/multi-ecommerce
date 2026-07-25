import { Request, Response, NextFunction } from "express";
import { signinToken } from "../utils/jwt";
import { createUser, verifyCreditals } from "../services/auth.service";
import {
  createResetToken,
  resetPassword,
  verifyResetToken,
} from "../services/reset.service";

import { sendResetEmail } from "../services/email.service";
// Create a new admin user (manual onboarding, no auto-login)
export const signup = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const { email, password, store_id } = req.body;

  const user = await createUser({
    email,
    password,
    store_id,
  });
  res.status(201).json({ user: user });
};

// Verify credentials and issue a JWT
export const login = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const { email, password } = req.body;
  const user = await verifyCreditals(email, password);
  const token = signinToken({ admin_id: user.id, store_id: user.store_id });
  res.status(200).json({ user, token });
};

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
