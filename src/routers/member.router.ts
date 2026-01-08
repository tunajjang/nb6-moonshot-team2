import { Router } from 'express';
import { MemberController } from '@controllers';
import { UpdateMemberRoleSchema, UpdateMemberStatusSchema } from '@superstructs';
import { authenticate, asyncHandler } from '@middlewares';

const memberRouter = (memberController: MemberController) => {
  const router = Router();

  /**
   * @swagger
   * /api/members/projects/{projectId}/members:
   *   get:
   *     summary: 프로젝트 멤버 목록 조회
   *     tags: [Member]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: projectId
   *         required: true
   *         schema:
   *           type: integer
   *         description: 프로젝트 ID
   *     responses:
   *       200:
   *         description: 멤버 목록 조회 성공
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
   *                   example: Members retrieved successfully
   *                 data:
   *                   type: array
   *                   items:
   *                     type: object
   *                     properties:
   *                       id:
   *                         type: integer
   *                       role:
   *                         type: string
   *                         enum: [OWNER, MEMBER]
   *                       memberStatus:
   *                         type: string
   *                         enum: [PENDING, ACCEPTED]
   *                       user:
   *                         type: object
   *                         properties:
   *                           id:
   *                             type: integer
   *                           name:
   *                             type: string
   *                           email:
   *                             type: string
   *                           profileImage:
   *                             type: string
   *                             nullable: true
   *                       invitation:
   *                         type: object
   *                         nullable: true
   *                         properties:
   *                           id:
   *                             type: string
   *                           invitationStatus:
   *                             type: string
   *                             enum: [PENDING, ACCEPTED, CANCELED]
   *       401:
   *         description: 인증이 필요함
   *       403:
   *         description: 프로젝트 멤버만 조회 가능
   *       404:
   *         description: 프로젝트를 찾을 수 없음
   */
  router.get(
    '/projects/:projectId/members',
    authenticate,
    asyncHandler(memberController.getMembersByProjectId),
  );

  /**
   * @swagger
   * /api/members/projects/{projectId}/members/{memberId}/role:
   *   put:
   *     summary: 멤버 역할 변경
   *     tags: [Member]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: projectId
   *         required: true
   *         schema:
   *           type: integer
   *         description: 프로젝트 ID
   *       - in: path
   *         name: memberId
   *         required: true
   *         schema:
   *           type: integer
   *         description: 멤버 ID
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - role
   *             properties:
   *               role:
   *                 type: string
   *                 enum: [OWNER, MEMBER]
   *                 example: MEMBER
   *     responses:
   *       200:
   *         description: 멤버 역할 변경 성공
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
   *                   example: Member role updated successfully
   *                 data:
   *                   type: object
   *                   properties:
   *                     id:
   *                       type: integer
   *                     role:
   *                       type: string
   *                     user:
   *                       type: object
   *       400:
   *         description: 잘못된 요청
   *       401:
   *         description: 인증이 필요함
   *       403:
   *         description: 프로젝트 소유자만 역할 변경 가능
   *       404:
   *         description: 멤버를 찾을 수 없음
   */
  router.put(
    '/projects/:projectId/members/:memberId/role',
    authenticate,
    ...UpdateMemberRoleSchema,
    asyncHandler(memberController.updateMemberRole),
  );

  /**
   * @swagger
   * /api/members/projects/{projectId}/members/{memberId}/status:
   *   patch:
   *     summary: 멤버 상태 변경
   *     tags: [Member]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: projectId
   *         required: true
   *         schema:
   *           type: integer
   *         description: 프로젝트 ID
   *       - in: path
   *         name: memberId
   *         required: true
   *         schema:
   *           type: integer
   *         description: 멤버 ID
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - memberStatus
   *             properties:
   *               memberStatus:
   *                 type: string
   *                 enum: [PENDING, ACCEPTED]
   *                 example: ACCEPTED
   *     responses:
   *       200:
   *         description: 멤버 상태 변경 성공
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
   *                   example: Member status updated successfully
   *                 data:
   *                   type: object
   *                   properties:
   *                     id:
   *                       type: integer
   *                     memberStatus:
   *                       type: string
   *                     user:
   *                       type: object
   *       400:
   *         description: 잘못된 요청
   *       401:
   *         description: 인증이 필요함
   *       403:
   *         description: 본인의 상태만 변경 가능하거나 프로젝트 소유자만 가능
   *       404:
   *         description: 멤버를 찾을 수 없음
   */
  router.patch(
    '/projects/:projectId/members/:memberId/status',
    authenticate,
    ...UpdateMemberStatusSchema,
    asyncHandler(memberController.updateMemberStatus),
  );

  /**
   * @swagger
   * /api/members/projects/{projectId}/members/{memberId}:
   *   delete:
   *     summary: 멤버 탈퇴 (본인만 가능)
   *     tags: [Member]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: projectId
   *         required: true
   *         schema:
   *           type: integer
   *         description: 프로젝트 ID
   *       - in: path
   *         name: memberId
   *         required: true
   *         schema:
   *           type: integer
   *         description: 멤버 ID
   *     responses:
   *       200:
   *         description: 멤버 탈퇴 성공
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
   *                   example: Member deleted successfully
   *       400:
   *         description: 프로젝트 소유자는 탈퇴 불가
   *       401:
   *         description: 인증이 필요함
   *       403:
   *         description: 본인만 탈퇴 가능
   *       404:
   *         description: 멤버를 찾을 수 없음
   */
  router.delete(
    '/projects/:projectId/members/:memberId',
    authenticate,
    asyncHandler(memberController.deleteMember),
  );

  /**
   * @swagger
   * /api/members/projects/{projectId}/members/{memberId}/remove:
   *   delete:
   *     summary: 멤버 강제 제외 (프로젝트 소유자만 가능)
   *     tags: [Member]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: projectId
   *         required: true
   *         schema:
   *           type: integer
   *         description: 프로젝트 ID
   *       - in: path
   *         name: memberId
   *         required: true
   *         schema:
   *           type: integer
   *         description: 멤버 ID
   *     responses:
   *       200:
   *         description: 멤버 제외 성공
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
   *                   example: Member removed successfully
   *       400:
   *         description: 프로젝트 소유자는 제외 불가
   *       401:
   *         description: 인증이 필요함
   *       403:
   *         description: 프로젝트 소유자만 제외 가능
   *       404:
   *         description: 멤버를 찾을 수 없음
   */
  router.delete(
    '/projects/:projectId/members/:memberId/remove',
    authenticate,
    asyncHandler(memberController.removeMember),
  );

  return router;
};

export default memberRouter;
