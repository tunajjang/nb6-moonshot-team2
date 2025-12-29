import { PrismaClient, Project, ProjectRole, MemberStatus, User, Prisma } from '@prisma/client';

export class ProjectRepository {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  // 유저가 가진 프로젝트 개수 조회
  async countProjectsByUserId(userId: User['id']): Promise<number> {
    return await this.prisma.project.count({
      where: {
        ownerId: userId,
        deletedAt: null,
      },
    });
  }

  // 프로젝트 생성 (트랜잭션 포함: 프로젝트 생성 + 멤버 추가)
  async createProject(userId: User['id'], name: string, description: string): Promise<Project> {
    return await this.prisma.project.create({
      data: {
        ownerId: userId,
        name,
        description,
        // Nested Write: 프로젝트를 만들면서 동시에 멤버 테이블에도 데이터 넣기
        projectMembers: {
          create: {
            userId,
            role: ProjectRole.OWNER,
            memberStatus: MemberStatus.ACCEPTED,
          },
        },
      },
    });
  }

  // 프로젝트 목록 조회 (Soft Delete)
  async getMyProjects(userId: User['id'], sort: 'latest' | 'alphabetical') {
    const orderBy: Prisma.ProjectOrderByWithRelationInput =
      sort === 'latest' ? { createdAt: 'desc' } : { name: 'asc' };

    return this.prisma.project.findMany({
      where: {
        projectMembers: {
          some: { userId, deletedAt: null },
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
      orderBy,
    });
  }
  // 유저 존재 여부 확인
  async findUserById(userId: User['id']) {
    return this.prisma.user.findFirst({
      where: { id: userId, deletedAt: null },
    });
  }

  // 프로젝트 상세 조회
  async getProjectDetail(projectId: Project['id']) {
    return this.prisma.project.findFirst({
      where: {
        id: projectId,
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
    });
  }

  // 프로젝트 ID로 조회 (수정 시 존재 확인용)
  async findProjectById(projectId: Project['id']) {
    return this.prisma.project.findFirst({
      where: { id: projectId, deletedAt: null },
    });
  }

  // 프로젝트 수정
  async updateProject(projectId: Project['id'], projectData: Prisma.ProjectUpdateInput) {
    return this.prisma.project.update({
      where: { id: projectId },
      data: projectData,
    });
  }

  // 프로젝트 삭제
  async deleteProject(projectId: Project['id']) {
    return this.prisma.project.update({
      where: { id: projectId },
      data: {
        deletedAt: new Date(),
      },
    });
  }
}
