import type { NextFunction, Request, Response } from 'express';
import { config } from '../config/constants.js';

export interface AppError extends Error {
  statusCode?: number;
  status?: string;
  isOperational?: boolean;
}

export const createAppError = (
  message: string,
  statusCode: number = 500
): AppError => {
  const error = new Error(message) as AppError;
  error.statusCode = statusCode;
  error.status = statusCode >= 400 && statusCode < 500 ? 'fail' : 'error';
  error.isOperational = true;
  return error;
};

export const errorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  let { statusCode = 500, message } = err;

  // Handle specific error types
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = 'Validation Error: ' + message;
  } else if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token';
  } else if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token expired';
  } else if (err.name === 'MongoError' || err.name === 'MongoServerError') {
    statusCode = 500;
    message = 'Database error';
  }

  // Log error in development
  if (config.NODE_ENV === 'development') {
    console.error('Error:', {
      message: err.message,
      stack: err.stack,
      statusCode,
      url: req.url,
      method: req.method,
    });
  }

  // Send error response
  res.status(statusCode).json({
    success: false,
    error: {
      message: config.NODE_ENV === 'development' ? message : 'Something went wrong',
      ...(config.NODE_ENV === 'development' && { stack: err.stack }),
    },
  });
};

export default errorHandler;
