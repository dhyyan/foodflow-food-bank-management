import { Request, Response, NextFunction } from 'express';
import { AppError } from '../../../shared/errors/AppError';

export const errorHandler = (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      error: {
        code: err.code
      }
    });
  }

  // Handle Mongoose Validation Errors
  if (err && err.name === 'ValidationError') {
    const messages = Object.values(err.errors || {}).map((e: any) => e.message);
    return res.status(400).json({
      success: false,
      message: messages.join(', ') || 'Database validation failed',
      error: {
        code: 'VALIDATION_ERROR'
      }
    });
  }

  // Handle Mongoose / MongoDB Duplicate Key Errors (E11000)
  if (err && (err.code === 11000 || err.name === 'MongoServerError')) {
    const keys = Object.keys(err.keyValue || {});
    return res.status(409).json({
      success: false,
      message: `Duplicate entry detected for field: ${keys.join(', ') || 'unique constraint'}`,
      error: {
        code: 'DUPLICATE_ENTRY'
      }
    });
  }

  console.error('[Unhandled Error]:', err);

  return res.status(500).json({
    success: false,
    message: err?.message || 'An unexpected internal server error occurred',
    error: {
      code: 'INTERNAL_SERVER_ERROR'
    }
  });
};
