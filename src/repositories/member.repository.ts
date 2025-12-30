import { prisma } from '@lib';
import { ProjectMember, ProjectRole, MemberStatus, Prisma } from '@prisma/client';

export class MemberRepository {
  // 프로젝트 멤버 목록 조회 (삭제되지 않은 멤버만, 초대 정보 포함)
  async findByProjectId(projectId: number) {
    return await prisma.projectMember.findMany({
      where: {
        projectId,
        deletedAt: null,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            profileImage: true,
          },
        },
        invitation: {
          select: {
            id: true,
            invitationStatus: true,
            createdAt: true,
          },
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
    });
  }

  // 멤버 ID로 조회
  async findById(id: number) {
    return await prisma.projectMember.findFirst({
      where: {
        id,
        deletedAt: null,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            profileImage: true,
          },
        },
      },
    });
  }

  // 프로젝트와 사용자로 멤버 조회
  async findByProjectAndUser(projectId: number, userId: number) {
    return await prisma.projectMember.findFirst({
      where: {
        projectId,
        userId,
        deletedAt: null,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            profileImage: true,
          },
        },
      },
    });
  }

  // 멤버 역할 변경
  async updateRole(id: number, role: ProjectRole) {
    return await prisma.projectMember.update({
      where: { id },
      data: { role },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            profileImage: true,
          },
        },
      },
    });
  }

  // 멤버 상태 변경
  async updateStatus(id: number, memberStatus: MemberStatus) {
    return await prisma.projectMember.update({
      where: { id },
      data: { memberStatus },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            profileImage: true,
          },
        },
      },
    });
  }

  // 멤버 삭제 (soft delete)
  async softDelete(id: number) {
    return await prisma.projectMember.update({
      where: { id },
      data: { deletedAt: new Date() },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            profileImage: true,
          },
        },
      },
    });
  }

  // 프로젝트 존재 여부 확인
  async projectExists(projectId: number): Promise<boolean> {
    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        deletedAt: null,
      },
    });
    return project !== null;
  }

  // 프로젝트 소유자 확인
  async isProjectOwner(projectId: number, userId: number): Promise<boolean> {
    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        ownerId: userId,
        deletedAt: null,
      },
    });
    return project !== null;
  }

  // 프로젝트 멤버 여부 확인 (ACCEPTED 상태이고 삭제되지 않은 멤버만)
  async isProjectMember(projectId: number, userId: number): Promise<boolean> {
    const projectMember = await prisma.projectMember.findFirst({
      where: {
        projectId,
        userId,
        memberStatus: 'ACCEPTED',
        deletedAt: null,
      },
    });
    return projectMember !== null;
  }

  // 프로젝트의 OWNER 역할 멤버 수 확인
  async countOwners(projectId: number): Promise<number> {
    return await prisma.projectMember.count({
      where: {
        projectId,
        role: 'OWNER',
        deletedAt: null,
      },
    });
  }
}
