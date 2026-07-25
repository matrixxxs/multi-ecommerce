import { verifyToken } from "../utils/jwt";
import { UnauthorizedError } from "../error/error";
import { Request, Response, NextFunction } from "express";
export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.header("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new UnauthorizedError("Access denied");
  }
  const token = authHeader.split(" ")[1] as string;
  try {
    const decoded = verifyToken(token);
    req.admin = decoded;
    next();
  } catch (error) {
    next(new UnauthorizedError("Invalid token or expired token"));
  }
};
