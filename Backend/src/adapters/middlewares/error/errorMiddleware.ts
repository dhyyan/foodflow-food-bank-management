import { Request, Response, NextFunction } from 'express';
import { AppError } from '../../../shared/errors/AppError';

export const errorHandler = (
  err: Error,
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

  console.error('[Unhandled Error]:', err);

  return res.status(500).json({
    success: false,
    message: 'An unexpected internal server error occurred',
    error: {
      code: 'INTERNAL_SERVER_ERROR'
    }
  });
};
