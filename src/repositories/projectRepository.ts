import { PrismaClient, Project, ProjectRole, MemberStatus } from '@prisma/client';

export class ProjectRepository {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  // 유저가 가진 프로젝트 개수 조회
  async countProjectsByUserId(userId: number): Promise<number> {
    return await this.prisma.project.count({
      where: {
        ownerId: userId,
      },
    });
  }

  // 프로젝트 생성 (트랜잭션 포함: 프로젝트 생성 + 멤버 추가)
  async createProject(userId: number, name: string, description: string): Promise<Project> {
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
}
