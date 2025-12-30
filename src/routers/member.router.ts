import { Router } from 'express';
import { MemberController } from '../controllers/member.controller';
import {
  CreateInvitationSchema,
  UpdateMemberRoleSchema,
  UpdateMemberStatusSchema,
} from '../superstructs/member.superstruct';

const router = Router();
const memberController = new MemberController();

// 프로젝트 멤버 목록 조회
router.get('/projects/:projectId/members', memberController.getMembersByProjectId);

// 멤버 역할 변경
router.put('/projects/:projectId/members/:memberId/role', ...UpdateMemberRoleSchema, memberController.updateMemberRole);

// 멤버 상태 변경
router.patch(
  '/projects/:projectId/members/:memberId/status',
  ...UpdateMemberStatusSchema,
  memberController.updateMemberStatus,
);

// 멤버 삭제 (탈퇴)
router.delete('/projects/:projectId/members/:memberId', memberController.deleteMember);

// 멤버 강제 제외 (프로젝트 생성자만 가능)
router.delete('/projects/:projectId/members/:memberId/remove', memberController.removeMember);

// 초대 생성
router.post('/projects/:projectId/invitations', ...CreateInvitationSchema, memberController.createInvitation);

// 초대 수락 (초대 링크 접속 시)
router.post('/invitations/:invitationId/accept', memberController.acceptInvitation);

// 초대 취소
router.post('/invitations/:invitationId/cancel', memberController.cancelInvitation);

// 프로젝트의 초대 목록 조회
router.get('/projects/:projectId/invitations', memberController.getInvitationsByProjectId);

export default router;

