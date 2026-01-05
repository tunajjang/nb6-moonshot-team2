// 기본 애플리케이션 에러 클래스
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(message: string, statusCode: number, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;

    Error.captureStackTrace(this, this.constructor);
  }
}

// 404 Not Found 에러
export class NotFoundError extends AppError {
  constructor(message: string = '리소스를 찾을 수 없습니다') {
    super(message, 404);
    this.name = 'NotFoundError';
  }
}

// 401 Unauthorized 에러
export class UnauthorizedError extends AppError {
  constructor(message: string = '인증이 필요합니다') {
    super(message, 401);
    this.name = 'UnauthorizedError';
  }
}

// 403 Forbidden 에러
export class ForbiddenError extends AppError {
  constructor(message: string = '접근이 거부되었습니다') {
    super(message, 403);
    this.name = 'ForbiddenError';
  }
}

// 400 Bad Request 에러
export class BadRequestError extends AppError {
  constructor(message: string = '잘못된 요청입니다') {
    super(message, 400);
    this.name = 'BadRequestError';
  }
}

// 409 Conflict 에러
export class ConflictError extends AppError {
  constructor(message: string = '충돌이 발생했습니다') {
    super(message, 409);
    this.name = 'ConflictError';
  }
}
