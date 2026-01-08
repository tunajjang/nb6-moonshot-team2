import { Router } from 'express';
import { CommentController } from '@controllers';
import { CreateCommentSchema, UpdateCommentSchema } from '@superstructs';
import { authenticate, asyncHandler } from '@middlewares';

const commentRouter = (commentController: CommentController) => {
  const router = Router();

  /**
   * @swagger
   * /api/tasks/{taskId}/comments:
   *   get:
   *     summary: 특정 태스크의 댓글 목록 조회
   *     tags: [Comment]
   *     parameters:
   *       - in: path
   *         name: taskId
   *         required: true
   *         schema:
   *           type: integer
   *         description: 태스크 ID
   *     responses:
   *       200:
   *         description: 댓글 목록 조회 성공
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 data:
   *                   type: array
   *                   items:
   *                     type: object
   *                     properties:
   *                       id:
   *                         type: integer
   *                         example: 1
   *                       content:
   *                         type: string
   *                         example: 좋은 아이디어네요!
   *                       taskId:
   *                         type: integer
   *                         example: 1
   *                       author:
   *                         type: object
   *                         properties:
   *                           id:
   *                             type: integer
   *                             example: 1
   *                           name:
   *                             type: string
   *                             example: 홍길동
   *                           email:
   *                             type: string
   *                             example: user@example.com
   *                           profileImage:
   *                             type: string
   *                             nullable: true
   *                             example: https://example.com/profile.jpg
   *                       createdAt:
   *                         type: string
   *                         format: date-time
   *                         example: 2024-01-01T00:00:00.000Z
   *                       updatedAt:
   *                         type: string
   *                         format: date-time
   *                         example: 2024-01-01T00:00:00.000Z
   *                 total:
   *                   type: integer
   *                   example: 5
   *       404:
   *         description: 태스크를 찾을 수 없음
   */
  router.get('/tasks/:taskId/comments', asyncHandler(commentController.getCommentsByTaskId));

  /**
   * @swagger
   * /api/tasks/{taskId}/comments:
   *   post:
   *     summary: 댓글 생성
   *     tags: [Comment]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: taskId
   *         required: true
   *         schema:
   *           type: integer
   *         description: 태스크 ID
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - content
   *             properties:
   *               content:
   *                 type: string
   *                 minLength: 1
   *                 maxLength: 1000
   *                 example: 좋은 아이디어네요!
   *     responses:
   *       200:
   *         description: 댓글 생성 성공
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 id:
   *                   type: integer
   *                   example: 1
   *                 content:
   *                   type: string
   *                   example: 좋은 아이디어네요!
   *                 taskId:
   *                   type: integer
   *                   example: 1
   *                 author:
   *                   type: object
   *                   properties:
   *                     id:
   *                       type: integer
   *                       example: 1
   *                     name:
   *                       type: string
   *                       example: 홍길동
   *                     email:
   *                       type: string
   *                       example: user@example.com
   *                     profileImage:
   *                       type: string
   *                       nullable: true
   *                       example: https://example.com/profile.jpg
   *                 createdAt:
   *                   type: string
   *                   format: date-time
   *                   example: 2024-01-01T00:00:00.000Z
   *                 updatedAt:
   *                   type: string
   *                   format: date-time
   *                   example: 2024-01-01T00:00:00.000Z
   *       400:
   *         description: 잘못된 요청
   *       401:
   *         description: 인증이 필요함
   *       403:
   *         description: 프로젝트 멤버가 아님
   *       404:
   *         description: 태스크를 찾을 수 없음
   */
  router.post(
    '/tasks/:taskId/comments',
    authenticate,
    ...CreateCommentSchema,
    asyncHandler(commentController.createComment),
  );

  /**
   * @swagger
   * /api/comments/{commentId}:
   *   put:
   *     summary: 댓글 수정
   *     tags: [Comment]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: commentId
   *         required: true
   *         schema:
   *           type: integer
   *         description: 댓글 ID
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - content
   *             properties:
   *               content:
   *                 type: string
   *                 minLength: 1
   *                 maxLength: 1000
   *                 example: 수정된 댓글 내용입니다
   *     responses:
   *       200:
   *         description: 댓글 수정 성공
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
   *                   example: Comment updated successfully
   *                 data:
   *                   type: object
   *                   properties:
   *                     id:
   *                       type: integer
   *                     content:
   *                       type: string
   *                     author:
   *                       type: object
   *                     updatedAt:
   *                       type: string
   *                       format: date-time
   *       400:
   *         description: 잘못된 요청
   *       401:
   *         description: 인증이 필요함
   *       403:
   *         description: 본인이 작성한 댓글만 수정 가능
   *       404:
   *         description: 댓글을 찾을 수 없음
   */
  router.put(
    '/comments/:commentId',
    authenticate,
    ...UpdateCommentSchema,
    asyncHandler(commentController.updateComment),
  );

  /**
   * @swagger
   * /api/comments/{commentId}:
   *   delete:
   *     summary: 댓글 삭제
   *     tags: [Comment]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: commentId
   *         required: true
   *         schema:
   *           type: integer
   *         description: 댓글 ID
   *     responses:
   *       200:
   *         description: 댓글 삭제 성공
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
   *                   example: Comment deleted successfully
   *       401:
   *         description: 인증이 필요함
   *       403:
   *         description: 본인이 작성한 댓글만 삭제 가능
   *       404:
   *         description: 댓글을 찾을 수 없음
   */
  router.delete(
    '/comments/:commentId',
    authenticate,
    asyncHandler(commentController.deleteComment),
  );

  return router;
};

export default commentRouter;
