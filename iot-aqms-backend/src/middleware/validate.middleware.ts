import { Request, Response, NextFunction } from 'express';

type ValidatorFn = (body: Record<string, unknown>) => string | null;

/**
 * Returns an Express middleware that runs the provided validator function.
 * If the validator returns an error string, responds 400. Otherwise calls next().
 */
export const validate =
  (validator: ValidatorFn) =>
  (req: Request, res: Response, next: NextFunction): void => {
    const error = validator(req.body as Record<string, unknown>);
    if (error) {
      res.status(400).json({ status: 'error', message: error, data: null });
      return;
    }
    next();
  };

// --- Built-in validators ---

export const validateLogin = validate((body) => {
  if (!body.email || typeof body.email !== 'string') return 'email is required';
  if (!body.password || typeof body.password !== 'string') return 'password is required';
  return null;
});

export const validateReading = validate((body) => {
  if (!body.deviceId || typeof body.deviceId !== 'string') return 'deviceId is required';
  if (body.sensorValue === undefined || body.sensorValue === null) return 'sensorValue is required';
  if (typeof body.sensorValue !== 'number' || body.sensorValue < 0)
    return 'sensorValue must be a non-negative number';
  return null;
});
