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
    // 404 에러는 응답 바디 X
    if (err.statusCode === 404) {
      res.status(404).send();
      return;
    }
    res.status(err.statusCode).json({
      message: err.message, // 명세서대로 메시지만 나오게
    });
    return;
  }

  // ValidationError인 경우 (express-validator)
  if (err.name === 'ValidationError' || Array.isArray((err as any).errors)) {
    res.status(400).json({ message: '잘못된 데이터 형식' });
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
      res.status(404).send();
      return;
    }
  }

  // superstruct 에러 처리
  if (err.name === 'StructError') {
    res.status(400).json({
      message: '잘못된 데이터 형식',
    });
    return;
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
