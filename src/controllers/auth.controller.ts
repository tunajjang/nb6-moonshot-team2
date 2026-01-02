import { Request, Response } from 'express';
import { Prisma } from '@prisma/client';
import { StatusCodes } from 'http-status-codes';
import { is } from 'superstruct';
import { AuthService } from '@services';
import { signUpStruct, loginStruct } from '@superstructs';
import { AppError } from '@lib';

export class AuthController {
  constructor(private authService: AuthService) {}

  /**
   * 회원가입
   */
  public signUp = async (req: Request, res: Response) => {
    if (!is(req.body, signUpStruct)) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Invalid input data.' });
    }

    const newUser = await this.authService.signUp(req.body as Prisma.UserCreateInput);
    return res.status(StatusCodes.CREATED).json(newUser);
  };

  /**
   * 로그인
   */
  public login = async (req: Request, res: Response) => {
    if (!is(req.body, loginStruct)) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Invalid input data.' });
    }
    const { email, password } = req.body as Prisma.UserCreateInput;
    const userAgent = req.headers['user-agent'] || 'Unknown User Agent';

    const result = await this.authService.login(email, password, userAgent);
    return res.status(StatusCodes.OK).json(result);
  };

  /**
   * 로그아웃
   */
  public logout = async (req: Request, res: Response) => {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      throw new AppError('리프레시 토큰이 존재하지 않습니다.', StatusCodes.BAD_REQUEST);
    }
    await this.authService.logout(refreshToken);
    return res.status(StatusCodes.OK).json({ message: '로그아웃 성공!' });
  };

  /**
   * 리프레시 토큰 재발급
   */
  public refreshTokens = async (req: Request, res: Response) => {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      throw new AppError('리프레시 토큰이 존재하지 않습니다.', StatusCodes.BAD_REQUEST);
    }

    const tokens = await this.authService.refreshTokens(refreshToken);
    return res.status(StatusCodes.OK).json(tokens);
  };

  /**
   * 구글 로그인 페이지 리다이렉트
   */
  public googleAuth = (req: Request, res: Response) => {
    const url = this.authService.getGoogleAuthURL();
    return res.redirect(url);
  };

  /**
   * 구글 로그인 콜백 처리
   */
  public googleAuthCallback = async (req: Request, res: Response) => {
    const { code } = req.query;
    if (!code) {
      throw new AppError('인증 코드가 없습니다.', StatusCodes.BAD_REQUEST);
    }
    const result = await this.authService.googleLogin(code as string);
    return res.status(StatusCodes.OK).json(result);
  };
}
