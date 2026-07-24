import bcrypt from "bcrypt";
import pool from "../config/db";
import crypto from "crypto";
import {
  UnauthorizedError,
  FakeStatus,
  ConflictError,
  NotAllowed,
} from "../error/error";
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

// Create a new admin user
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

// Check email/password match for login
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
