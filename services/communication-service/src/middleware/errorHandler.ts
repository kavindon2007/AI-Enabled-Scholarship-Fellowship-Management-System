// Layer: Middleware
// Responsibility: Central error-to-HTTP mapping

import { Request, Response, NextFunction } from 'express';
import { AppError } from '../errors/AppError';
import { ZodError } from 'zod';
import pino from 'pino';

const logger = pino();

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  logger.error({ err, reqId: req.headers['x-correlation-id'] }, err.message);

  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      data: null,
      error: {
        code: err.code,
        message: err.message,
        details: err.details,
      },
      meta: {
        requestId: req.headers['x-correlation-id'] || 'unknown',
        timestamp: new Date().toISOString(),
      },
    });
    return;
  }

  if (err instanceof ZodError) {
    res.status(400).json({
      data: null,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Invalid request data',
        details: err.errors,
      },
      meta: {
        requestId: req.headers['x-correlation-id'] || 'unknown',
        timestamp: new Date().toISOString(),
      },
    });
    return;
  }

  // Fallback for unhandled errors
  res.status(500).json({
    data: null,
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: 'An unexpected error occurred',
    },
    meta: {
      requestId: req.headers['x-correlation-id'] || 'unknown',
      timestamp: new Date().toISOString(),
    },
  });
};