import { PrismaClient, User, Prisma } from '@prisma/client';

export class UserRepository {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  /**
   * 사용자 정보 조회
   */
  async getUserById(userId: number): Promise<User | null> {
    return await this.prisma.user.findFirst({ where: { id: userId, deletedAt: null } });
  }

  /**
   * 사용자 정보 수정
   */
  async updateUser(userId: number, userData: Prisma.UserUpdateInput): Promise<User> {
    return await this.prisma.user.update({
      where: { id: userId },
      data: userData,
    });
  }

  /**
   * 비밀번호 정보 수정
   */
  async updatePassword(userId: number, userData: Prisma.UserUpdateInput): Promise<User> {
    return await this.prisma.user.update({
      where: { id: userId },
      data: { password: userData.password },
    });
  }

  /**
   * 사용자 정보 삭제 soft delete
   */
  async deleteUser(userId: number): Promise<User> {
    return await this.prisma.user.update({
      where: { id: userId },
      data: {
        deletedAt: new Date(),
      },
    });
  }

  /**
   * 사용자 목록 조회
   */
  async findUsers(): Promise<User[]> {
    return await this.prisma.user.findMany({ where: { deletedAt: null } });
  }

  /**
   * 이메일로 사용자 조회
   */
  async findUserByEmail(email: string): Promise<User | null> {
    return await this.prisma.user.findFirst({
      where: { email, deletedAt: null },
    });
  }

  /**
   * 내가 멤버로 속한 프로젝트 목록 조회
   */
  async findProjectsByUserId(userId: User['id']) {
    const projects = await this.prisma.project.findMany({
      where: {
        projectMembers: {
          some: {
            userId,
            deletedAt: null,
          },
        },
        deletedAt: null,
      },
      include: {
        _count: {
          select: { projectMembers: { where: { deletedAt: null } } },
        },
        tasks: {
          where: { deletedAt: null },
          select: { status: true },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return projects.map((project) => {
      const todoCount = project.tasks.filter((task) => task.status === 'PENDING').length;
      const inProgressCount = project.tasks.filter((task) => task.status === 'IN_PROGRESS').length;
      const doneCount = project.tasks.filter((task) => task.status === 'DONE').length;

      return {
        id: project.id,
        name: project.name,
        description: project.description,
        memberCount: project._count.projectMembers,
        todoCount,
        inProgressCount,
        doneCount,
        createdAt: project.createdAt,
        updatedAt: project.updatedAt,
      };
    });
  }

  /**
   * 나에게 할당된 태스크 목록 조회
   */
  async findTasksByUserId(userId: User['id']) {
    const tasks = await this.prisma.task.findMany({
      where: { assigneeId: userId, deletedAt: null },
      include: {
        project: true,
        assignee: {
          select: {
            id: true,
            name: true,
            email: true,
            profileImage: true,
          },
        },
        taskTags: {
          include: { tag: true },
        },
        attachments: true,
      },
      orderBy: { createdAt: 'desc' },
    });
    // return tasks;
    return tasks.map((task) => {
      return {
        id: task.id,
        projectId: task.projectId,
        title: task.title,
        startYear: task.startYear,
        startMonth: task.startMonth,
        startDay: task.startDay,
        endYear: task.endYear,
        endMonth: task.endMonth,
        endDay: task.endDay,
        status: task.status,
        assignee: task.assignee,
        tags: task.taskTags.map((tt) => ({ id: tt.tag.id, name: tt.tag.name })),
        attachments: task.attachments.map((a) => a.url),
        createdAt: task.createdAt,
        updatedAt: task.updatedAt,
      };
    });
  }
}
