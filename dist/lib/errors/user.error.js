"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailAlreadyExistsError = exports.UserValidationError = exports.PasswordMismatchError = exports.UserAlreadyExistsError = exports.UserNotFoundError = void 0;
const app_error_1 = require("./app.error");
// 사용자 관련 특화 에러 클래스들
class UserNotFoundError extends app_error_1.NotFoundError {
    constructor(userIdOrEmail) {
        if (typeof userIdOrEmail === 'number') {
            super(`ID ${userIdOrEmail}에 해당하는 사용자를 찾을 수 없습니다`);
        }
        else if (typeof userIdOrEmail === 'string') {
            super(`이메일 ${userIdOrEmail}에 해당하는 사용자를 찾을 수 없습니다`);
        }
        else {
            super('사용자를 찾을 수 없습니다');
        }
        this.name = 'UserNotFoundError';
    }
}
exports.UserNotFoundError = UserNotFoundError;
class UserAlreadyExistsError extends app_error_1.ConflictError {
    constructor(email) {
        super(email ? `이메일 ${email}에 해당하는 사용자가 이미 존재합니다` : '사용자가 이미 존재합니다');
        this.name = 'UserAlreadyExistsError';
    }
}
exports.UserAlreadyExistsError = UserAlreadyExistsError;
class PasswordMismatchError extends app_error_1.UnauthorizedError {
    constructor(message = '비밀번호가 일치하지 않습니다') {
        super(message);
        this.name = 'PasswordMismatchError';
    }
}
exports.PasswordMismatchError = PasswordMismatchError;
class UserValidationError extends app_error_1.BadRequestError {
    constructor(message = '유효하지 않은 사용자 데이터입니다') {
        super(message);
        this.name = 'UserValidationError';
    }
}
exports.UserValidationError = UserValidationError;
class EmailAlreadyExistsError extends app_error_1.ConflictError {
    constructor(email) {
        super(email ? `이메일 ${email}은(는) 이미 등록되어 있습니다` : '이메일이 이미 존재합니다');
        this.name = 'EmailAlreadyExistsError';
    }
}
exports.EmailAlreadyExistsError = EmailAlreadyExistsError;
