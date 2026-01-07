import { Router } from 'express';
import { InvitationController } from '@controllers';
import { CreateInvitationSchema } from '@superstructs';
import { authenticate, optionalAuthenticate, asyncHandler } from '@middlewares';

const invitationRouter = (invitationController: InvitationController) => {
  const router = Router();

  // 초대 생성 (인증 필요)
  router.post(
    '/projects/:projectId',
    authenticate,
    ...CreateInvitationSchema,
    asyncHandler(invitationController.createInvitation),
  );

  // 초대 링크 접속 시 (GET) - 로그인되어 있으면 자동 수락, 없으면 로그인 페이지로 리다이렉트
  router.get(
    '/:invitationId/accept',
    optionalAuthenticate,
    asyncHandler(invitationController.getInvitationLink),
  );

  // 초대 수락 (POST) - API 호출용 (인증 필요)
  router.post(
    '/:invitationId/accept',
    authenticate,
    asyncHandler(invitationController.acceptInvitation),
  );

  // 초대 삭제 (인증 필요)
  router.delete(
    '/:invitationId',
    authenticate,
    asyncHandler(invitationController.deleteInvitation),
  );

  // 초대 취소 (인증 필요)
  router.post(
    '/:invitationId/cancel',
    authenticate,
    asyncHandler(invitationController.cancelInvitation),
  );

  return router;
};

export default invitationRouter;
