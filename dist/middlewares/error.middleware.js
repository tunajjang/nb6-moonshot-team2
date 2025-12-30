"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const app_error_1 = require("../lib/errors/app.error");
// 에러 핸들링 미들웨어
const errorHandler = (err, req, res, next) => {
    // AppError 인스턴스인 경우
    if (err instanceof app_error_1.AppError) {
        const response = {
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
    if (err.name === 'ValidationError' || Array.isArray(err.errors)) {
        const response = {
            success: false,
            error: {
                message: 'Validation failed',
                statusCode: 400,
                details: err.errors || err.message,
            },
        };
        res.status(400).json(response);
        return;
    }
    // Prisma 에러 처리
    if (err.name === 'PrismaClientKnownRequestError') {
        const prismaError = err;
        if (prismaError.code === 'P2002') {
            const response = {
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
            const response = {
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
    const response = {
        success: false,
        error: {
            message: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message,
            statusCode: 500,
        },
    };
    res.status(500).json(response);
};
exports.errorHandler = errorHandler;
