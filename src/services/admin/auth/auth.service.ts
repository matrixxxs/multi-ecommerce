import prisma from "../../../config/prisma";
import { Prisma } from "../../../../generated/prisma/client";
import bcrypt from "bcrypt";
import pool from "../../../config/db";
import crypto from "crypto";
import {
  UnauthorizedError,
  FakeStatus,
  ConflictError,
  NotAllowed,
} from "../../../error/error";
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

    const user = await prisma.admin_users.create({
      data: {
        email: data.email,
        password: password_hashed,
        store_id: data.store_id,
      },
      select: {
        id: true,
        email: true,
        store_id: true,
      },
    });
    return user;
  } catch (err: any) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code === "P2002") {
        throw new ConflictError("email already exist");
      }
      if (err.code === "P2003") {
        throw new ConflictError("store_id does not  exist");
      }
    }
    throw err;
  }
};

// Check email/password match for login
export const verifyCreditals = async (
  email: string,
  password: string,
): Promise<Users> => {
  const user = await prisma.admin_users.findFirst({
    where: { email },
    select: {
      id: true,
      email: true,
      store_id: true,
      password: true,
    },
  });
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
