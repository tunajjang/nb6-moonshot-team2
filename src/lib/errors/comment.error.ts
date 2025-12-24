import { NotFoundError, ForbiddenError, BadRequestError } from './app.error';

// 댓글 관련 특화 에러 클래스들
export class CommentNotFoundError extends NotFoundError {
  constructor(commentId?: number) {
    super(commentId ? `Comment with id ${commentId} not found` : 'Comment not found');
    this.name = 'CommentNotFoundError';
  }
}

export class TaskNotFoundError extends NotFoundError {
  constructor(taskId?: number) {
    super(taskId ? `Task with id ${taskId} not found` : 'Task not found');
    this.name = 'TaskNotFoundError';
  }
}

export class CommentUnauthorizedError extends ForbiddenError {
  constructor(message: string = 'You can only modify your own comments') {
    super(message);
    this.name = 'CommentUnauthorizedError';
  }
}

export class ProjectMemberRequiredError extends ForbiddenError {
  constructor(message: string = 'You must be a project member to perform this action') {
    super(message);
    this.name = 'ProjectMemberRequiredError';
  }
}

export class CommentValidationError extends BadRequestError {
  constructor(message: string = 'Invalid comment data') {
    super(message);
    this.name = 'CommentValidationError';
  }
}
