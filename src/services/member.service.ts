import { MemberRepository } from '../repositories/member.repository';
import { InvitationRepository } from '../repositories/invitation.repository';
import prisma from '../lib/prisma';
import {
  ProjectNotFoundError,
  MemberNotFoundError,
  MemberUnauthorizedError,
  MemberAlreadyExistsError,
  InvitationAlreadyExistsError,
  InvitationNotFoundError,
  InvitationAlreadyAcceptedError,
  InvitationAlreadyCanceledError,
  UserNotFoundError,
  OwnerCannotLeaveError,
} from '../lib/errors/member.error';
import { ProjectRole, MemberStatus } from '@prisma/client';

export class MemberService {
  private memberRepository: MemberRepository;
  private invitationRepository: InvitationRepository;

  constructor() {
    this.memberRepository = new MemberRepository();
    this.invitationRepository = new InvitationRepository();
  }

  // 프로젝트 멤버 목록 조회
  async getMembersByProjectId(projectId: number, userId: number) {
    // 프로젝트 존재 여부 확인
    const projectExists = await this.memberRepository.projectExists(projectId);
    if (!projectExists) {
      throw new ProjectNotFoundError(projectId);
    }
    // 프로젝트 소유자이거나 멤버인지 확인
    const isOwner = await this.memberRepository.isProjectOwner(projectId, userId);
    const isMember = await this.memberRepository.isProjectMember(projectId, userId);
    if (!isOwner && !isMember) {
      throw new MemberUnauthorizedError('You must be a project member to view members');
    }
    return await this.memberRepository.findByProjectId(projectId);
  }

  // 멤버 역할 변경
  async updateMemberRole(memberId: number, role: ProjectRole, userId: number) {
    // 멤버 존재 여부 확인
    const member = await this.memberRepository.findById(memberId);
    if (!member) {
      throw new MemberNotFoundError(memberId);
    }
    // 프로젝트 소유자만 역할 변경 가능
    const isOwner = await this.memberRepository.isProjectOwner(member.projectId, userId);
    if (!isOwner) {
      throw new MemberUnauthorizedError('Only project owner can change member roles');
    }
    // 자신의 역할을 변경하려는 경우
    if (member.userId === userId && role === 'MEMBER') {
      const ownerCount = await this.memberRepository.countOwners(member.projectId);
      if (ownerCount <= 1) {
        throw new MemberUnauthorizedError('Project must have at least one owner');
      }
    }
    return await this.memberRepository.updateRole(memberId, role);
  }

  // 멤버 상태 변경 (PENDING -> ACCEPTED)
  async updateMemberStatus(memberId: number, memberStatus: MemberStatus, userId: number) {
    // 멤버 존재 여부 확인
    const member = await this.memberRepository.findById(memberId);
    if (!member) {
      throw new MemberNotFoundError(memberId);
    }
    // 자신의 상태만 변경 가능하거나, 프로젝트 소유자가 변경 가능
    const isOwner = await this.memberRepository.isProjectOwner(member.projectId, userId);
    const isSelf = member.userId === userId;
    if (!isOwner && !isSelf) {
      throw new MemberUnauthorizedError('You can only update your own member status');
    }
    return await this.memberRepository.updateStatus(memberId, memberStatus);
  }

  // 멤버 삭제 (탈퇴)
  async deleteMember(memberId: number, userId: number) {
    // 멤버 존재 여부 확인
    const member = await this.memberRepository.findById(memberId);
    if (!member) {
      throw new MemberNotFoundError(memberId);
    }
    // 자신만 탈퇴 가능
    if (member.userId !== userId) {
      throw new MemberUnauthorizedError('You can only leave the project yourself');
    }
    // 프로젝트 소유자는 탈퇴 불가
    if (member.role === 'OWNER') {
      const ownerCount = await this.memberRepository.countOwners(member.projectId);
      if (ownerCount <= 1) {
        throw new OwnerCannotLeaveError('Project owner cannot leave the project');
      }
    }
    return await this.memberRepository.softDelete(memberId);
  }

  // 멤버 강제 제외 (프로젝트 생성자만 가능)
  async removeMember(memberId: number, userId: number) {
    // 멤버 존재 여부 확인
    const member = await this.memberRepository.findById(memberId);
    if (!member) {
      throw new MemberNotFoundError(memberId);
    }
    // 프로젝트 소유자만 멤버 제외 가능
    const isOwner = await this.memberRepository.isProjectOwner(member.projectId, userId);
    if (!isOwner) {
      throw new MemberUnauthorizedError('Only project owner can remove members');
    }
    // 자신을 제외할 수 없음 (탈퇴는 deleteMember 사용)
    if (member.userId === userId) {
      throw new MemberUnauthorizedError('You cannot remove yourself. Use leave project instead.');
    }
    // 프로젝트 소유자를 제외할 수 없음
    if (member.role === 'OWNER') {
      const ownerCount = await this.memberRepository.countOwners(member.projectId);
      if (ownerCount <= 1) {
        throw new MemberUnauthorizedError('Cannot remove the only owner of the project');
      }
    }
    return await this.memberRepository.softDelete(memberId);
  }

  // 초대 생성
  async createInvitation(projectId: number, hostId: number, guestEmail: string) {
    // 프로젝트 존재 여부 확인
    const projectExists = await this.memberRepository.projectExists(projectId);
    if (!projectExists) {
      throw new ProjectNotFoundError(projectId);
    }
    // 프로젝트 소유자만 초대 가능
    const isOwner = await this.memberRepository.isProjectOwner(projectId, hostId);
    if (!isOwner) {
      throw new MemberUnauthorizedError('Only project owner can invite members');
    }
    // 이메일로 사용자 조회
    const guest = await this.invitationRepository.findUserByEmail(guestEmail);
    if (!guest) {
      throw new UserNotFoundError(guestEmail);
    }
    // 자신을 초대할 수 없음
    if (guest.id === hostId) {
      throw new MemberUnauthorizedError('You cannot invite yourself');
    }
    // 이미 프로젝트 멤버인지 확인
    const existingMember = await this.memberRepository.findByProjectAndUser(projectId, guest.id);
    if (existingMember) {
      throw new MemberAlreadyExistsError('User is already a member of this project');
    }
    // 이미 PENDING 상태의 초대가 있는지 확인
    const existingInvitation = await this.invitationRepository.findByProjectAndGuest(
      projectId,
      guest.id,
    );
    if (existingInvitation) {
      throw new InvitationAlreadyExistsError('Invitation already exists for this user and project');
    }
    // 초대 생성
    return await this.invitationRepository.create({
      project: { connect: { id: projectId } },
      host: { connect: { id: hostId } },
      guest: { connect: { id: guest.id } },
      invitationStatus: 'PENDING',
    });
  }

  // 초대 수락 (초대 링크 접속 시)
  async acceptInvitation(invitationId: string, guestId: number) {
    // 초대 존재 여부 확인
    const invitation = await this.invitationRepository.findById(invitationId);
    if (!invitation) {
      throw new InvitationNotFoundError(invitationId);
    }
    // 초대받은 사용자인지 확인
    if (invitation.guestId !== guestId) {
      throw new MemberUnauthorizedError('You are not authorized to accept this invitation');
    }
    // 이미 수락된 초대인지 확인
    if (invitation.invitationStatus === 'ACCEPTED') {
      throw new InvitationAlreadyAcceptedError('Invitation has already been accepted');
    }
    // 취소된 초대인지 확인
    if (invitation.invitationStatus === 'CANCELED') {
      throw new InvitationAlreadyCanceledError('Invitation has been canceled');
    }
    // 이미 프로젝트 멤버인지 확인
    const existingMember = await this.memberRepository.findByProjectAndUser(
      invitation.projectId,
      guestId,
    );
    if (existingMember) {
      throw new MemberAlreadyExistsError('User is already a member of this project');
    }
    // 트랜잭션으로 초대 수락 및 멤버 생성
    const result = await prisma.$transaction(async (tx) => {
      // 초대 상태를 ACCEPTED로 변경
      const updatedInvitation = await tx.invitation.update({
        where: { id: invitationId },
        data: { invitationStatus: 'ACCEPTED' },
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
      // 프로젝트 멤버 생성 (초대 수락 시 바로 참여 가능하도록 ACCEPTED 상태로 생성)
      await tx.projectMember.create({
        data: {
          projectId: invitation.projectId,
          userId: guestId,
          role: 'MEMBER',
          memberStatus: 'ACCEPTED',
          invitationId: invitationId,
        },
      });
      return updatedInvitation;
    });
    return result;
  }

  // 초대 취소 (프로젝트 소유자만 가능)
  async cancelInvitation(invitationId: string, hostId: number) {
    // 초대 존재 여부 확인
    const invitation = await this.invitationRepository.findById(invitationId);
    if (!invitation) {
      throw new InvitationNotFoundError(invitationId);
    }
    // 프로젝트 소유자인지 확인
    const isOwner = await this.memberRepository.isProjectOwner(invitation.projectId, hostId);
    if (!isOwner) {
      throw new MemberUnauthorizedError('Only project owner can cancel invitations');
    }
    // 이미 수락된 초대는 취소 불가
    if (invitation.invitationStatus === 'ACCEPTED') {
      throw new InvitationAlreadyAcceptedError('Cannot cancel an accepted invitation');
    }
    // 이미 취소된 초대인지 확인
    if (invitation.invitationStatus === 'CANCELED') {
      throw new InvitationAlreadyCanceledError('Invitation has already been canceled');
    }
    // 초대 취소
    return await this.invitationRepository.updateStatus(invitationId, 'CANCELED');
  }

  // 프로젝트의 초대 목록 조회
  async getInvitationsByProjectId(projectId: number, userId: number) {
    // 프로젝트 존재 여부 확인
    const projectExists = await this.memberRepository.projectExists(projectId);
    if (!projectExists) {
      throw new ProjectNotFoundError(projectId);
    }
    // 프로젝트 소유자만 초대 목록 조회 가능
    const isOwner = await this.memberRepository.isProjectOwner(projectId, userId);
    if (!isOwner) {
      throw new MemberUnauthorizedError('Only project owner can view invitations');
    }
    return await this.invitationRepository.findByProjectId(projectId);
  }
}
