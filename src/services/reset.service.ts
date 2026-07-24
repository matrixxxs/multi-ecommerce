import pool from "../config/db";
import { NotAllowed, FakeStatus } from "../error/error";
import crypto from "crypto";
import bcrypt from "bcrypt";

const SALTROUND = 10;

interface UserReset {
  id: string;
  email: string;
}
interface InsertToken {
  token: string;
  admin_id: string;
  used: boolean;
}

interface VerifyToken {
  id: string;
  admin_id: string;
  used: boolean;
  expires_at: Date;
}

// Generate + store a password reset token for a given email
export const createResetToken = async (email: string): Promise<string> => {
  const search = await pool.query<UserReset>(
    "SELECT id,email FROM ecommerce.admin_users WHERE email = $1",
    [email],
  );
  const lookup = search.rows[0];
  if (!lookup) {
    throw new FakeStatus("A reset link as been sent");
  }
  const token = crypto.randomBytes(32).toString("hex");
  const hash_token = crypto.createHash("sha256").update(token).digest("hex");
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    await client.query(
      "UPDATE ecommerce.password_reset_tokens SET used = true WHERE admin_id = $1",
      [lookup.id],
    );

    await client.query<InsertToken>(
      "INSERT INTO ecommerce.password_reset_tokens (admin_id,token,used) VALUES ($1,$2,$3)",
      [lookup.id, hash_token, false],
    );
    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }

  return token;
};

// Check a raw reset token is valid, unused, and unexpired
export const verifyResetToken = async (
  token: string,
): Promise<{ id: string; admin_id: string }> => {
  const hash_token = crypto.createHash("sha256").update(token).digest("hex");
  const result = await pool.query<VerifyToken>(
    "SELECT id,admin_id,used, expires_at FROM ecommerce.password_reset_tokens WHERE token = $1 ",
    [hash_token],
  );
  const row = result.rows[0];
  if (!row) {
    throw new NotAllowed("Invalid or expired token");
  }
  if (row.used === true) {
    throw new NotAllowed("Invalid or expired token");
  }
  if (new Date() > row.expires_at) {
    throw new NotAllowed("Invalid or expired token");
  }
  return {
    id: row.id,
    admin_id: row.admin_id,
  };
};

// Verify token, then update password + mark token used (transaction)
export const resetPassword = async (token: string, newPassword: string) => {
  const user = await verifyResetToken(token);
  const hash_newPassword = await bcrypt.hash(newPassword, SALTROUND);
  const client = await pool.connect();

  try {
    await client.query("BEGIN");
    await client.query(
      "UPDATE ecommerce.admin_users SET password = $1 WHERE id = $2",
      [hash_newPassword, user.admin_id],
    );
    await client.query(
      "UPDATE ecommerce.password_reset_tokens SET used = TRUE WHERE id = $1",
      [user.id],
    );
    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};
