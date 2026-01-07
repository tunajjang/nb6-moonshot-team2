import { PrismaClient, Prisma, Token, TokenStatus, User } from '@prisma/client';

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
  async logout(refreshToken: Token['refreshToken']) {
    return await this.prisma.token.update({
      where: { refreshToken },
      data: { tokenStatus: TokenStatus.EXPIRED },
    });
  }

  /**
   * 토큰 재발급
   */
  async updateRefreshToken(
    oldRefreshToken: Token['refreshToken'],
    refreshToken: Prisma.TokenUpdateInput,
  ) {
    return await this.prisma.token.update({
      where: { refreshToken: oldRefreshToken },
      data: refreshToken,
    });
  }

  /**
   * 리프레시 토큰 찾기
   */
  async findToken(refreshToken: Token['refreshToken']) {
    return await this.prisma.token.findUnique({
      where: { refreshToken },
    });
  }

  /**
   * 소셜 로그인 유저 생성
   */
  async createSocialUser(userData: { email: User['email']; name: User['name'] }) {
    return await this.prisma.user.create({
      data: { ...userData, password: '' },
    });
  }
}
