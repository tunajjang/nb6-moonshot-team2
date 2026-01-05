"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.optionalAuthenticate = exports.authenticate = void 0;
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
            throw new _lib_1.UnauthorizedError('로그인이 필요합니다');
        }
        const token = authHeader.substring(7); // 'Bearer ' 제거
        if (!token) {
            throw new _lib_1.UnauthorizedError('로그인이 필요합니다');
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
            return next(new _lib_1.UnauthorizedError('로그인이 필요합니다'));
        }
        if (error instanceof jsonwebtoken_1.default.TokenExpiredError) {
            return next(new _lib_1.UnauthorizedError('토큰이 만료되었습니다'));
        }
        next(error);
    }
};
exports.authenticate = authenticate;
/**
 * 선택적 인증 미들웨어 - 토큰이 있으면 검증하고, 없으면 그냥 통과
 * 초대 링크 접속 시 사용 (로그인되어 있으면 자동 수락, 없으면 로그인 페이지로 리다이렉트)
 */
const optionalAuthenticate = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith('Bearer ')) {
            const token = authHeader.substring(7);
            const jwtSecret = process.env.JWT_SECRET;
            if (token && jwtSecret) {
                try {
                    const decoded = jsonwebtoken_1.default.verify(token, jwtSecret);
                    req.user = {
                        id: decoded.id,
                        email: decoded.email,
                    };
                }
                catch (error) {
                    // 토큰이 유효하지 않아도 에러를 던지지 않고 그냥 통과
                    // req.user는 undefined로 유지됨
                }
            }
        }
        next();
    }
    catch (error) {
        // 에러가 발생해도 그냥 통과 (인증 실패 시 req.user는 undefined)
        next();
    }
};
exports.optionalAuthenticate = optionalAuthenticate;
