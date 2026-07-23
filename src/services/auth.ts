import bcrypt from "bcrypt";
import pool from "../config/db";
import { UnauthorizedError, NotAllowed } from "../error/error";
const SALTROUND = 10;
interface Signup {
  email: string;
  password: string;
}

export const createUser = async (user: Signup) => {
  const password_hashed = bcrypt.hash(user.password, SALTROUND);
  const result = await pool.query<Signup>(
    "INSERT INTO admin_users (email,password) VALUES ($1,$2) RETURNING email,password",
    [user.email, password_hashed],
  );
};

export const verifyCreditals = async (user: Signup) => {
  const select = await pool.query<Signup>(
    "SELECT email,password FROM admin_users WHERE email = $1",
    [user.email],
  );
  const password = select.rows[0]?.password;
  if (!password) {
    throw new UnauthorizedError("Invalid credentials");
  }

  const isMatch = await bcrypt.compare(user.password, password);
  if (!isMatch) {
    throw new NotAllowed("Incorrect email or password");
  }
};
