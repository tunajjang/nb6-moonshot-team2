"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskStatusTransitionError = exports.TaskDateRangeError = exports.TaskValidationError = exports.TaskUnauthorizedError = exports.AttachmentNotFoundError = exports.SubTaskNotFoundError = exports.TaskNotFoundError = void 0;
const app_error_1 = require("./app.error");
// 태스크 관련 특화 에러 클래스들
class TaskNotFoundError extends app_error_1.NotFoundError {
    constructor(taskId) {
        super(taskId ? `ID ${taskId}에 해당하는 태스크를 찾을 수 없습니다` : '태스크를 찾을 수 없습니다');
        this.name = 'TaskNotFoundError';
    }
}
exports.TaskNotFoundError = TaskNotFoundError;
class SubTaskNotFoundError extends app_error_1.NotFoundError {
    constructor(subTaskId) {
        super(subTaskId
            ? `ID ${subTaskId}에 해당하는 하위 태스크를 찾을 수 없습니다`
            : '하위 태스크를 찾을 수 없습니다');
        this.name = 'SubTaskNotFoundError';
    }
}
exports.SubTaskNotFoundError = SubTaskNotFoundError;
class AttachmentNotFoundError extends app_error_1.NotFoundError {
    constructor(attachmentId) {
        super(attachmentId
            ? `ID ${attachmentId}에 해당하는 첨부파일을 찾을 수 없습니다`
            : '첨부파일을 찾을 수 없습니다');
        this.name = 'AttachmentNotFoundError';
    }
}
exports.AttachmentNotFoundError = AttachmentNotFoundError;
class TaskUnauthorizedError extends app_error_1.ForbiddenError {
    constructor(message = '이 태스크에 대한 작업을 수행할 권한이 없습니다') {
        super(message);
        this.name = 'TaskUnauthorizedError';
    }
}
exports.TaskUnauthorizedError = TaskUnauthorizedError;
class TaskValidationError extends app_error_1.BadRequestError {
    constructor(message = '유효하지 않은 태스크 데이터입니다') {
        super(message);
        this.name = 'TaskValidationError';
    }
}
exports.TaskValidationError = TaskValidationError;
class TaskDateRangeError extends app_error_1.BadRequestError {
    constructor(message = '유효하지 않은 날짜 범위입니다: 시작 날짜는 종료 날짜보다 이전이어야 합니다') {
        super(message);
        this.name = 'TaskDateRangeError';
    }
}
exports.TaskDateRangeError = TaskDateRangeError;
class TaskStatusTransitionError extends app_error_1.BadRequestError {
    constructor(fromStatus, toStatus, message) {
        super(message ||
            (fromStatus && toStatus
                ? `태스크 상태를 ${fromStatus}에서 ${toStatus}로 변경할 수 없습니다`
                : '유효하지 않은 태스크 상태 전환입니다'));
        this.name = 'TaskStatusTransitionError';
    }
}
exports.TaskStatusTransitionError = TaskStatusTransitionError;
