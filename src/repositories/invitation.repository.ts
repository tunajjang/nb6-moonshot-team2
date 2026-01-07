import { prisma } from '@lib';
import { InvitationStatus, Prisma } from '@prisma/client';

export class InvitationRepository {
  // 공통: 사용자 정보 select 필드
  private readonly userSelect = {
    id: true,
    name: true,
    email: true,
    profileImage: true,
  } as const;

  // 공통: 프로젝트 정보 select 필드
  private readonly projectSelect = {
    id: true,
    name: true,
    description: true,
  } as const;

  // 공통: 초대 정보를 포함한 include 옵션 (host, guest, project)
  private get invitationInclude() {
    return {
      host: {
        select: this.userSelect,
      },
      guest: {
        select: this.userSelect,
      },
      project: {
        select: this.projectSelect,
      },
    };
  }

  // 공통: 사용자 정보를 포함한 include 옵션
  private get userInclude() {
    return {
      user: {
        select: this.userSelect,
      },
    };
  }

  // 초대 생성
  async create(data: Prisma.InvitationCreateInput) {
    return await prisma.invitation.create({
      data,
      include: this.invitationInclude,
    });
  }

  // 초대 ID로 조회
  async findById(id: string) {
    return await prisma.invitation.findUnique({
      where: { id },
      include: this.invitationInclude,
    });
  }

  // 프로젝트와 게스트로 초대 조회 (PENDING 상태만)
  async findByProjectAndGuest(projectId: number, guestId: number) {
    return await prisma.invitation.findFirst({
      where: {
        projectId,
        guestId,
        invitationStatus: 'PENDING',
      },
      include: this.invitationInclude,
    });
  }

  // 프로젝트의 초대 목록 조회
  async findByProjectId(projectId: number) {
    return await prisma.invitation.findMany({
      where: {
        projectId,
      },
      include: this.invitationInclude,
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  // 초대 상태 변경
  async updateStatus(id: string, invitationStatus: InvitationStatus) {
    return await prisma.invitation.update({
      where: { id },
      data: { invitationStatus },
      include: this.invitationInclude,
    });
  }

  // 이메일로 사용자 조회
  async findUserByEmail(email: string) {
    return await prisma.user.findUnique({
      where: { email },
      select: this.userSelect,
    });
  }

  // 프로젝트 멤버 생성 (초대 수락 시)
  async createProjectMember(data: Prisma.ProjectMemberCreateInput) {
    return await prisma.projectMember.create({
      data,
      include: this.userInclude,
    });
  }
}
