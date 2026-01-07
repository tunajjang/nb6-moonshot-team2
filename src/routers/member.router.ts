import { Router } from 'express';
import { MemberController } from '@controllers';
import { UpdateMemberRoleSchema, UpdateMemberStatusSchema } from '@superstructs';
import { authenticate, asyncHandler } from '@middlewares';

const memberRouter = (memberController: MemberController) => {
  const router = Router();

  // 프로젝트 멤버 목록 조회 (인증 필요)
  router.get(
    '/projects/:projectId/members',
    authenticate,
    asyncHandler(memberController.getMembersByProjectId),
  );

  // 멤버 역할 변경 (인증 필요)
  router.put(
    '/projects/:projectId/members/:memberId/role',
    authenticate,
    ...UpdateMemberRoleSchema,
    asyncHandler(memberController.updateMemberRole),
  );

  // 멤버 상태 변경 (인증 필요)
  router.patch(
    '/projects/:projectId/members/:memberId/status',
    authenticate,
    ...UpdateMemberStatusSchema,
    asyncHandler(memberController.updateMemberStatus),
  );

  // 멤버 삭제 (탈퇴) (인증 필요)
  router.delete(
    '/projects/:projectId/members/:memberId',
    authenticate,
    asyncHandler(memberController.deleteMember),
  );

  // 멤버 강제 제외 (프로젝트 생성자만 가능) (인증 필요)
  router.delete(
    '/projects/:projectId/members/:memberId/remove',
    authenticate,
    asyncHandler(memberController.removeMember),
  );

  return router;
};

export default memberRouter;
