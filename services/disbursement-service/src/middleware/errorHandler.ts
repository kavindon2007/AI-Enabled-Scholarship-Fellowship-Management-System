import { Request, Response, NextFunction } from 'express';
import { AppError } from '../errors/AppError';

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      data: null,
      error: {
        code: err.code,
        message: err.message,
        details: err.details || []
      },
      meta: {
        requestId: req.headers['x-correlation-id'] || 'unknown',
        timestamp: new Date().toISOString()
      }
    });
  }

  console.error('Unhandled Server Error: ', err);

  return res.status(500).json({
    data: null,
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: 'An unexpected error occurred',
      details: []
    },
    meta: {
      requestId: req.headers['x-correlation-id'] || 'unknown',
      timestamp: new Date().toISOString()
    }
  });
};
