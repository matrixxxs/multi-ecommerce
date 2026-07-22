import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";
import { ValidationError } from "../error/error";

export const ValidateBody =
  <T>(schema: ZodSchema<T>) =>
  (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      throw new ValidationError(
        JSON.stringify(result.error.flatten().fieldErrors),
      );
    }
    req.body = result.data;
    next();
  };
