import { NotFoundError, ForbiddenError, BadRequestError } from './app.error';

// 프로젝트 관련 특화 에러 클래스들
export class ProjectNotFoundError extends NotFoundError {
  constructor(projectId?: number) {
    super(
      projectId
        ? `ID ${projectId}에 해당하는 프로젝트를 찾을 수 없습니다`
        : '프로젝트를 찾을 수 없습니다',
    );
    this.name = 'ProjectNotFoundError';
  }
}

export class ProjectLimitExceededError extends BadRequestError {
  constructor(maxCount: number = 5, message?: string) {
    super(message || `사용자당 최대 ${maxCount}개의 프로젝트만 생성할 수 있습니다`);
    this.name = 'ProjectLimitExceededError';
  }
}

export class ProjectOwnerRequiredError extends ForbiddenError {
  constructor(message: string = '프로젝트 소유자만 이 작업을 수행할 수 있습니다') {
    super(message);
    this.name = 'ProjectOwnerRequiredError';
  }
}

export class ProjectMemberRequiredError extends ForbiddenError {
  constructor(message: string = '이 작업을 수행하려면 프로젝트 멤버여야 합니다') {
    super(message);
    this.name = 'ProjectMemberRequiredError';
  }
}

export class ProjectValidationError extends BadRequestError {
  constructor(message: string = '유효하지 않은 프로젝트 데이터입니다') {
    super(message);
    this.name = 'ProjectValidationError';
  }
}

export class ProjectDeletedError extends NotFoundError {
  constructor(projectId?: number) {
    super(
      projectId
        ? `ID ${projectId}에 해당하는 프로젝트가 삭제되었습니다`
        : '프로젝트가 삭제되었습니다',
    );
    this.name = 'ProjectDeletedError';
  }
}
