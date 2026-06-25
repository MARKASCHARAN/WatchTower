import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../ApiErrors';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      error: {
        message: err.message,
      },
    });
  }

  // Handle unexpected errors
  console.error('Unexpected Error:', err);
  return res.status(500).json({
    success: false,
    error: {
      message: 'Internal Server Error',
    },
  });
};
