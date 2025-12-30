import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
<<<<<<< HEAD
import { UnauthorizedError } from '@lib';

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return next(new UnauthorizedError('인증 토큰이 필요합니다.'));
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    return next(new UnauthorizedError('인증 토큰 형식이 잘못되었습니다.'));
  }

  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error('JWT_SECRET이 설정되지 않았습니다.');
    }
    const decoded = jwt.verify(token, secret);
    (req as any).user = decoded;
    next();
  } catch (error) {
    next(new UnauthorizedError('유효하지 않은 토큰입니다.'));
=======
import { UnauthorizedError } from '../lib/errors/app.error';

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
      throw new UnauthorizedError('Authentication token is required');
    }

    const token = authHeader.substring(7); // 'Bearer ' 제거

    if (!token) {
      throw new UnauthorizedError('Authentication token is required');
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
      return next(new UnauthorizedError('Invalid token'));
    }
    if (error instanceof jwt.TokenExpiredError) {
      return next(new UnauthorizedError('Token expired'));
    }
    next(error);
>>>>>>> 350fd9a (feat: 인증 미들웨어 구현 및 모든 라우터에 적용)
  }
};
