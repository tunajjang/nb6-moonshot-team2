import { NotFoundError, ForbiddenError, ConflictError, BadRequestError } from './app.error';

// 멤버 관련 특화 에러 클래스들
export class MemberNotFoundError extends NotFoundError {
  constructor(memberId?: number) {
    super(
      memberId ? `ID ${memberId}에 해당하는 멤버를 찾을 수 없습니다` : '멤버를 찾을 수 없습니다',
    );
    this.name = 'MemberNotFoundError';
  }
}

// ProjectNotFoundError는 project.error.ts로 이동됨

export class MemberUnauthorizedError extends ForbiddenError {
  constructor(message: string = '이 작업을 수행할 권한이 없습니다') {
    super(message);
    this.name = 'MemberUnauthorizedError';
  }
}

export class MemberAlreadyExistsError extends ConflictError {
  constructor(message: string = '이미 프로젝트 멤버입니다') {
    super(message);
    this.name = 'MemberAlreadyExistsError';
  }
}

export class MemberValidationError extends BadRequestError {
  constructor(message: string = '유효하지 않은 멤버 데이터입니다') {
    super(message);
    this.name = 'MemberValidationError';
  }
}

export class OwnerCannotLeaveError extends BadRequestError {
  constructor(message: string = '프로젝트 소유자는 프로젝트를 떠날 수 없습니다') {
    super(message);
    this.name = 'OwnerCannotLeaveError';
  }
}

// 초대 관련 에러 클래스들 (멤버 기능에 포함)
export class InvitationNotFoundError extends NotFoundError {
  constructor(invitationId?: string) {
    super(
      invitationId
        ? `ID ${invitationId}에 해당하는 초대를 찾을 수 없습니다`
        : '초대를 찾을 수 없습니다',
    );
    this.name = 'InvitationNotFoundError';
  }
}

export class InvitationAlreadyAcceptedError extends BadRequestError {
  constructor(message: string = '이미 수락된 초대입니다') {
    super(message);
    this.name = 'InvitationAlreadyAcceptedError';
  }
}

export class InvitationAlreadyCanceledError extends BadRequestError {
  constructor(message: string = '이미 취소된 초대입니다') {
    super(message);
    this.name = 'InvitationAlreadyCanceledError';
  }
}

export class InvitationAlreadyExistsError extends ConflictError {
  constructor(message: string = '이 사용자와 프로젝트에 대한 초대가 이미 존재합니다') {
    super(message);
    this.name = 'InvitationAlreadyExistsError';
  }
}
