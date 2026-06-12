import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';

import authRoutes from './routes/auth.routes';
import readingRoutes from './routes/reading.routes';
import { errorHandler, notFoundHandler } from './middleware/error.middleware';

const app = express();

// Security headers
app.use(helmet());

// CORS
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || '*',
    methods: ['GET', 'POST', 'DELETE'],
  })
);

// Global rate limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { status: 'error', message: 'Too many requests, please try again later.', data: null },
});
app.use(limiter);

// Request logging
app.use(morgan('dev'));

// Body parsing
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/readings', readingRoutes);

// Health check
app.get('/health', (_req, res) => {
  res.json({
    status: 'success',
    message: 'Server is healthy',
    data: { timestamp: new Date().toISOString() },
  });
});

// 404 & error handlers
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
