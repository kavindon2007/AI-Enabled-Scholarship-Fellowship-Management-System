// Layer: Middleware
// Responsibility: Central error-to-HTTP mapping

import { Request, Response, NextFunction } from 'express';
import { AppError } from '../errors/AppError.js';

export function errorHandler(err: Error, req: Request, res: Response, _next: NextFunction): void {
  console.error(`[ERROR] ${req.method} ${req.originalUrl}:`, err);

  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      data: null,
      error: {
        code: err.code,
        message: err.message,
        details: err.details,
      },
      meta: {
        requestId: req.headers['x-request-id'] || null,
        timestamp: new Date().toISOString(),
      },
    });
    return;
  }

  // Fallback for unexpected errors
  res.status(500).json({
    data: null,
    error: {
      code: 'INTERNAL_ERROR',
      message: 'An unexpected error occurred',
    },
    meta: {
      requestId: req.headers['x-request-id'] || null,
      timestamp: new Date().toISOString(),
    },
  });
}
