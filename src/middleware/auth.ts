import { verifyToken } from "../utils/jwt";
import { UnauthorizedError } from "../error/error";
import { Request, Response, NextFunction } from "express";
export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const token = req.cookies.token;
  if (!token) {
    return next(new UnauthorizedError("Access denied"));
  }
  try {
    const decoded = verifyToken(token);
    req.admin = decoded;
    next();
  } catch (error) {
    next(new UnauthorizedError("Invalid token or expired token"));
  }
};
