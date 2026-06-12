import { Request, Response, NextFunction } from 'express';
import {
  createReading,
  getAllReadings,
  getLatestReading,
  getReadingStats,
  deleteReading,
} from '../services/reading.service';
import { sendSuccess } from '../utils/response';
import { ReadingInput } from '../types';

export const postReading = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const input = req.body as ReadingInput;
    const reading = await createReading(input);
    sendSuccess(res, 'Reading recorded', reading, 201);
  } catch (error) {
    next(error);
  }
};

export const getReadings = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 100;
    const readings = await getAllReadings(limit);
    sendSuccess(res, 'Readings fetched', readings);
  } catch (error) {
    next(error);
  }
};

export const latestReading = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const reading = await getLatestReading();
    sendSuccess(res, 'Latest reading fetched', reading);
  } catch (error) {
    next(error);
  }
};

export const readingStats = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const stats = await getReadingStats();
    sendSuccess(res, 'Stats fetched', stats);
  } catch (error) {
    next(error);
  }
};

export const removeReading = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    await deleteReading(req.params.id);
    sendSuccess(res, 'Reading deleted', null);
  } catch (error) {
    next(error);
  }
};
