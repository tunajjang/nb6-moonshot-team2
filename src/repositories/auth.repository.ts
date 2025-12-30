import { PrismaClient, Prisma } from '@prisma/client';

export class AuthRepository {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  /**
   * 회원가입
   */
  async signUp(userData: Prisma.UserCreateInput) {
    return await this.prisma.user.create({ data: userData });
  }

  /**
   * 로그인
   * Refresh Token 저장
   */
  async saveToken(data: Prisma.TokenCreateInput) {
    return await this.prisma.token.create({ data });
  }

  /**
   * 로그아웃
   */
  async logout() {
    // TODO: Implement logout logic
  }

  /**
   * 토큰 재발급
   */
  async updateRefreshToken(id: number, refreshToken: Prisma.UserUpdateInput) {
    return await this.prisma.user.update({
      where: { id },
      data: refreshToken,
    });
  }
}
