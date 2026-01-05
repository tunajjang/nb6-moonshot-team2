import { Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { InvitationService } from '@services';
import { UnauthorizedError, BadRequestError } from '@lib';
import { AuthRequest } from '@middlewares';

export class InvitationController {
  private invitationService: InvitationService;

  constructor() {
    this.invitationService = new InvitationService();
  }

  // 초대 생성
  createInvitation = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { projectId } = req.params;
      const hostId = req.user?.id; // 인증 미들웨어에서 설정된 사용자 ID
      if (!hostId) {
        throw new UnauthorizedError('User authentication required');
      }
      // 요청 데이터 검증
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw new BadRequestError('Invalid input');
      }
      const invitation = await this.invitationService.createInvitation(
        parseInt(projectId),
        hostId,
        req.body.email,
      );
      res.status(201).json({
        success: true,
        message: 'Invitation created successfully',
        data: invitation,
      });
    } catch (err) {
      next(err);
    }
  };

  // 초대 수락 (초대 링크 접속 시)
  acceptInvitation = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { invitationId } = req.params;
      const guestId = req.user?.id; // 인증 미들웨어에서 설정된 사용자 ID
      if (!guestId) {
        throw new UnauthorizedError('User authentication required');
      }
      const invitation = await this.invitationService.acceptInvitation(invitationId, guestId);
      res.status(200).json({
        success: true,
        message: 'Invitation accepted successfully',
        data: invitation,
      });
    } catch (err) {
      next(err);
    }
  };

  // 초대 취소
  cancelInvitation = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { invitationId } = req.params;
      const hostId = req.user?.id; // 인증 미들웨어에서 설정된 사용자 ID
      if (!hostId) {
        throw new UnauthorizedError('User authentication required');
      }
      const invitation = await this.invitationService.cancelInvitation(invitationId, hostId);
      res.status(200).json({
        success: true,
        message: 'Invitation canceled successfully',
        data: invitation,
      });
    } catch (err) {
      next(err);
    }
  };

  // 프로젝트의 초대 목록 조회
  getInvitationsByProjectId = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
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
    } catch (err) {
      next(err);
    }
  };

  // 초대 삭제
  deleteInvitation = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { invitationId } = req.params;
      const hostId = req.user?.id; // 인증 미들웨어에서 설정된 사용자 ID
      if (!hostId) {
        throw new UnauthorizedError('User authentication required');
      }
      await this.invitationService.deleteInvitation(invitationId, hostId);
      res.status(200).json({
        success: true,
        message: 'Invitation deleted successfully',
      });
    } catch (err) {
      next(err);
    }
  };
}
