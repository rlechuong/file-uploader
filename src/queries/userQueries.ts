import { prisma } from "../config/prisma.js";
import type { Prisma } from "../generated/prisma/client.js";

const createUser = async (userData: Prisma.UserCreateInput) => {
  const user = await prisma.user.create({
    data: { email: userData.email, passwordHash: userData.passwordHash },
  });

  return user;
};

const findUserById = async (id: string) => {
  const user = await prisma.user.findUnique({
    where: { id },
    omit: { passwordHash: true },
  });

  return user;
};

const findUserByEmail = async (email: string) => {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  return user;
};

export { createUser, findUserById, findUserByEmail };
