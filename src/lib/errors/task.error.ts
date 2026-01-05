import { NotFoundError, ForbiddenError, BadRequestError } from './app.error';

// 태스크 관련 특화 에러 클래스들
export class TaskNotFoundError extends NotFoundError {
  constructor(taskId?: number) {
    super(
      taskId ? `ID ${taskId}에 해당하는 태스크를 찾을 수 없습니다` : '태스크를 찾을 수 없습니다',
    );
    this.name = 'TaskNotFoundError';
  }
}

export class SubTaskNotFoundError extends NotFoundError {
  constructor(subTaskId?: number) {
    super(
      subTaskId
        ? `ID ${subTaskId}에 해당하는 하위 태스크를 찾을 수 없습니다`
        : '하위 태스크를 찾을 수 없습니다',
    );
    this.name = 'SubTaskNotFoundError';
  }
}

export class AttachmentNotFoundError extends NotFoundError {
  constructor(attachmentId?: number) {
    super(
      attachmentId
        ? `ID ${attachmentId}에 해당하는 첨부파일을 찾을 수 없습니다`
        : '첨부파일을 찾을 수 없습니다',
    );
    this.name = 'AttachmentNotFoundError';
  }
}

export class TaskUnauthorizedError extends ForbiddenError {
  constructor(message: string = '이 태스크에 대한 작업을 수행할 권한이 없습니다') {
    super(message);
    this.name = 'TaskUnauthorizedError';
  }
}

export class TaskValidationError extends BadRequestError {
  constructor(message: string = '유효하지 않은 태스크 데이터입니다') {
    super(message);
    this.name = 'TaskValidationError';
  }
}

export class TaskDateRangeError extends BadRequestError {
  constructor(
    message: string = '유효하지 않은 날짜 범위입니다: 시작 날짜는 종료 날짜보다 이전이어야 합니다',
  ) {
    super(message);
    this.name = 'TaskDateRangeError';
  }
}

export class TaskStatusTransitionError extends BadRequestError {
  constructor(fromStatus?: string, toStatus?: string, message?: string) {
    super(
      message ||
        (fromStatus && toStatus
          ? `태스크 상태를 ${fromStatus}에서 ${toStatus}로 변경할 수 없습니다`
          : '유효하지 않은 태스크 상태 전환입니다'),
    );
    this.name = 'TaskStatusTransitionError';
  }
}
