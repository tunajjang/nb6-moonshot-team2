import prisma from '../lib/prisma';
import { Invitation, InvitationStatus, Prisma } from '@prisma/client';

export class InvitationRepository {
  // 초대 생성
  async create(data: Prisma.InvitationCreateInput) {
    return await prisma.invitation.create({
      data,
      include: {
        host: {
          select: {
            id: true,
            name: true,
            email: true,
            profileImage: true,
          },
        },
        guest: {
          select: {
            id: true,
            name: true,
            email: true,
            profileImage: true,
          },
        },
        project: {
          select: {
            id: true,
            name: true,
            description: true,
          },
        },
      },
    });
  }

  // 초대 ID로 조회
  async findById(id: string) {
    return await prisma.invitation.findUnique({
      where: { id },
      include: {
        host: {
          select: {
            id: true,
            name: true,
            email: true,
            profileImage: true,
          },
        },
        guest: {
          select: {
            id: true,
            name: true,
            email: true,
            profileImage: true,
          },
        },
        project: {
          select: {
            id: true,
            name: true,
            description: true,
          },
        },
      },
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
      include: {
        host: {
          select: {
            id: true,
            name: true,
            email: true,
            profileImage: true,
          },
        },
        guest: {
          select: {
            id: true,
            name: true,
            email: true,
            profileImage: true,
          },
        },
        project: {
          select: {
            id: true,
            name: true,
            description: true,
          },
        },
      },
    });
  }

  // 프로젝트의 초대 목록 조회
  async findByProjectId(projectId: number) {
    return await prisma.invitation.findMany({
      where: {
        projectId,
      },
      include: {
        host: {
          select: {
            id: true,
            name: true,
            email: true,
            profileImage: true,
          },
        },
        guest: {
          select: {
            id: true,
            name: true,
            email: true,
            profileImage: true,
          },
        },
        project: {
          select: {
            id: true,
            name: true,
            description: true,
          },
        },
      },
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
      include: {
        host: {
          select: {
            id: true,
            name: true,
            email: true,
            profileImage: true,
          },
        },
        guest: {
          select: {
            id: true,
            name: true,
            email: true,
            profileImage: true,
          },
        },
        project: {
          select: {
            id: true,
            name: true,
            description: true,
          },
        },
      },
    });
  }

  // 이메일로 사용자 조회
  async findUserByEmail(email: string) {
    return await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        name: true,
        email: true,
        profileImage: true,
      },
    });
  }

  // 프로젝트 멤버 생성 (초대 수락 시)
  async createProjectMember(data: Prisma.ProjectMemberCreateInput) {
    return await prisma.projectMember.create({
      data,
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
}

