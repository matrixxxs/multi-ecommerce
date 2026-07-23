import { boolean, number } from "zod";
import { Request, Response, NextFunction } from "express";
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOptional: boolean;
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.isOptional = true;
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, 400);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string) {
    super(message, 401);
  }
}

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({ error: err.message });
  }
  console.log(err.message);
  res.status(500).json({ message: "something wrong happened" });
};
