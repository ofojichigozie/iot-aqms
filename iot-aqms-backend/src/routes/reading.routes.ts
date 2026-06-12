import { Router } from 'express';
import {
  postReading,
  getReadings,
  latestReading,
  readingStats,
  removeReading,
} from '../controllers/reading.controller';
import { authenticate } from '../middleware/auth.middleware';
import { deviceAuth } from '../middleware/deviceAuth.middleware';
import { validateReading } from '../middleware/validate.middleware';

const router = Router();

// IoT Device — device key required
// POST /api/readings
router.post('/', deviceAuth, validateReading, postReading);

// Admin — JWT protected routes
// GET /api/readings
router.get('/', authenticate, getReadings);

// GET /api/readings/latest
router.get('/latest', authenticate, latestReading);

// GET /api/readings/stats
router.get('/stats', authenticate, readingStats);

// DELETE /api/readings/:id
router.delete('/:id', authenticate, removeReading);

export default router;
