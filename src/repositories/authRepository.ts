import { Prisma, PrismaClient, User, Token } from '@prisma/client';

export class AuthRepository {
  constructor(private prisma: PrismaClient) {}

  /**
   * 회원가입
   */
  async signUp(userData: Prisma.UserCreateInput) {
    return this.prisma.user.create({ data: userData });
  }

  /**
   * 로그인
   * Refresh Token 저장
   */
  async saveToken(data: Prisma.TokenCreateInput): Promise<Token> {
    return this.prisma.token.create({ data });
  }

  /**
   * 로그아웃
   */
  async logout() {}

  /**
   * 토큰 재발급
   */
  async updateRefreshToken(id: User['id'], refreshToken: Token['refreshToken']) {
    return this.prisma.user.update({
      where: { id },
      data: refreshToken,
    });
  }
}
