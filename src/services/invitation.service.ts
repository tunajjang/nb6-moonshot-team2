import { MemberRepository, InvitationRepository } from '@repositories';
import {
  prisma,
  ProjectNotFoundError,
  MemberUnauthorizedError,
  MemberAlreadyExistsError,
  InvitationAlreadyExistsError,
  InvitationNotFoundError,
  InvitationAlreadyAcceptedError,
  InvitationAlreadyCanceledError,
  UserNotFoundError,
} from '@lib';
import { MailService } from './mail.service';

export class InvitationService {
  private memberRepository: MemberRepository;
  private invitationRepository: InvitationRepository;
  private mailService: MailService;

  constructor(
    memberRepository?: MemberRepository,
    invitationRepository?: InvitationRepository,
    mailService?: MailService,
  ) {
    this.memberRepository = memberRepository || new MemberRepository();
    this.invitationRepository = invitationRepository || new InvitationRepository();
    this.mailService = mailService || new MailService();
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
    const invitation = await this.invitationRepository.create({
      project: { connect: { id: projectId } },
      host: { connect: { id: hostId } },
      guest: { connect: { id: guest.id } },
      invitationStatus: 'PENDING',
    });

    // 초대 링크 생성
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const invitationLink = `${frontendUrl}/invitations/${invitation.id}/accept`;

    // 이메일 발송 (비동기, 에러가 발생해도 초대는 생성되었으므로 로깅만 하고 계속 진행)
    this.mailService
      .sendInvitationEmail({
        to: guestEmail,
        projectName: invitation.project.name,
        hostName: invitation.host.name,
        invitationLink,
      })
      .catch((error: unknown) => {
        console.error('초대 이메일 발송 실패 (초대는 생성됨):', error);
        // 이메일 발송 실패해도 초대는 이미 생성되었으므로 에러를 던지지 않음
      });

    return invitation;
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

  // 초대 삭제 (프로젝트 소유자만 가능) - DELETE 메서드용
  async deleteInvitation(invitationId: string, hostId: number) {
    // 초대 존재 여부 확인
    const invitation = await this.invitationRepository.findById(invitationId);
    if (!invitation) {
      throw new InvitationNotFoundError(invitationId);
    }
    // 프로젝트 소유자인지 확인
    const isOwner = await this.memberRepository.isProjectOwner(invitation.projectId, hostId);
    if (!isOwner) {
      throw new MemberUnauthorizedError('Only project owner can delete invitations');
    }
    // 이미 수락된 초대는 삭제 불가
    if (invitation.invitationStatus === 'ACCEPTED') {
      throw new InvitationAlreadyAcceptedError('Cannot delete an accepted invitation');
    }
    // 이미 취소된 초대인지 확인
    if (invitation.invitationStatus === 'CANCELED') {
      throw new InvitationAlreadyCanceledError('Invitation has already been canceled');
    }
    // 초대 취소
    return await this.invitationRepository.updateStatus(invitationId, 'CANCELED');
  }

  // 초대 정보 조회 (링크 접속 시 사용)
  async getInvitationById(invitationId: string) {
    const invitation = await this.invitationRepository.findById(invitationId);
    if (!invitation) {
      throw new InvitationNotFoundError(invitationId);
    }
    return invitation;
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
