"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserNotFoundError = exports.InvitationAlreadyExistsError = exports.InvitationAlreadyCanceledError = exports.InvitationAlreadyAcceptedError = exports.InvitationNotFoundError = exports.OwnerCannotLeaveError = exports.MemberValidationError = exports.MemberAlreadyExistsError = exports.MemberUnauthorizedError = exports.ProjectNotFoundError = exports.MemberNotFoundError = void 0;
const app_error_1 = require("./app.error");
// 멤버 관련 특화 에러 클래스들
class MemberNotFoundError extends app_error_1.NotFoundError {
    constructor(memberId) {
        super(memberId ? `Member with id ${memberId} not found` : 'Member not found');
        this.name = 'MemberNotFoundError';
    }
}
exports.MemberNotFoundError = MemberNotFoundError;
class ProjectNotFoundError extends app_error_1.NotFoundError {
    constructor(projectId) {
        super(projectId ? `Project with id ${projectId} not found` : 'Project not found');
        this.name = 'ProjectNotFoundError';
    }
}
exports.ProjectNotFoundError = ProjectNotFoundError;
class MemberUnauthorizedError extends app_error_1.ForbiddenError {
    constructor(message = 'You do not have permission to perform this action') {
        super(message);
        this.name = 'MemberUnauthorizedError';
    }
}
exports.MemberUnauthorizedError = MemberUnauthorizedError;
class MemberAlreadyExistsError extends app_error_1.ConflictError {
    constructor(message = 'User is already a member of this project') {
        super(message);
        this.name = 'MemberAlreadyExistsError';
    }
}
exports.MemberAlreadyExistsError = MemberAlreadyExistsError;
class MemberValidationError extends app_error_1.BadRequestError {
    constructor(message = 'Invalid member data') {
        super(message);
        this.name = 'MemberValidationError';
    }
}
exports.MemberValidationError = MemberValidationError;
class OwnerCannotLeaveError extends app_error_1.BadRequestError {
    constructor(message = 'Project owner cannot leave the project') {
        super(message);
        this.name = 'OwnerCannotLeaveError';
    }
}
exports.OwnerCannotLeaveError = OwnerCannotLeaveError;
// 초대 관련 에러 클래스들 (멤버 기능에 포함)
class InvitationNotFoundError extends app_error_1.NotFoundError {
    constructor(invitationId) {
        super(invitationId ? `Invitation with id ${invitationId} not found` : 'Invitation not found');
        this.name = 'InvitationNotFoundError';
    }
}
exports.InvitationNotFoundError = InvitationNotFoundError;
class InvitationAlreadyAcceptedError extends app_error_1.BadRequestError {
    constructor(message = 'Invitation has already been accepted') {
        super(message);
        this.name = 'InvitationAlreadyAcceptedError';
    }
}
exports.InvitationAlreadyAcceptedError = InvitationAlreadyAcceptedError;
class InvitationAlreadyCanceledError extends app_error_1.BadRequestError {
    constructor(message = 'Invitation has already been canceled') {
        super(message);
        this.name = 'InvitationAlreadyCanceledError';
    }
}
exports.InvitationAlreadyCanceledError = InvitationAlreadyCanceledError;
class InvitationAlreadyExistsError extends app_error_1.ConflictError {
    constructor(message = 'Invitation already exists for this user and project') {
        super(message);
        this.name = 'InvitationAlreadyExistsError';
    }
}
exports.InvitationAlreadyExistsError = InvitationAlreadyExistsError;
class UserNotFoundError extends app_error_1.NotFoundError {
    constructor(email) {
        super(email ? `User with email ${email} not found` : 'User not found');
        this.name = 'UserNotFoundError';
    }
}
exports.UserNotFoundError = UserNotFoundError;
