import { Prisma, PrismaClient, User } from '@prisma/client';

export class UserRepository {
  constructor(private prisma: PrismaClient) {}

  //사용자 정보 조회
  async getUserById(userId: User['id']) {
    return this.prisma.user.findUnique({ where: { id: userId } });
  }

  // 사용자 정보 수정
  async updateUser(userId: User['id'], userData: Prisma.UserUpdateInput) {
    return this.prisma.user.update({
      where: { id: userId },
      data: userData,
    });
  }

  // 사용자 정보 삭제 soft delete
  async deleteUser(userId: User['id']) {
    return this.prisma.user.update({
      where: { id: userId },
      data: {
        deletedAt: new Date(),
      },
    });
  }

  // 사용자 목록 조회
  async findUsers() {
    return this.prisma.user.findMany();
  }

  //이메일로 사용자 조회
  async findUserByEmail(email: User['email']) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }
}
