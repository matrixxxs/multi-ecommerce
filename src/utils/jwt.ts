import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { token } from "morgan";
import { sign } from "node:crypto";

const getScreat = (): string => {
  const secret = process.env.JWT_SECRET;
  return secret!;
};

export interface TokenPlayLoad {
  admin_id: number;
  store_id: number;
}

export const signinToken = (playload: TokenPlayLoad) => {
  return jwt.sign(playload, getScreat(), { expiresIn: "2d" });
};

export const verifyToken = (token: string): TokenPlayLoad => {
  const decode = jwt.verify(token, getScreat());
  if (typeof decode === "string") {
    throw new Error("Unexpected token playload");
  }
  return decode as TokenPlayLoad;
};
