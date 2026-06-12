import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Admin from '../models/admin.model';
import { AppError } from '../middleware/error.middleware';
import { LoginInput } from '../types';

export interface LoginResult {
  token: string;
  admin: { name: string; email: string };
}

export const loginAdmin = async (input: LoginInput): Promise<LoginResult> => {
  const admin = await Admin.findOne({ email: input.email.toLowerCase() });
  if (!admin) throw new AppError('Invalid credentials', 401);

  const isMatch = await bcrypt.compare(input.password, admin.password);
  if (!isMatch) throw new AppError('Invalid credentials', 401);

  const token = jwt.sign({ adminId: admin._id }, process.env.JWT_SECRET as string, {
    expiresIn: (process.env.JWT_EXPIRES_IN || '8h') as jwt.SignOptions['expiresIn'],
  });

  return { token, admin: { name: admin.name, email: admin.email } };
};
