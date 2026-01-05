"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentValidationError = exports.ProjectMemberRequiredError = exports.CommentUnauthorizedError = exports.TaskNotFoundError = exports.CommentNotFoundError = void 0;
const app_error_1 = require("./app.error");
// 댓글 관련 특화 에러 클래스들
class CommentNotFoundError extends app_error_1.NotFoundError {
    constructor(commentId) {
        super(commentId ? `Comment with id ${commentId} not found` : 'Comment not found');
        this.name = 'CommentNotFoundError';
    }
}
exports.CommentNotFoundError = CommentNotFoundError;
class TaskNotFoundError extends app_error_1.NotFoundError {
    constructor(taskId) {
        super(taskId ? `Task with id ${taskId} not found` : 'Task not found');
        this.name = 'TaskNotFoundError';
    }
}
exports.TaskNotFoundError = TaskNotFoundError;
class CommentUnauthorizedError extends app_error_1.ForbiddenError {
    constructor(message = 'You can only modify your own comments') {
        super(message);
        this.name = 'CommentUnauthorizedError';
    }
}
exports.CommentUnauthorizedError = CommentUnauthorizedError;
class ProjectMemberRequiredError extends app_error_1.ForbiddenError {
    constructor(message = 'You must be a project member to perform this action') {
        super(message);
        this.name = 'ProjectMemberRequiredError';
    }
}
exports.ProjectMemberRequiredError = ProjectMemberRequiredError;
class CommentValidationError extends app_error_1.BadRequestError {
    constructor(message = 'Invalid comment data') {
        super(message);
        this.name = 'CommentValidationError';
    }
}
exports.CommentValidationError = CommentValidationError;
