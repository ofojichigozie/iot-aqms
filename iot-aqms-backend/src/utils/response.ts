import { Response } from 'express';

export const sendSuccess = <T>(res: Response, message: string, data: T, statusCode = 200): void => {
  res.status(statusCode).json({
    status: 'success',
    message,
    data,
  });
};
