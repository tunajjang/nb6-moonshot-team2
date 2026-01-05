import { Router } from 'express';
import { InvitationController } from '@controllers';
import { authenticate, asyncHandler } from '@middlewares';

const router = Router();
const invitationController = new InvitationController();

// 초대 수락 (초대 링크 접속 시) (인증 필요)
router.post(
  '/:invitationId/accept',
  authenticate,
  asyncHandler(invitationController.acceptInvitation),
);

// 초대 삭제 (인증 필요)
router.delete('/:invitationId', authenticate, asyncHandler(invitationController.deleteInvitation));

// 초대 취소 (인증 필요)
router.post(
  '/:invitationId/cancel',
  authenticate,
  asyncHandler(invitationController.cancelInvitation),
);

export default router;
