import { PrismaClient, User, Prisma } from '@prisma/client';

export class UserRepository {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  //사용자 정보 조회
  async getUserById(userId: number): Promise<User | null> {
    return await this.prisma.user.findFirst({ where: { id: userId, deletedAt: null } });
  }

  // 사용자 정보 수정
  async updateUser(userId: number, userData: Prisma.UserUpdateInput): Promise<User> {
    return await this.prisma.user.update({
      where: { id: userId },
      data: userData,
    });
  }

  // 사용자 정보 삭제 soft delete
  async deleteUser(userId: number): Promise<User> {
    return await this.prisma.user.update({
      where: { id: userId },
      data: {
        deletedAt: new Date(),
      },
    });
  }

  // 사용자 목록 조회
  async findUsers(): Promise<User[]> {
    return await this.prisma.user.findMany({ where: { deletedAt: null } });
  }

  //이메일로 사용자 조회
  async findUserByEmail(email: string): Promise<User | null> {
    return await this.prisma.user.findFirst({
      where: { email, deletedAt: null },
    });
  }
}
