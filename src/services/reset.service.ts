import prisma from "../config/prisma";
import { Prisma } from "../../generated/prisma/client";
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
  const lookup = await prisma.admin_users.findFirst({
    where: { email },
    select: {
      id: true,
      email: true,
    },
  });
  if (!lookup) {
    throw new FakeStatus("A reset link as been sent");
  }
  const token = crypto.randomBytes(32).toString("hex");
  const hash_token = crypto.createHash("sha256").update(token).digest("hex");
  await prisma.$transaction([
    prisma.password_reset_tokens.updateMany({
      where: { admin_id: lookup.id },
      data: { used: true },
    }),
    prisma.password_reset_tokens.create({
      data: {
        admin_id: lookup.id,
        used: false,
        token: hash_token,
      },
    }),
  ]);

  return token;
};

// Check a raw reset token is valid, unused, and unexpired
export const verifyResetToken = async (
  token: string,
): Promise<{ id: string; admin_id: string }> => {
  const hash_token = crypto.createHash("sha256").update(token).digest("hex");

  const row = await prisma.password_reset_tokens.findUnique({
    where: { token: hash_token },
    select: {
      id: true,
      admin_id: true,
      used: true,
      expires_at: true,
    },
  });
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

  await prisma.$transaction([
    prisma.admin_users.update({
      where: { id: user.admin_id },
      data: {
        password: hash_newPassword,
      },
    }),
    prisma.password_reset_tokens.update({
      where: { id: user.id },
      data: { used: true },
    }),
  ]);
};
