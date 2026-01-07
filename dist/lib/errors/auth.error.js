"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OAuthError = exports.SocialAuthError = exports.RefreshTokenInvalidError = exports.TokenNotFoundError = exports.TokenExpiredError = exports.TokenInvalidError = exports.InvalidCredentialsError = exports.ConflictError = void 0;
const app_error_1 = require("./app.error");
Object.defineProperty(exports, "ConflictError", { enumerable: true, get: function () { return app_error_1.ConflictError; } });
// 인증 관련 특화 에러 클래스들
class InvalidCredentialsError extends app_error_1.UnauthorizedError {
    constructor(message = '이메일 또는 비밀번호가 일치하지 않습니다') {
        super(message);
        this.name = 'InvalidCredentialsError';
    }
}
exports.InvalidCredentialsError = InvalidCredentialsError;
class TokenInvalidError extends app_error_1.UnauthorizedError {
    constructor(message = '토큰이 유효하지 않습니다') {
        super(message);
        this.name = 'TokenInvalidError';
    }
}
exports.TokenInvalidError = TokenInvalidError;
class TokenExpiredError extends app_error_1.UnauthorizedError {
    constructor(message = '토큰이 만료되었습니다') {
        super(message);
        this.name = 'TokenExpiredError';
    }
}
exports.TokenExpiredError = TokenExpiredError;
class TokenNotFoundError extends app_error_1.UnauthorizedError {
    constructor(message = '토큰을 찾을 수 없습니다') {
        super(message);
        this.name = 'TokenNotFoundError';
    }
}
exports.TokenNotFoundError = TokenNotFoundError;
class RefreshTokenInvalidError extends app_error_1.UnauthorizedError {
    constructor(message = '리프레시 토큰이 유효하지 않거나 만료되었습니다') {
        super(message);
        this.name = 'RefreshTokenInvalidError';
    }
}
exports.RefreshTokenInvalidError = RefreshTokenInvalidError;
class SocialAuthError extends app_error_1.BadRequestError {
    constructor(provider, message) {
        super(message || provider ? `${provider} 소셜 인증에 실패했습니다` : '소셜 인증에 실패했습니다');
        this.name = 'SocialAuthError';
    }
}
exports.SocialAuthError = SocialAuthError;
class OAuthError extends app_error_1.BadRequestError {
    constructor(message = 'OAuth 인증에 실패했습니다') {
        super(message);
        this.name = 'OAuthError';
    }
}
exports.OAuthError = OAuthError;
