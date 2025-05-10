import { prisma } from './prismaClient';

export const findUserByEmail = async (email: string) => {
  return prisma.user.findUnique({ where: { email } });
};

export const createUser = async (email: string, hashedPassword: string, name: string) => {
  return prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name,
    },
  });
};
