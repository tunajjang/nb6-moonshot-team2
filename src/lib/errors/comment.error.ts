import { NotFoundError, ForbiddenError, BadRequestError } from './app.error';

// 댓글 관련 특화 에러 클래스들
export class CommentNotFoundError extends NotFoundError {
  constructor(commentId?: number) {
    super(
      commentId ? `ID ${commentId}에 해당하는 댓글을 찾을 수 없습니다` : '댓글을 찾을 수 없습니다',
    );
    this.name = 'CommentNotFoundError';
  }
}

export class CommentUnauthorizedError extends ForbiddenError {
  constructor(message: string = '본인의 댓글만 수정할 수 있습니다') {
    super(message);
    this.name = 'CommentUnauthorizedError';
  }
}

export class CommentValidationError extends BadRequestError {
  constructor(message: string = '유효하지 않은 댓글 데이터입니다') {
    super(message);
    this.name = 'CommentValidationError';
  }
}
