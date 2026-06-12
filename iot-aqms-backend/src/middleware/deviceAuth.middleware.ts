import { Request, Response, NextFunction } from 'express';

/**
 * Verifies the X-Device-Key header on incoming IoT device requests.
 * The key must match DEVICE_API_KEY in the environment.
 */
export const deviceAuth = (req: Request, res: Response, next: NextFunction): void => {
  const deviceKey = req.headers['x-device-key'];
  const expectedKey = process.env.DEVICE_API_KEY;

  if (!expectedKey) {
    // If not configured, skip device auth (handy during local dev)
    next();
    return;
  }

  if (!deviceKey || deviceKey !== expectedKey) {
    res.status(401).json({ status: 'error', message: 'Invalid device key', data: null });
    return;
  }

  next();
};
