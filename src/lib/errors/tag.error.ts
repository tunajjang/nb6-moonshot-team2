import { NotFoundError, ConflictError, BadRequestError } from './app.error';

// 태그 관련 특화 에러 클래스들
export class TagNotFoundError extends NotFoundError {
  constructor(tagId?: number) {
    super(tagId ? `ID ${tagId}에 해당하는 태그를 찾을 수 없습니다` : '태그를 찾을 수 없습니다');
    this.name = 'TagNotFoundError';
  }
}

export class TagAlreadyExistsError extends ConflictError {
  constructor(tagName?: string) {
    super(tagName ? `태그 이름 '${tagName}'이(가) 이미 존재합니다` : '태그가 이미 존재합니다');
    this.name = 'TagAlreadyExistsError';
  }
}

export class TagValidationError extends BadRequestError {
  constructor(message: string = '유효하지 않은 태그 데이터입니다') {
    super(message);
    this.name = 'TagValidationError';
  }
}

export class TaskTagAlreadyExistsError extends ConflictError {
  constructor(taskId?: number, tagId?: number) {
    super(
      taskId && tagId
        ? `태스크 ${taskId}에 이미 태그 ${tagId}가 연결되어 있습니다`
        : '태스크-태그 관계가 이미 존재합니다',
    );
    this.name = 'TaskTagAlreadyExistsError';
  }
}

export class TaskTagNotFoundError extends NotFoundError {
  constructor(taskId?: number, tagId?: number) {
    super(
      taskId && tagId
        ? `태스크 ${taskId}에 태그 ${tagId}가 연결되어 있지 않습니다`
        : '태스크-태그 관계를 찾을 수 없습니다',
    );
    this.name = 'TaskTagNotFoundError';
  }
}
