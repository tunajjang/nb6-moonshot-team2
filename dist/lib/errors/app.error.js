"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConflictError = exports.BadRequestError = exports.ForbiddenError = exports.UnauthorizedError = exports.NotFoundError = exports.AppError = void 0;
// 기본 애플리케이션 에러 클래스
class AppError extends Error {
    constructor(message, statusCode, isOperational = true) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.AppError = AppError;
// 404 Not Found 에러
class NotFoundError extends AppError {
    constructor(message = '리소스를 찾을 수 없습니다') {
        super(message, 404);
        this.name = 'NotFoundError';
    }
}
exports.NotFoundError = NotFoundError;
// 401 Unauthorized 에러
class UnauthorizedError extends AppError {
    constructor(message = '인증이 필요합니다') {
        super(message, 401);
        this.name = 'UnauthorizedError';
    }
}
exports.UnauthorizedError = UnauthorizedError;
// 403 Forbidden 에러
class ForbiddenError extends AppError {
    constructor(message = '접근이 거부되었습니다') {
        super(message, 403);
        this.name = 'ForbiddenError';
    }
}
exports.ForbiddenError = ForbiddenError;
// 400 Bad Request 에러
class BadRequestError extends AppError {
    constructor(message = '잘못된 요청입니다') {
        super(message, 400);
        this.name = 'BadRequestError';
    }
}
exports.BadRequestError = BadRequestError;
// 409 Conflict 에러
class ConflictError extends AppError {
    constructor(message = '충돌이 발생했습니다') {
        super(message, 409);
        this.name = 'ConflictError';
    }
}
exports.ConflictError = ConflictError;
