import { Request, Response, NextFunction } from "express";
import { signinToken } from "../../utils/jwt";
import {
  createUser,
  verifyCreditals,
} from "../../services/admin/auth/auth.service";

// Create a new admin user (manual onboarding, no auto-login)
export const signup = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { email, password, store_id } = req.body;

    const user = await createUser({
      email,
      password,
      store_id,
    });
    res.status(201).json({ user: user });
  } catch (error) {
    next(error);
  }
};

// Verify credentials and issue a JWT
export const login = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { email, password } = req.body;
    const user = await verifyCreditals(email, password);
    const token = signinToken({ admin_id: user.id, store_id: user.store_id });
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 4 * 24 * 60 * 60 * 1000,
    });
    res.status(200).json({ user });
  } catch (error) {
    next(error);
  }
};
export const logOut = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  });
  res.status(200).json({ message: "Logged out" });
};
