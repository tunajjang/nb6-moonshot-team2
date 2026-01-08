import { Router } from 'express';
import { InvitationController } from '@controllers';
import { CreateInvitationSchema } from '@superstructs';
import { authenticate, optionalAuthenticate, asyncHandler } from '@middlewares';

const invitationRouter = (invitationController: InvitationController) => {
  const router = Router();

  /**
   * @swagger
   * /api/invitations/projects/{projectId}:
   *   post:
   *     summary: 프로젝트 멤버 초대
   *     tags: [Invitation]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: projectId
   *         required: true
   *         schema:
   *           type: integer
   *         description: 프로젝트 ID
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - email
   *             properties:
   *               email:
   *                 type: string
   *                 format: email
   *                 example: user@example.com
   *     responses:
   *       201:
   *         description: 초대 생성 성공
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 message:
   *                   type: string
   *                   example: Invitation created successfully
   *                 data:
   *                   type: object
   *                   properties:
   *                     id:
   *                       type: string
   *                       format: uuid
   *                     projectId:
   *                       type: integer
   *                     hostId:
   *                       type: integer
   *                     guestId:
   *                       type: integer
   *                     invitationStatus:
   *                       type: string
   *                       enum: [PENDING, ACCEPTED, CANCELED]
   *       400:
   *         description: 잘못된 요청
   *       401:
   *         description: 인증이 필요함
   *       403:
   *         description: 프로젝트 소유자만 초대 가능
   *       404:
   *         description: 프로젝트를 찾을 수 없음
   *       409:
   *         description: 이미 초대된 사용자
   */
  router.post(
    '/projects/:projectId',
    authenticate,
    ...CreateInvitationSchema,
    asyncHandler(invitationController.createInvitation),
  );

  /**
   * @swagger
   * /api/invitations/{invitationId}/accept:
   *   get:
   *     summary: 초대 링크 접속 (로그인되어 있으면 자동 수락)
   *     tags: [Invitation]
   *     parameters:
   *       - in: path
   *         name: invitationId
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *         description: 초대 ID
   *     responses:
   *       302:
   *         description: 리다이렉트 (프로젝트 페이지 또는 로그인 페이지)
   *       404:
   *         description: 초대를 찾을 수 없음
   */
  router.get(
    '/:invitationId/accept',
    optionalAuthenticate,
    asyncHandler(invitationController.getInvitationLink),
  );

  /**
   * @swagger
   * /api/invitations/{invitationId}/accept:
   *   post:
   *     summary: 초대 수락
   *     tags: [Invitation]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: invitationId
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *         description: 초대 ID
   *     responses:
   *       200:
   *         description: 초대 수락 성공
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 message:
   *                   type: string
   *                   example: Invitation accepted successfully
   *                 data:
   *                   type: object
   *                   properties:
   *                     id:
   *                       type: string
   *                     invitationStatus:
   *                       type: string
   *                       enum: [ACCEPTED]
   *                     project:
   *                       type: object
   *                       properties:
   *                         id:
   *                           type: integer
   *                         name:
   *                           type: string
   *       400:
   *         description: 이미 수락되었거나 취소된 초대
   *       401:
   *         description: 인증이 필요함
   *       403:
   *         description: 초대받은 사용자만 수락 가능
   *       404:
   *         description: 초대를 찾을 수 없음
   */
  router.post(
    '/:invitationId/accept',
    authenticate,
    asyncHandler(invitationController.acceptInvitation),
  );

  /**
   * @swagger
   * /api/invitations/{invitationId}:
   *   delete:
   *     summary: 초대 삭제
   *     tags: [Invitation]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: invitationId
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *         description: 초대 ID
   *     responses:
   *       200:
   *         description: 초대 삭제 성공
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 message:
   *                   type: string
   *                   example: Invitation deleted successfully
   *       400:
   *         description: 이미 수락된 초대는 삭제 불가
   *       401:
   *         description: 인증이 필요함
   *       403:
   *         description: 프로젝트 소유자만 삭제 가능
   *       404:
   *         description: 초대를 찾을 수 없음
   */
  router.delete(
    '/:invitationId',
    authenticate,
    asyncHandler(invitationController.deleteInvitation),
  );

  /**
   * @swagger
   * /api/invitations/{invitationId}/cancel:
   *   post:
   *     summary: 초대 취소
   *     tags: [Invitation]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: invitationId
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *         description: 초대 ID
   *     responses:
   *       200:
   *         description: 초대 취소 성공
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 message:
   *                   type: string
   *                   example: Invitation canceled successfully
   *                 data:
   *                   type: object
   *                   properties:
   *                     id:
   *                       type: string
   *                     invitationStatus:
   *                       type: string
   *                       enum: [CANCELED]
   *       400:
   *         description: 이미 수락된 초대는 취소 불가
   *       401:
   *         description: 인증이 필요함
   *       403:
   *         description: 프로젝트 소유자만 취소 가능
   *       404:
   *         description: 초대를 찾을 수 없음
   */
  router.post(
    '/:invitationId/cancel',
    authenticate,
    asyncHandler(invitationController.cancelInvitation),
  );

  return router;
};

export default invitationRouter;
