import { Prisma, TokenStatus, User, Token } from '@prisma/client';
import bcrypt from 'bcrypt';
import axios from 'axios';
import { StatusCodes } from 'http-status-codes';
import jwt from 'jsonwebtoken';
import { AppError } from '@lib';
import { AuthRepository, UserRepository } from '@repositories';

export class AuthService {
  private authRepository: AuthRepository;
  private userRepository: UserRepository;

  constructor(authRepository: AuthRepository, userRepository: UserRepository) {
    this.authRepository = authRepository;
    this.userRepository = userRepository;
  }
  /**
   * 회원가입
   */
  async signUp(userData: Prisma.UserCreateInput) {
    const existingUser = await this.userRepository.findUserByEmail(userData.email);
    if (existingUser) {
      throw new AppError('이미 존재하는 이메일입니다.', StatusCodes.CONFLICT);
    }
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const createUser = await this.authRepository.signUp({
      ...userData,
      password: hashedPassword,
    });
    const { password, ...newUser } = createUser;
    return newUser;
  }

  /**
   * 로그인
   */
  async login(email: User['email'], pw: User['password'], userAgent: Token['userAgent']) {
    const user = await this.userRepository.findUserByEmail(email);
    if (!user) {
      throw new AppError('이메일 또는 비밀번호가 일치하지 않습니다.', StatusCodes.UNAUTHORIZED);
    }
    const isPasswordValid = await bcrypt.compare(pw, user.password);
    if (!isPasswordValid) {
      throw new AppError('이메일 또는 비밀번호가 일치하지 않습니다.', StatusCodes.UNAUTHORIZED);
    }
    // 토큰 발급
    const { accessToken, refreshToken } = this._issueToken(user);
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);
    // refreshToken을 DB에 저장 및 반환
    await this.authRepository.saveToken({
      refreshToken,
      userAgent,
      tokenStatus: TokenStatus.OKAY,
      expiresAt,
      user: { connect: { id: user.id } },
    });
    const { password, ...userInfo } = user;
    return { user: userInfo, accessToken, refreshToken };
  }

  /**
   * 로그아웃
   */
  async logout(refreshToken: Token['refreshToken']) {
    return await this.authRepository.logout(refreshToken);
  }

  /**
   * 토큰 재발급
   */
  async refreshTokens(refreshToken: Token['refreshToken']) {
    const foundToken = await this.authRepository.findToken(refreshToken);
    if (!foundToken || foundToken.tokenStatus === TokenStatus.EXPIRED) {
      throw new AppError('토큰이 유효하지 않습니다.', StatusCodes.UNAUTHORIZED);
    }

    const payload = jwt.verify(refreshToken, process.env.JWT_SECRET || '') as {
      id: User['id'];
      email: User['email'];
    };
    if (!payload) {
      throw new AppError('토큰이 만료되었거나 유효하지 않습니다.', StatusCodes.UNAUTHORIZED);
    }

    const user = await this.userRepository.getUserById(payload.id);
    if (!user) {
      throw new AppError('사용자를 찾을 수 없습니다.', StatusCodes.UNAUTHORIZED);
    }

    const { accessToken: newAccessToken, refreshToken: newRefreshToken } = this._issueToken(user);

    const newExpiresAt = new Date();
    newExpiresAt.setDate(newExpiresAt.getDate() + 7);

    await this.authRepository.updateRefreshToken(refreshToken, {
      refreshToken: newRefreshToken,
      expiresAt: newExpiresAt,
      tokenStatus: TokenStatus.OKAY,
    });

    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
  }

  /**
   * Access Token과 Refresh Token을 발급
   */
  private _issueToken(user: { id: number; email: string }) {
    const payload = { id: user.id, email: user.email };
    const accessToken = jwt.sign(payload, process.env.JWT_SECRET || '', { expiresIn: '1h' });
    const refreshToken = jwt.sign(payload, process.env.JWT_SECRET || '', { expiresIn: '7d' });
    return { accessToken, refreshToken };
  }

  /**
   * 구글 로그인 페이지 URL 생성
   */
  getGoogleAuthURL() {
    const rootUrl = 'https://accounts.google.com/o/oauth2/v2/auth';
    const options = {
      redirect_uri: process.env.GOOGLE_REDIRECT_URI as string,
      client_id: process.env.GOOGLE_CLIENT_ID as string,
      access_type: 'offline',
      response_type: 'code',
      prompt: 'consent',
      scope: [
        'https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/userinfo.email',
      ].join(' '),
    };
    const qs = new URLSearchParams(options);
    return `${rootUrl}?${qs.toString()}`;
  }

  /**
   * 구글 로그인 처리(토큰 교환 & 유저 정보 조회& 회원가입/로그인)
   */
  async googleLogin(code: string) {
    const { data: tokenData } = await axios.post('https://oauth2.googleapis.com/token', {
      code,
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      redirect_uri: process.env.GOOGLE_REDIRECT_URI,
      grant_type: 'authorization_code',
    });

    const { data: googleUser } = await axios.get('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
    });

    let user = await this.userRepository.findUserByEmail(googleUser.email);

    if (!user) {
      user = await this.authRepository.createSocialUser({
        email: googleUser.email,
        name: googleUser.name,
      });
    }

    const { accessToken, refreshToken } = this._issueToken(user);

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await this.authRepository.saveToken({
      refreshToken,
      userAgent: 'Google Login',
      tokenStatus: TokenStatus.OKAY,
      expiresAt,
      user: { connect: { id: user.id } },
    });
    return { accessToken, refreshToken, user };
  }
}
