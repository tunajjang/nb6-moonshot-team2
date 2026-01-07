import { deleteSubTask, getSubTaskById, updateSubTask } from '@controllers';
import { authenticate, validate, asyncHandler } from '@middlewares';
import { UpdateSubTaskBodyStruct } from '@superstructs';
import { Router } from 'express';

const subTaskRouter = Router();

/**
 * @swagger
 * /subtasks/{subtaskId}:
 *   get:
 *     summary: 하위 할 일 상세 조회
 *     tags: [Subtask]
 *     parameters:
 *       - in: path
 *         name: subtaskId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SubTaskDetail'
 *       400:
 *          description: "잘못된 요청 형식"
 *       401:
 *          description: "로그인이 필요합니다"
 *       403:
 *          description: "프로젝트 맴버가 아닙니다"
 *       404:
 *          description: ""
 */

subTaskRouter.get('/:subTaskId', authenticate, asyncHandler(getSubTaskById));

/**
 * @swagger
 * /subtasks/{subtaskId}:
 *   patch:
 *     summary: 하위 할 일 수정
 *     tags: [Subtask]
 *     parameters:
 *       - in: path
 *         name: subtaskId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [PENDING, IN_PROGRESS, DONE]
 *     responses:
 *       200:
 *         description: 수정 성공
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SubTaskDetail'
 *       400:
 *          description: "잘못된 요청 형식"
 *       401:
 *          description: "로그인이 필요합니다"
 *       403:
 *          description: "프로젝트 맴버가 아닙니다"
 *       404:
 *          description: ""
 */

subTaskRouter.patch(
  '/:subTaskId',
  authenticate,
  validate(UpdateSubTaskBodyStruct),
  asyncHandler(updateSubTask),
);

/**
 * @swagger
 * /subtasks/{subtaskId}:
 *   delete:
 *     summary: 하위 할 일 삭제
 *     tags: [Subtask]
 *     parameters:
 *       - in: path
 *         name: subtaskId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: ""
 *       400:
 *          description: "잘못된 요청 형식"
 *       401:
 *          description: "로그인이 필요합니다"
 *       403:
 *          description: "프로젝트 맴버가 아닙니다"
 *       404:
 *          description: ""
 */

subTaskRouter.delete('/:subTaskId', authenticate, asyncHandler(deleteSubTask));

export default subTaskRouter;
