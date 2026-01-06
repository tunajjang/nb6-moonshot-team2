import { PrismaClient, Project, ProjectRole, MemberStatus, User, Prisma } from '@prisma/client';

export class ProjectRepository {
  constructor(private prisma: PrismaClient) {}

  // 유저가 가진 프로젝트 개수 조회
  async countOwnedProjectsByUserId(userId: User['id']): Promise<number> {
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

  // 프로젝트 상세 조회
  async getProjectDetailData(projectId: number) {
    const project = await this.prisma.project.findUnique({
      where: {
        id: projectId,
        deletedAt: null,
      },
      include: {
        _count: {
          select: { projectMembers: { where: { deletedAt: null } } },
        },
      },
    });

    if (!project) return null;

    // 상태별 할 일 개수 (Promise.all로 병렬 처리 - 성능 최적화): 꺼내오지 않고 count()만 호출하여 DB 레벨에서 계산
    const [todoCount, inProgressCount, doneCount] = await Promise.all([
      this.prisma.task.count({ where: { projectId, status: 'PENDING', deletedAt: null } }),
      this.prisma.task.count({ where: { projectId, status: 'IN_PROGRESS', deletedAt: null } }),
      this.prisma.task.count({ where: { projectId, status: 'DONE', deletedAt: null } }),
    ]);

    return {
      id: project.id,
      name: project.name,
      description: project.description,
      memberCount: project._count.projectMembers,
      todoCount,
      inProgressCount,
      doneCount,
    };
  }

  // 프로젝트 수정
  async updateProject(
    projectId: number,
    data: { name?: string; description?: string },
  ): Promise<Project> {
    return this.prisma.project.update({
      where: {
        id: projectId,
        deletedAt: null,
      },
      data: {
        name: data.name,
        description: data.description,
      },
    });
  }

  // 권한 체크용 (이 유저가 멤버인지 확인)
  async isMember(projectId: number, userId: number): Promise<boolean> {
    const member = await this.prisma.projectMember.findFirst({
      where: { projectId, userId, deletedAt: null },
    });
    return !!member;
  }

  // 프로젝트 ID로 조회 (Soft Delete )
  async findProjectById(projectId: number): Promise<Project | null> {
    return this.prisma.project.findUnique({
      where: {
        id: projectId,
        deletedAt: null,
      },
    });
  }

  // 프로젝트 삭제
  async deleteProject(projectId: number): Promise<void> {
    await this.prisma.project.update({
      where: {
        id: projectId,
        deletedAt: null,
      },
      data: {
        deletedAt: new Date(),
      },
    });
  }
}
