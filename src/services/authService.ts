// src/services/authService.ts
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { findUserByEmail, createUser } from '../db/user';

const SECRET = process.env.JWT_SECRET || 'dev-secret'; // Keep in .env in real usage

export const registerUser = async (email: string, password: string, name: string) => {
  const existingUser = await findUserByEmail(email);
  if (existingUser) throw new Error('User already exists');

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await createUser(email, hashedPassword, name);

  return user;
};

export const loginUser = async (email: string, password: string) => {
  const user = await findUserByEmail(email);
  if (!user) throw new Error('User not found');

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) throw new Error('Invalid credentials');

  const token = jwt.sign({ userId: user.id }, SECRET, { expiresIn: '1h' });

  return { user, token };
};
