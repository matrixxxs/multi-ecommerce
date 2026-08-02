import jwt from "jsonwebtoken";

// Read JWT secret from env
const getSecret = (): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not decle");
  }
  return secret;
};

export interface TokenPayLoad {
  admin_id: string;
  store_id: string;
}

// Sign a new JWT for a logged-in admin
export const signinToken = (payload: TokenPayLoad) => {
  return jwt.sign(payload, getSecret(), { expiresIn: "7d" });
};

// Verify + decode a JWT
export const verifyToken = (token: string): TokenPayLoad => {
  const decode = jwt.verify(token, getSecret());
  if (typeof decode === "string") {
    throw new Error("Unexpected token payload");
  }
  return decode as TokenPayLoad;
};
