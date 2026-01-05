"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectDeletedError = exports.ProjectValidationError = exports.ProjectMemberRequiredError = exports.ProjectOwnerRequiredError = exports.ProjectLimitExceededError = exports.ProjectNotFoundError = void 0;
const app_error_1 = require("./app.error");
// 프로젝트 관련 특화 에러 클래스들
class ProjectNotFoundError extends app_error_1.NotFoundError {
    constructor(projectId) {
        super(projectId
            ? `ID ${projectId}에 해당하는 프로젝트를 찾을 수 없습니다`
            : '프로젝트를 찾을 수 없습니다');
        this.name = 'ProjectNotFoundError';
    }
}
exports.ProjectNotFoundError = ProjectNotFoundError;
class ProjectLimitExceededError extends app_error_1.BadRequestError {
    constructor(maxCount = 5, message) {
        super(message || `사용자당 최대 ${maxCount}개의 프로젝트만 생성할 수 있습니다`);
        this.name = 'ProjectLimitExceededError';
    }
}
exports.ProjectLimitExceededError = ProjectLimitExceededError;
class ProjectOwnerRequiredError extends app_error_1.ForbiddenError {
    constructor(message = '프로젝트 소유자만 이 작업을 수행할 수 있습니다') {
        super(message);
        this.name = 'ProjectOwnerRequiredError';
    }
}
exports.ProjectOwnerRequiredError = ProjectOwnerRequiredError;
class ProjectMemberRequiredError extends app_error_1.ForbiddenError {
    constructor(message = '이 작업을 수행하려면 프로젝트 멤버여야 합니다') {
        super(message);
        this.name = 'ProjectMemberRequiredError';
    }
}
exports.ProjectMemberRequiredError = ProjectMemberRequiredError;
class ProjectValidationError extends app_error_1.BadRequestError {
    constructor(message = '유효하지 않은 프로젝트 데이터입니다') {
        super(message);
        this.name = 'ProjectValidationError';
    }
}
exports.ProjectValidationError = ProjectValidationError;
class ProjectDeletedError extends app_error_1.NotFoundError {
    constructor(projectId) {
        super(projectId
            ? `ID ${projectId}에 해당하는 프로젝트가 삭제되었습니다`
            : '프로젝트가 삭제되었습니다');
        this.name = 'ProjectDeletedError';
    }
}
exports.ProjectDeletedError = ProjectDeletedError;
