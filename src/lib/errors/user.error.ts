import { NotFoundError, ConflictError, BadRequestError, UnauthorizedError } from './app.error';

// 사용자 관련 특화 에러 클래스들
export class UserNotFoundError extends NotFoundError {
  constructor(userIdOrEmail?: number | string) {
    if (typeof userIdOrEmail === 'number') {
      super(`ID ${userIdOrEmail}에 해당하는 사용자를 찾을 수 없습니다`);
    } else if (typeof userIdOrEmail === 'string') {
      super(`이메일 ${userIdOrEmail}에 해당하는 사용자를 찾을 수 없습니다`);
    } else {
      super('사용자를 찾을 수 없습니다');
    }
    this.name = 'UserNotFoundError';
  }
}

export class UserAlreadyExistsError extends ConflictError {
  constructor(email?: string) {
    super(
      email ? `이메일 ${email}에 해당하는 사용자가 이미 존재합니다` : '사용자가 이미 존재합니다',
    );
    this.name = 'UserAlreadyExistsError';
  }
}

export class PasswordMismatchError extends UnauthorizedError {
  constructor(message: string = '비밀번호가 일치하지 않습니다') {
    super(message);
    this.name = 'PasswordMismatchError';
  }
}

export class UserValidationError extends BadRequestError {
  constructor(message: string = '유효하지 않은 사용자 데이터입니다') {
    super(message);
    this.name = 'UserValidationError';
  }
}

export class EmailAlreadyExistsError extends ConflictError {
  constructor(email?: string) {
    super(email ? `이메일 ${email}은(는) 이미 등록되어 있습니다` : '이메일이 이미 존재합니다');
    this.name = 'EmailAlreadyExistsError';
  }
}
