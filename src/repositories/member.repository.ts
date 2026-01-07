import { prisma } from '@lib';
import { ProjectRole, MemberStatus } from '@prisma/client';

export class MemberRepository {
  // 공통: 사용자 정보 select 필드
  private readonly userSelect = {
    id: true,
    name: true,
    email: true,
    profileImage: true,
  } as const;

  // 공통: 초대 정보 select 필드
  private readonly invitationSelect = {
    id: true,
    invitationStatus: true,
    createdAt: true,
  } as const;

  // 공통: 사용자 정보를 포함한 include 옵션
  private get userInclude() {
    return {
      user: {
        select: this.userSelect,
      },
    };
  }

  // 공통: 사용자와 초대 정보를 포함한 include 옵션
  private get userWithInvitationInclude() {
    return {
      user: {
        select: this.userSelect,
      },
      invitation: {
        select: this.invitationSelect,
      },
    };
  }

  // 공통: 삭제되지 않은 멤버 조건
  private get notDeletedCondition() {
    return { deletedAt: null };
  }

  // 프로젝트 멤버 목록 조회 (삭제되지 않은 멤버만, 초대 정보 포함)
  async findByProjectId(projectId: number) {
    return await prisma.projectMember.findMany({
      where: {
        projectId,
        ...this.notDeletedCondition,
      },
      include: this.userWithInvitationInclude,
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
        ...this.notDeletedCondition,
      },
      include: this.userInclude,
    });
  }

  // 프로젝트와 사용자로 멤버 조회
  async findByProjectAndUser(projectId: number, userId: number) {
    return await prisma.projectMember.findFirst({
      where: {
        projectId,
        userId,
        ...this.notDeletedCondition,
      },
      include: this.userInclude,
    });
  }

  // 멤버 역할 변경
  async updateRole(id: number, role: ProjectRole) {
    return await prisma.projectMember.update({
      where: { id },
      data: { role },
      include: this.userInclude,
    });
  }

  // 멤버 상태 변경
  async updateStatus(id: number, memberStatus: MemberStatus) {
    return await prisma.projectMember.update({
      where: { id },
      data: { memberStatus },
      include: this.userInclude,
    });
  }

  // 멤버 삭제 (soft delete)
  async softDelete(id: number) {
    return await prisma.projectMember.update({
      where: { id },
      data: { deletedAt: new Date() },
      include: this.userInclude,
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
