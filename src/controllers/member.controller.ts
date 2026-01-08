import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { MemberService } from '@services';
import { UnauthorizedError, BadRequestError } from '@lib';

export class MemberController {
  private memberService: MemberService;

  constructor(memberService?: MemberService) {
    this.memberService = memberService || new MemberService();
  }

  // 프로젝트 멤버 목록 조회
  getMembersByProjectId = async (req: Request, res: Response) => {
    const { projectId } = req.params;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
    const userId = req.user?.id; // 인증 미들웨어에서 설정된 사용자 ID
    if (!userId) {
      throw new UnauthorizedError('User authentication required');
    }
    const result = await this.memberService.getMembersByProjectId(
      parseInt(projectId),
      userId,
      limit,
    );
    res.status(200).json(result);
  };

  // 멤버 역할 변경
  updateMemberRole = async (req: Request, res: Response) => {
    const { memberId } = req.params;
    const userId = req.user?.id; // 인증 미들웨어에서 설정된 사용자 ID
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
  };

  // 멤버 상태 변경
  updateMemberStatus = async (req: Request, res: Response) => {
    const { memberId } = req.params;
    const userId = req.user?.id; // 인증 미들웨어에서 설정된 사용자 ID
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
  };

  // 멤버 삭제 (탈퇴)
  deleteMember = async (req: Request, res: Response) => {
    const { memberId } = req.params;
    const userId = req.user?.id; // 인증 미들웨어에서 설정된 사용자 ID
    if (!userId) {
      throw new UnauthorizedError('User authentication required');
    }
    await this.memberService.deleteMember(parseInt(memberId), userId);
    res.status(200).json({
      success: true,
      message: 'Member deleted successfully',
    });
  };

  // 멤버 강제 제외 (프로젝트 생성자만 가능)
  removeMember = async (req: Request, res: Response) => {
    const { memberId } = req.params;
    const userId = req.user?.id; // 인증 미들웨어에서 설정된 사용자 ID
    if (!userId) {
      throw new UnauthorizedError('User authentication required');
    }
    await this.memberService.removeMember(parseInt(memberId), userId);
    res.status(200).json({
      success: true,
      message: 'Member removed successfully',
    });
  };

  // 프로젝트에서 유저 제외하기
  removeUserFromProject = async (req: Request, res: Response) => {
    const { projectId, userId } = req.params;
    const requesterId = req.user?.id; // 인증 미들웨어에서 설정된 사용자 ID
    if (!requesterId) {
      throw new UnauthorizedError('User authentication required');
    }
    await this.memberService.removeUserFromProject(
      parseInt(projectId),
      parseInt(userId),
      requesterId,
    );
    res.status(200).json({
      success: true,
      message: 'User removed from project successfully',
    });
  };
}
