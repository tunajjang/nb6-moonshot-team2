import { Router } from 'express';
import { MemberController } from '@controllers';
import { authenticate, asyncHandler } from '@middlewares';

const router = Router();
const memberController = new MemberController();

// 멤버 초대 수락
router.post('/:invitationId/accept', authenticate, asyncHandler(memberController.acceptInvitation));

// 멤버 초대 삭제
router.delete('/:invitationId', authenticate, asyncHandler(memberController.deleteInvitation));

export default router;
