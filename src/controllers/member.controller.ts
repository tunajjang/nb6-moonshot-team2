import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { MemberService } from '@services';
import { UnauthorizedError, BadRequestError } from '@lib';

export class MemberController {
  private memberService: MemberService;

  constructor() {
    this.memberService = new MemberService();
  }

  // 프로젝트 멤버 목록 조회
  getMembersByProjectId = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { projectId } = req.params;
      const userId = (req as any).user?.id; // 인증 미들웨어에서 설정된 사용자 ID
      if (!userId) {
        throw new UnauthorizedError('User authentication required');
      }
      const members = await this.memberService.getMembersByProjectId(parseInt(projectId), userId);
      res.status(200).json({
        success: true,
        message: 'Members retrieved successfully',
        data: members,
      });
    } catch (err) {
      next(err);
    }
  };

  // 멤버 역할 변경
  updateMemberRole = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { memberId } = req.params;
      const userId = (req as any).user?.id; // 인증 미들웨어에서 설정된 사용자 ID
      if (!userId) {
        throw new UnauthorizedError('User authentication required');
      }
      // 요청 데이터 검증
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw new BadRequestError('Invalid input');
      }
      const member = await this.memberService.updateMemberRole(
        parseInt(memberId),
        req.body.role,
        userId,
      );
      res.status(200).json({
        success: true,
        message: 'Member role updated successfully',
        data: member,
      });
    } catch (err) {
      next(err);
    }
  };

  // 멤버 상태 변경
  updateMemberStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { memberId } = req.params;
      const userId = (req as any).user?.id; // 인증 미들웨어에서 설정된 사용자 ID
      if (!userId) {
        throw new UnauthorizedError('User authentication required');
      }
      // 요청 데이터 검증
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw new BadRequestError('Invalid input');
      }
      const member = await this.memberService.updateMemberStatus(
        parseInt(memberId),
        req.body.memberStatus,
        userId,
      );
      res.status(200).json({
        success: true,
        message: 'Member status updated successfully',
        data: member,
      });
    } catch (err) {
      next(err);
    }
  };

  // 멤버 삭제 (탈퇴)
  deleteMember = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { memberId } = req.params;
      const userId = (req as any).user?.id; // 인증 미들웨어에서 설정된 사용자 ID
      if (!userId) {
        throw new UnauthorizedError('User authentication required');
      }
      await this.memberService.deleteMember(parseInt(memberId), userId);
      res.status(200).json({
        success: true,
        message: 'Member deleted successfully',
      });
    } catch (err) {
      next(err);
    }
  };

  // 멤버 강제 제외 (프로젝트 생성자만 가능)
  removeMember = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { memberId } = req.params;
      const userId = (req as any).user?.id; // 인증 미들웨어에서 설정된 사용자 ID
      if (!userId) {
        throw new UnauthorizedError('User authentication required');
      }
      await this.memberService.removeMember(parseInt(memberId), userId);
      res.status(200).json({
        success: true,
        message: 'Member removed successfully',
      });
    } catch (err) {
      next(err);
    }
  };

  // 초대 생성
  createInvitation = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { projectId } = req.params;
      const hostId = (req as any).user?.id; // 인증 미들웨어에서 설정된 사용자 ID
      if (!hostId) {
        throw new UnauthorizedError('User authentication required');
      }
      // 요청 데이터 검증
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw new BadRequestError('Invalid input');
      }
      const invitation = await this.memberService.createInvitation(
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
  acceptInvitation = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { invitationId } = req.params;
      const guestId = (req as any).user?.id; // 인증 미들웨어에서 설정된 사용자 ID
      if (!guestId) {
        throw new UnauthorizedError('User authentication required');
      }
      const invitation = await this.memberService.acceptInvitation(invitationId, guestId);
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
  cancelInvitation = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { invitationId } = req.params;
      const hostId = (req as any).user?.id; // 인증 미들웨어에서 설정된 사용자 ID
      if (!hostId) {
        throw new UnauthorizedError('User authentication required');
      }
      const invitation = await this.memberService.cancelInvitation(invitationId, hostId);
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
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { projectId } = req.params;
      const userId = (req as any).user?.id; // 인증 미들웨어에서 설정된 사용자 ID
      if (!userId) {
        throw new UnauthorizedError('User authentication required');
      }
      const invitations = await this.memberService.getInvitationsByProjectId(
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
}
