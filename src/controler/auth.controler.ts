import { Request, Response, NextFunction } from "express";
import { signinToken } from "../utils/jwt";
import { createUser } from "../services/auth";
import { verifyCreditals } from "../services/auth";

export const signup = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const { email, password, store_id } = req.body;

  const token = await createUser({
    email,
    password,
    store_id,
  });
  res.status(200).json({ token });
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const { email, password } = req.body;
  const token = await verifyCreditals(email, password);
  res.status(200).json({ token });
};
