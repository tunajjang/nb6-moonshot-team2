import { Request, Response, NextFunction } from 'express';
import { AppError } from '@lib';

export interface ErrorResponse {
  success: false;
  error: {
    message: string;
    statusCode: number;
    details?: any;
  };
}

// 에러 핸들링 미들웨어
export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  // AppError 인스턴스인 경우
  if (err instanceof AppError) {
    const response: ErrorResponse = {
      success: false,
      error: {
        message: err.message,
        statusCode: err.statusCode,
      },
    };

    res.status(err.statusCode).json(response);
    return;
  }

  // ValidationError인 경우 (express-validator)
  if (err.name === 'ValidationError' || Array.isArray((err as any).errors)) {
    const response: ErrorResponse = {
      success: false,
      error: {
        message: 'Validation failed',
        statusCode: 400,
        details: (err as any).errors || err.message,
      },
    };

    res.status(400).json(response);
    return;
  }

  // Prisma 에러 처리
  if (err.name === 'PrismaClientKnownRequestError') {
    const prismaError = err as any;

    if (prismaError.code === 'P2002') {
      const response: ErrorResponse = {
        success: false,
        error: {
          message: 'Unique constraint violation',
          statusCode: 409,
        },
      };
      res.status(409).json(response);
      return;
    }

    if (prismaError.code === 'P2025') {
      const response: ErrorResponse = {
        success: false,
        error: {
          message: 'Record not found',
          statusCode: 404,
        },
      };
      res.status(404).json(response);
      return;
    }
  }

  // 알 수 없는 에러인 경우
  console.error('Unexpected error:', err);
  const response: ErrorResponse = {
    success: false,
    error: {
      message: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message,
      statusCode: 500,
    },
  };

  res.status(500).json(response);
};
