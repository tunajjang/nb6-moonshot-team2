import { Prisma, PrismaClient } from '@prisma/client';

export class AuthRepository {
  constructor(private prisma: PrismaClient) {}

  /**
   * 회원가입
   */
  async signUp(userData: Prisma.UserCreateInput) {
    return this.prisma.user.create({
      data: userData,
    });
  }

  /**
   * 로그인
   */
  async login() {}

  /**
   * 로그아웃
   */
  async logout() {}

  /**
   * 토큰 재발급
   */
  async findRefreshToken() {}
}
