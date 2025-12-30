import { Prisma, TokenStatus } from '@prisma/client';
import bcrypt from 'bcrypt';
import { StatusCodes } from 'http-status-codes';
import jwt from 'jsonwebtoken';
import { BaseError } from '@lib';
import { AuthRepository } from '../repositories/auth.repository';
import { UserRepository } from '../repositories/user.repository';

export class AuthService {
  private authRepository: AuthRepository;
  private userRepository: UserRepository;

  constructor(authRepository: AuthRepository, userRepository: UserRepository) {
    this.authRepository = authRepository;
    this.userRepository = userRepository;
  }

  async signUp(userData: Prisma.UserCreateInput) {
    const existingUser = await this.userRepository.findUserByEmail(userData.email);
    if (existingUser) {
      throw new BaseError(StatusCodes.CONFLICT, '이미 존재하는 이메일입니다.');
    }
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const createUser = await this.authRepository.signUp({
      ...userData,
      password: hashedPassword,
    });
    const { password, ...newUser } = createUser;
    return newUser;
  }

  async login(email: string, pw: string, userAgent: string) {
    const user = await this.userRepository.findUserByEmail(email);
    if (!user) {
      throw new BaseError(StatusCodes.UNAUTHORIZED, '이메일 또는 비밀번호가 일치하지 않습니다.');
    }
    const isPasswordValid = await bcrypt.compare(pw, user.password);
    if (!isPasswordValid) {
      throw new BaseError(StatusCodes.UNAUTHORIZED, '이메일 또는 비밀번호가 일치하지 않습니다.');
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
   * Access Token과 Refresh Token을 발급
   */
  private _issueToken(user: { id: number; email: string }) {
    const payload = { id: user.id, email: user.email };
    const accessToken = jwt.sign(payload, process.env.JWT_SECRET || '', { expiresIn: '1h' });
    const refreshToken = jwt.sign(payload, process.env.JWT_SECRET || '', { expiresIn: '7d' });
    return { accessToken, refreshToken };
  }
}

