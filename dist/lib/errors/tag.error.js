"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskTagNotFoundError = exports.TaskTagAlreadyExistsError = exports.TagValidationError = exports.TagAlreadyExistsError = exports.TagNotFoundError = void 0;
const app_error_1 = require("./app.error");
// 태그 관련 특화 에러 클래스들
class TagNotFoundError extends app_error_1.NotFoundError {
    constructor(tagId) {
        super(tagId ? `ID ${tagId}에 해당하는 태그를 찾을 수 없습니다` : '태그를 찾을 수 없습니다');
        this.name = 'TagNotFoundError';
    }
}
exports.TagNotFoundError = TagNotFoundError;
class TagAlreadyExistsError extends app_error_1.ConflictError {
    constructor(tagName) {
        super(tagName ? `태그 이름 '${tagName}'이(가) 이미 존재합니다` : '태그가 이미 존재합니다');
        this.name = 'TagAlreadyExistsError';
    }
}
exports.TagAlreadyExistsError = TagAlreadyExistsError;
class TagValidationError extends app_error_1.BadRequestError {
    constructor(message = '유효하지 않은 태그 데이터입니다') {
        super(message);
        this.name = 'TagValidationError';
    }
}
exports.TagValidationError = TagValidationError;
class TaskTagAlreadyExistsError extends app_error_1.ConflictError {
    constructor(taskId, tagId) {
        super(taskId && tagId
            ? `태스크 ${taskId}에 이미 태그 ${tagId}가 연결되어 있습니다`
            : '태스크-태그 관계가 이미 존재합니다');
        this.name = 'TaskTagAlreadyExistsError';
    }
}
exports.TaskTagAlreadyExistsError = TaskTagAlreadyExistsError;
class TaskTagNotFoundError extends app_error_1.NotFoundError {
    constructor(taskId, tagId) {
        super(taskId && tagId
            ? `태스크 ${taskId}에 태그 ${tagId}가 연결되어 있지 않습니다`
            : '태스크-태그 관계를 찾을 수 없습니다');
        this.name = 'TaskTagNotFoundError';
    }
}
exports.TaskTagNotFoundError = TaskTagNotFoundError;
