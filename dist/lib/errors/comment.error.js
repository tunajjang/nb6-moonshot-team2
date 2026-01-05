"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentValidationError = exports.CommentUnauthorizedError = exports.CommentNotFoundError = void 0;
const app_error_1 = require("./app.error");
// 댓글 관련 특화 에러 클래스들
class CommentNotFoundError extends app_error_1.NotFoundError {
    constructor(commentId) {
        super(commentId ? `ID ${commentId}에 해당하는 댓글을 찾을 수 없습니다` : '댓글을 찾을 수 없습니다');
        this.name = 'CommentNotFoundError';
    }
}
exports.CommentNotFoundError = CommentNotFoundError;
class CommentUnauthorizedError extends app_error_1.ForbiddenError {
    constructor(message = '본인의 댓글만 수정할 수 있습니다') {
        super(message);
        this.name = 'CommentUnauthorizedError';
    }
}
exports.CommentUnauthorizedError = CommentUnauthorizedError;
class CommentValidationError extends app_error_1.BadRequestError {
    constructor(message = '유효하지 않은 댓글 데이터입니다') {
        super(message);
        this.name = 'CommentValidationError';
    }
}
exports.CommentValidationError = CommentValidationError;
