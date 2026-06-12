import { Request, Response, NextFunction } from 'express';
import { loginAdmin } from '../services/auth.service';
import { sendSuccess } from '../utils/response';
import { LoginInput } from '../types';

export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const input = req.body as LoginInput;
    const result = await loginAdmin(input);
    sendSuccess(res, 'Login successful', result);
  } catch (error) {
    next(error);
  }
};
