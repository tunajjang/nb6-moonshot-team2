"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const _lib_1 = require("@lib");
/**
 * Access Token을 검증하고 req.user에 사용자 정보를 설정하는 미들웨어
 * Authorization 헤더에서 Bearer 토큰을 추출하여 검증합니다.
 */
const authenticate = (req, res, next) => {
    try {
        // Authorization 헤더에서 토큰 추출
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new _lib_1.UnauthorizedError('Authentication token is required');
        }
        const token = authHeader.substring(7); // 'Bearer ' 제거
        if (!token) {
            throw new _lib_1.UnauthorizedError('Authentication token is required');
        }
        // 환경 변수에서 JWT Secret 가져오기 (토큰 검증에 필요한 비밀키)
        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret) {
            throw new Error('JWT_SECRET is not configured in environment variables');
        }
        // Access Token 검증
        const decoded = jsonwebtoken_1.default.verify(token, jwtSecret);
        // req.user에 사용자 정보 설정
        req.user = {
            id: decoded.id,
            email: decoded.email,
        };
        next();
    }
    catch (error) {
        if (error instanceof jsonwebtoken_1.default.JsonWebTokenError) {
            return next(new _lib_1.UnauthorizedError('Invalid token'));
        }
        if (error instanceof jsonwebtoken_1.default.TokenExpiredError) {
            return next(new _lib_1.UnauthorizedError('Token expired'));
        }
        next(error);
    }
};
exports.authenticate = authenticate;
