import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UnauthorizedError } from '@lib';

// 인증된 요청의 타입 확장
export interface AuthRequest extends Request {
  user?: {
    id: number;
    email: string;
  };
}

/**
 * Access Token을 검증하고 req.user에 사용자 정보를 설정하는 미들웨어
 * Authorization 헤더에서 Bearer 토큰을 추출하여 검증합니다.
 */
export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    // Authorization 헤더에서 토큰 추출
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedError('로그인이 필요합니다');
    }

    const token = authHeader.substring(7); // 'Bearer ' 제거

    if (!token) {
      throw new UnauthorizedError('로그인이 필요합니다');
    }

    // 환경 변수에서 JWT Secret 가져오기 (토큰 검증에 필요한 비밀키)
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new Error('JWT_SECRET is not configured in environment variables');
    }

    // Access Token 검증
    const decoded = jwt.verify(token, jwtSecret) as { id: number; email: string };

    // req.user에 사용자 정보 설정
    req.user = {
      id: decoded.id,
      email: decoded.email,
    };

    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return next(new UnauthorizedError('로그인이 필요합니다'));
    }
    if (error instanceof jwt.TokenExpiredError) {
      return next(new UnauthorizedError('토큰이 만료되었습니다'));
    }
    next(error);
  }
};

/**
 * 선택적 인증 미들웨어 - 토큰이 있으면 검증하고, 없으면 그냥 통과
 * 초대 링크 접속 시 사용 (로그인되어 있으면 자동 수락, 없으면 로그인 페이지로 리다이렉트)
 */
export const optionalAuthenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      const jwtSecret = process.env.JWT_SECRET;

      if (token && jwtSecret) {
        try {
          const decoded = jwt.verify(token, jwtSecret) as { id: number; email: string };
          req.user = {
            id: decoded.id,
            email: decoded.email,
          };
        } catch (error) {
          // 토큰이 유효하지 않아도 에러를 던지지 않고 그냥 통과
          // req.user는 undefined로 유지됨
        }
      }
    }

    next();
  } catch (error) {
    // 에러가 발생해도 그냥 통과 (인증 실패 시 req.user는 undefined)
    next();
  }
};
