import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { InvitationService } from '@services';
import { UnauthorizedError, BadRequestError } from '@lib';

export class InvitationController {
  private invitationService: InvitationService;

  constructor(invitationService?: InvitationService) {
    this.invitationService = invitationService || new InvitationService();
  }

  // 초대 생성
  createInvitation = async (req: Request, res: Response) => {
    const { projectId } = req.params;
    const hostId = req.user?.id; // 인증 미들웨어에서 설정된 사용자 ID
    if (!hostId) {
      throw new UnauthorizedError('로그인이 필요합니다');
    }
    // 요청 데이터 검증
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new BadRequestError('잘못된 요청 형식');
    }
    const invitation = await this.invitationService.createInvitation(
      parseInt(projectId),
      hostId,
      req.body.email,
    );
    // 요구사항에 맞는 응답 형식: { invitationId: string }
    res.status(201).json({
      invitationId: invitation.id,
    });
  };

  // 초대 링크 접속 시 (GET) - 로그인되어 있으면 자동 수락, 없으면 로그인 페이지로 리다이렉트
  getInvitationLink = async (req: Request, res: Response) => {
    const { invitationId } = req.params;
    const guestId = req.user?.id; // 선택적 인증 미들웨어에서 설정된 사용자 ID

    // 초대 정보 조회
    const invitation = await this.invitationService.getInvitationById(invitationId);

    // 로그인되어 있지 않은 경우
    if (!guestId) {
      const frontendUrl = process.env.FRONTEND_URL;
      // 로그인 페이지로 리다이렉트 (초대 ID를 쿼리 파라미터로 전달)
      return res.redirect(`${frontendUrl}/login?invitation=${invitationId}`);
    }

    // 로그인되어 있고, 초대받은 사용자인 경우 자동 수락
    if (invitation.guest.id === guestId) {
      try {
        const acceptedInvitation = await this.invitationService.acceptInvitation(
          invitationId,
          guestId,
        );
        const frontendUrl = process.env.FRONTEND_URL;
        // 프로젝트 페이지로 리다이렉트
        return res.redirect(`${frontendUrl}/projects/${acceptedInvitation.project.id}`);
      } catch (acceptError) {
        // 이미 수락되었거나 다른 에러인 경우
        const frontendUrl = process.env.FRONTEND_URL;
        return res.redirect(`${frontendUrl}/invitations/${invitationId}?error=already_accepted`);
      }
    }

    // 로그인되어 있지만 초대받은 사용자가 아닌 경우
    const frontendUrl = process.env.FRONTEND_URL;
    return res.redirect(`${frontendUrl}/invitations/${invitationId}?error=unauthorized`);
  };

  // 초대 수락 (POST) - API 호출용
  acceptInvitation = async (req: Request, res: Response) => {
    const { invitationId } = req.params;
    const guestId = req.user?.id; // 인증 미들웨어에서 설정된 사용자 ID
    if (!guestId) {
      throw new UnauthorizedError('User authentication required');
    }
    await this.invitationService.acceptInvitation(invitationId, guestId);
    // 요구사항에 맞는 응답 형식: 200 OK (응답 본문 없음)
    res.status(200).send();
  };

  // 초대 취소
  cancelInvitation = async (req: Request, res: Response) => {
    const { invitationId } = req.params;
    const hostId = req.user?.id; // 인증 미들웨어에서 설정된 사용자 ID
    if (!hostId) {
      throw new UnauthorizedError('로그인이 필요합니다');
    }
    await this.invitationService.cancelInvitation(invitationId, hostId);
    // 요구사항에 맞는 응답 형식: 200 OK (응답 본문 없음)
    res.status(200).send();
  };

  // 프로젝트의 초대 목록 조회
  getInvitationsByProjectId = async (req: Request, res: Response) => {
    const { projectId } = req.params;
    const userId = req.user?.id; // 인증 미들웨어에서 설정된 사용자 ID
    if (!userId) {
      throw new UnauthorizedError('User authentication required');
    }
    const invitations = await this.invitationService.getInvitationsByProjectId(
      parseInt(projectId),
      userId,
    );
    res.status(200).json({
      success: true,
      message: 'Invitations retrieved successfully',
      data: invitations,
    });
  };

  // 초대 삭제
  deleteInvitation = async (req: Request, res: Response) => {
    const { invitationId } = req.params;
    const hostId = req.user?.id; // 인증 미들웨어에서 설정된 사용자 ID
    if (!hostId) {
      throw new UnauthorizedError('로그인이 필요합니다.');
    }
    await this.invitationService.deleteInvitation(invitationId, hostId);
    // 요구사항에 맞는 응답 형식: 204 No Content (응답 본문 없음)
    res.status(204).send();
  };
}
