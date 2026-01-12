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
  signUp = async (req: Request, res: Response) => {
    if (!is(req.body, signUpStruct)) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Invalid input data.' });
    }

    const newUser = await this.authService.signUp(req.body as Prisma.UserCreateInput);
    return res.status(StatusCodes.CREATED).json(newUser);
  };

  /**
   * 로그인
   */
  login = async (req: Request, res: Response) => {
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
  logout = async (req: Request, res: Response) => {
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
  refreshTokens = async (req: Request, res: Response) => {
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
  googleAuth = (req: Request, res: Response) => {
    const url = this.authService.getGoogleAuthURL();
    return res.redirect(url);
  };

  /**
   * 구글 로그인 콜백 처리
   */
  // googleAuthCallback = async (req: Request, res: Response) => {
  //   const { code } = req.query;
  //   if (!code) {
  //     throw new AppError('인증 코드가 없습니다.', StatusCodes.BAD_REQUEST);
  //   }
  //   const result = await this.authService.googleLogin(code as string);
  //   res.cookie('accessToken', result.accessToken, { httpOnly: true });
  //   res.cookie('refreshToken', result.refreshToken, { httpOnly: true });

  //   // return res.status(StatusCodes.OK).json(result).redirect('http://localhost:3001/projects');
  //   // return res.status(StatusCodes.OK).redirect('http://localhost:3000');
  //   return res.status(StatusCodes.OK).json(result);
  // };
  googleAuthCallback = async (req: Request, res: Response) => {
    const { code } = req.query;
    if (!code) throw new AppError('인증 코드가 없습니다', StatusCodes.BAD_REQUEST);

    const result = await this.authService.googleLogin(code as string);

    // 1. 지금이 배포 환경인지 확인 production 이 배포환경
    const isProduction = process.env.NODE_ENV === 'production';

    // 2. 프론트엔드 주소 결정 (배포 주소 vs 로컬 주소)
    // .env 파일에 FRONTEND_URL을 등록해두고 불러오는 게 가장 좋습니다.
    const frontendUrl = isProduction
      ? process.env.FRONTEND_URL // <- .env파일에 등록 했으면 사용 (그렇지 않다면 예: https://moonshot.vercel.app)
      : 'http://localhost:3001';

    // 3. 쿠키 설정 (배포 시 Secure 필수)
    const cookieOption = {
      httpOnly: false, // 프론트엔드 axios 로직 때문에 false 유지 = 프론트엔드가 쿠키에서 토큰을 가져오는 방식으로 사용했기 때문
      secure: isProduction, // 배포(https)면 true, 아니면 false
      sameSite: isProduction ? 'none' : 'lax', // 배포 시 도메인이 다르면 'none' 필수
      path: '/',
      maxAge: 3600000,
      // domain: '.moonshot.com', // (선택) 프론트/백엔드 상위 도메인이 같으면 설정
    };

    // 타입 이슈가 있다면 as any 사용 (지워보니까 타입 이슈 있어서 any 사용)
    res.cookie('access-token', result.accessToken, cookieOption as any);

    res.cookie('refresh-token', result.refreshToken, {
      ...cookieOption,
      maxAge: 7 * 24 * 3600000,
    } as any);

    // 4. 결정된 주소로 리다이렉트
    return res.redirect(`${frontendUrl}/projects`);
  };
}
