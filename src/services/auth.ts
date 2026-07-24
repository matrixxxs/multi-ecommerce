import bcrypt from "bcrypt";
import pool from "../config/db";
import crypto, { hash } from "crypto";
import { UnauthorizedError, FakeStatus, ConflictError } from "../error/error";
import { token } from "morgan";
const SALTROUND = 10;

interface CreateUsers {
  email: string;
  password: string;
  store_id: string;
}

export interface Users {
  id: string;
  email: string;
  store_id: string;
}

interface UsersWithPassword extends Users {
  password: string;
}
export const createUser = async (data: CreateUsers): Promise<Users> => {
  try {
    const password_hashed = await bcrypt.hash(data.password, SALTROUND);
    const result = await pool.query<Users>(
      "INSERT INTO ecommerce.admin_users (email,password,store_id) VALUES ($1,$2,$3) RETURNING id,email,store_id",
      [data.email, password_hashed, data.store_id],
    );
    const user = result.rows[0];
    if (!user) {
      throw new Error("Failed to create user");
    }
    return user;
  } catch (err: any) {
    if (err.code === "23505") {
      throw new ConflictError("email already exist");
    }
    throw err;
  }
};

export const verifyCreditals = async (
  email: string,
  password: string,
): Promise<Users> => {
  const select = await pool.query<UsersWithPassword>(
    "SELECT id,store_id,email,password FROM ecommerce.admin_users WHERE email = $1",
    [email],
  );
  const user = select.rows[0];
  if (!user) {
    throw new UnauthorizedError("Incorrect email or password");
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new UnauthorizedError("Incorrect email or password");
  }
  return {
    id: user.id,
    email: user.email,
    store_id: user.store_id,
  };
};

export interface UpdatePassword {
  email: string;
  newPassword: string;
}
interface UserReset {
  id: string;
  email: string;
}
interface InsertToken {
  token: string;
  admin_id: string;
  used: boolean;
}
export const createResetToken = async (email: string): Promise<string> => {
  const search = await pool.query<UserReset>(
    "SELECT id,email FROM ecommerce.admin_users WHERE email =$1",
    [email],
  );
  const lookUp = search.rows[0];
  if (!lookUp) {
    throw new FakeStatus("If this email exists, a reset link has been sent");
  }
  const token = crypto.randomBytes(32).toString("hex");
  const token_hash = crypto.createHash("sha256").update(token).digest("hex");
  const insert_token = await pool.query<InsertToken>(
    "INSERT INTO ecommerce.password_reset_token(admin_id,token,used) VALUES ($1,$2,$3) RETURNING admin_id,token,used",
    [lookUp.id, token_hash, false],
  );

  return token;
};

export const verifyResetToken = async (token: string): Promise<void> => {
  const token_hash = crypto.createHash("sha256").update(token).digest("hex");

  const result = await pool.query(
    "SELECT id,admin_id,used FROM ecommerce.password_reset_token WHERE token = $1",
    [token_hash],
  );

  const row = result.rows[0];
};
