import jwt from "jsonwebtoken";

const getSecret = (): string => {
  const secret = process.env.JWT_SECRET;
  return secret!;
};

export interface TokenPlayLoad {
  admin_id: string;
  store_id: string;
}

export const signinToken = (playload: TokenPlayLoad) => {
  return jwt.sign(playload, getSecret(), { expiresIn: "2d" });
};

export const verifyToken = (token: string): TokenPlayLoad => {
  const decode = jwt.verify(token, getSecret());
  if (typeof decode === "string") {
    throw new Error("Unexpected token playload");
  }
  return decode as TokenPlayLoad;
};
