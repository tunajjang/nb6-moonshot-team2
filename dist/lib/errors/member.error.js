"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvitationAlreadyExistsError = exports.InvitationAlreadyCanceledError = exports.InvitationAlreadyAcceptedError = exports.InvitationNotFoundError = exports.OwnerCannotLeaveError = exports.MemberValidationError = exports.MemberAlreadyExistsError = exports.MemberUnauthorizedError = exports.MemberNotFoundError = void 0;
const app_error_1 = require("./app.error");
// 멤버 관련 특화 에러 클래스들
class MemberNotFoundError extends app_error_1.NotFoundError {
    constructor(memberId) {
        super(memberId ? `ID ${memberId}에 해당하는 멤버를 찾을 수 없습니다` : '멤버를 찾을 수 없습니다');
        this.name = 'MemberNotFoundError';
    }
}
exports.MemberNotFoundError = MemberNotFoundError;
// ProjectNotFoundError는 project.error.ts로 이동됨
class MemberUnauthorizedError extends app_error_1.ForbiddenError {
    constructor(message = '이 작업을 수행할 권한이 없습니다') {
        super(message);
        this.name = 'MemberUnauthorizedError';
    }
}
exports.MemberUnauthorizedError = MemberUnauthorizedError;
class MemberAlreadyExistsError extends app_error_1.ConflictError {
    constructor(message = '이미 프로젝트 멤버입니다') {
        super(message);
        this.name = 'MemberAlreadyExistsError';
    }
}
exports.MemberAlreadyExistsError = MemberAlreadyExistsError;
class MemberValidationError extends app_error_1.BadRequestError {
    constructor(message = '유효하지 않은 멤버 데이터입니다') {
        super(message);
        this.name = 'MemberValidationError';
    }
}
exports.MemberValidationError = MemberValidationError;
class OwnerCannotLeaveError extends app_error_1.BadRequestError {
    constructor(message = '프로젝트 소유자는 프로젝트를 떠날 수 없습니다') {
        super(message);
        this.name = 'OwnerCannotLeaveError';
    }
}
exports.OwnerCannotLeaveError = OwnerCannotLeaveError;
// 초대 관련 에러 클래스들 (멤버 기능에 포함)
class InvitationNotFoundError extends app_error_1.NotFoundError {
    constructor(invitationId) {
        super(invitationId ? `ID ${invitationId}에 해당하는 초대를 찾을 수 없습니다` : '초대를 찾을 수 없습니다');
        this.name = 'InvitationNotFoundError';
    }
}
exports.InvitationNotFoundError = InvitationNotFoundError;
class InvitationAlreadyAcceptedError extends app_error_1.BadRequestError {
    constructor(message = '이미 수락된 초대입니다') {
        super(message);
        this.name = 'InvitationAlreadyAcceptedError';
    }
}
exports.InvitationAlreadyAcceptedError = InvitationAlreadyAcceptedError;
class InvitationAlreadyCanceledError extends app_error_1.BadRequestError {
    constructor(message = '이미 취소된 초대입니다') {
        super(message);
        this.name = 'InvitationAlreadyCanceledError';
    }
}
exports.InvitationAlreadyCanceledError = InvitationAlreadyCanceledError;
class InvitationAlreadyExistsError extends app_error_1.ConflictError {
    constructor(message = '이 사용자와 프로젝트에 대한 초대가 이미 존재합니다') {
        super(message);
        this.name = 'InvitationAlreadyExistsError';
    }
}
exports.InvitationAlreadyExistsError = InvitationAlreadyExistsError;
// UserNotFoundError는 user.error.ts로 이동됨
