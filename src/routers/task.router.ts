import { Router } from 'express';
import { updateTask, deleteTask, getTaskById, createSubTask, getSubTaskList } from '@controllers';
import { authenticate, validate, asyncHandler } from '@middlewares';
import { UpdateTaskBodyStruct } from '@superstructs';

const taskRouter = Router();

/**
 * @swagger
 * /tasks/{taskId}:
 *   get:
 *     summary: 할 일 상세 조회
 *     tags: [Task]
 *     parameters:
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TaskDetail'
 *       400:
 *          description: "잘못된 요청 형식"
 *       401:
 *          description: "로그인이 필요합니다"
 *       403:
 *          description: "프로젝트 맴버가 아닙니다"
 *       404:
 *          description: ""
 */

taskRouter.get('/:taskId', authenticate, asyncHandler(getTaskById));

/**
 * @swagger
 * /tasks/{taskId}:
 *   patch:
 *     summary: 할 일 수정
 *     tags: [Task]
 *     parameters:
 *       - in: path
 *         name: taskId
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
 *               startYear:
 *                 type: integer
 *               startMonth:
 *                 type: integer
 *               startDay:
 *                 type: integer
 *               endYear:
 *                 type: integer
 *               endMonth:
 *                 type: integer
 *               endDay:
 *                 type: integer
 *               status:
 *                 type: string
 *                 enum: [PENDING, IN_PROGRESS, DONE]
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *               attachments:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: 수정 성공
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TaskDetail'
 *       400:
 *          description: "잘못된 요청 형식"
 *       401:
 *          description: "로그인이 필요합니다"
 *       403:
 *          description: "프로젝트 맴버가 아닙니다"
 *       404:
 *          description: ""
 */

taskRouter.patch(
  '/:taskId',
  authenticate,
  validate(UpdateTaskBodyStruct),
  asyncHandler(updateTask),
);

/**
 * @swagger
 * /tasks/{taskId}:
 *   delete:
 *     summary: 할 일 삭제
 *     tags: [Task]
 *     parameters:
 *       - in: path
 *         name: taskId
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

taskRouter.delete('/:taskId', authenticate, asyncHandler(deleteTask));

// //아래는 SubTask 생성/목록조회 라우터

/**
 * @swagger
 * /tasks/{taskId}/subtasks:
 *   post:
 *     summary: 할 일 생성
 *     tags: [Subtask]
 *     parameters:
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: integer
 *         description: 하위 할일 ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *             properties:
 *               title:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [PENDING, IN_PROGRESS, DONE]
 *     responses:
 *       201:
 *         description: 생성 성공
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
 *
 *   get:
 *     summary: 하위 할 일 리스트 조회
 *     tags: [Subtask]
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/SubTaskDetail'
 *                 total:
 *                   type: integer
 *                   example: 1
 *       400:
 *          description: "잘못된 요청 형식"
 *       401:
 *          description: "로그인이 필요합니다"
 *       403:
 *          description: "프로젝트 맴버가 아닙니다"
 *       404:
 *          description: ""
 * components:
 *   schemas:
 *     SubTaskDetail:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         title:
 *           type: string
 *         taskId:
 *           type: integer
 *         status:
 *           type: string
 *           enum: [PENDING, IN_PROGRESS, DONE]
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

taskRouter.post('/:taskId/subtasks', authenticate, asyncHandler(createSubTask));
taskRouter.get('/:taskId/subtasks', authenticate, asyncHandler(getSubTaskList));

export default taskRouter;
