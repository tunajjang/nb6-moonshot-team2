import { UnauthorizedError, ConflictError, BadRequestError } from './app.error';

// ConflictError re-export (다른 파일에서 @lib를 통해 사용할 수 있도록)
export { ConflictError };

// 인증 관련 특화 에러 클래스들
export class InvalidCredentialsError extends UnauthorizedError {
  constructor(message: string = '이메일 또는 비밀번호가 일치하지 않습니다') {
    super(message);
    this.name = 'InvalidCredentialsError';
  }
}

export class TokenInvalidError extends UnauthorizedError {
  constructor(message: string = '토큰이 유효하지 않습니다') {
    super(message);
    this.name = 'TokenInvalidError';
  }
}

export class TokenExpiredError extends UnauthorizedError {
  constructor(message: string = '토큰이 만료되었습니다') {
    super(message);
    this.name = 'TokenExpiredError';
  }
}

export class TokenNotFoundError extends UnauthorizedError {
  constructor(message: string = '토큰을 찾을 수 없습니다') {
    super(message);
    this.name = 'TokenNotFoundError';
  }
}

export class RefreshTokenInvalidError extends UnauthorizedError {
  constructor(message: string = '리프레시 토큰이 유효하지 않거나 만료되었습니다') {
    super(message);
    this.name = 'RefreshTokenInvalidError';
  }
}

export class SocialAuthError extends BadRequestError {
  constructor(provider?: string, message?: string) {
    super(
      message || provider ? `${provider} 소셜 인증에 실패했습니다` : '소셜 인증에 실패했습니다',
    );
    this.name = 'SocialAuthError';
  }
}

export class OAuthError extends BadRequestError {
  constructor(message: string = 'OAuth 인증에 실패했습니다') {
    super(message);
    this.name = 'OAuthError';
  }
}
