import { prisma } from "../db/prismaClient";
import { comparePasswords, hashPassword } from "../utils/hash";
import { generateToken } from "../utils/jwt";

export const registerUser = async (
    email: string,
    password: string,
    name: string
) => {
    const hashedPassword = await hashPassword(password);
    return prisma.user.create({
        data: { email, password: hashedPassword, name },
    });
};

export const loginUser = async (email: string, password: string) => {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !(await comparePasswords(password, user.password))) {
        throw new Error("Invalid credentials");
    }
    const token = generateToken({ userId: user.id });
    return { token, user };
};
