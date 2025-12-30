import { NotFoundError, ForbiddenError, ConflictError, BadRequestError } from './app.error';

// 멤버 관련 특화 에러 클래스들
export class MemberNotFoundError extends NotFoundError {
  constructor(memberId?: number) {
    super(memberId ? `Member with id ${memberId} not found` : 'Member not found');
    this.name = 'MemberNotFoundError';
  }
}

export class ProjectNotFoundError extends NotFoundError {
  constructor(projectId?: number) {
    super(projectId ? `Project with id ${projectId} not found` : 'Project not found');
    this.name = 'ProjectNotFoundError';
  }
}

export class MemberUnauthorizedError extends ForbiddenError {
  constructor(message: string = 'You do not have permission to perform this action') {
    super(message);
    this.name = 'MemberUnauthorizedError';
  }
}

export class MemberAlreadyExistsError extends ConflictError {
  constructor(message: string = 'User is already a member of this project') {
    super(message);
    this.name = 'MemberAlreadyExistsError';
  }
}

export class MemberValidationError extends BadRequestError {
  constructor(message: string = 'Invalid member data') {
    super(message);
    this.name = 'MemberValidationError';
  }
}

export class OwnerCannotLeaveError extends BadRequestError {
  constructor(message: string = 'Project owner cannot leave the project') {
    super(message);
    this.name = 'OwnerCannotLeaveError';
  }
}

// 초대 관련 에러 클래스들 (멤버 기능에 포함)
export class InvitationNotFoundError extends NotFoundError {
  constructor(invitationId?: string) {
    super(invitationId ? `Invitation with id ${invitationId} not found` : 'Invitation not found');
    this.name = 'InvitationNotFoundError';
  }
}

export class InvitationAlreadyAcceptedError extends BadRequestError {
  constructor(message: string = 'Invitation has already been accepted') {
    super(message);
    this.name = 'InvitationAlreadyAcceptedError';
  }
}

export class InvitationAlreadyCanceledError extends BadRequestError {
  constructor(message: string = 'Invitation has already been canceled') {
    super(message);
    this.name = 'InvitationAlreadyCanceledError';
  }
}

export class InvitationAlreadyExistsError extends ConflictError {
  constructor(message: string = 'Invitation already exists for this user and project') {
    super(message);
    this.name = 'InvitationAlreadyExistsError';
  }
}

export class UserNotFoundError extends NotFoundError {
  constructor(email?: string) {
    super(email ? `User with email ${email} not found` : 'User not found');
    this.name = 'UserNotFoundError';
  }
}

