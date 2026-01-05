import { Router } from 'express';
import { UserController } from '@controllers';
import { authenticate, asyncHandler, validate } from '@middlewares';
import { UpdateUserStruct } from '@superstructs';

export const userRouter = (userController: UserController) => {
  const router = Router();

  /**
   * @swagger
   * /users:
   *   get:
   *     summary: 사용자 목록
   *     tags: [Users]
   *     responses:
   *       200:
   *         description: 사용자 목록 조회 성공
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 type: object
   *                 properties:
   *                   id:
   *                     type: number
   *                   email:
   *                     type: string
   *                   name:
   *                     type: string
   *       400:
   *         description: 잘못된 요청
   */
  router.route('/').get(asyncHandler(userController.findUsers));

  /**
   * @swagger
   * /users/search:
   *   get:
   *     summary: 이메일로 회원 찾기
   *     tags: [Users]
   *     parameters:
   *       - in: query
   *         name: email
   *         schema:
   *           type: string
   *         required: true
   *         description: 검색할 사용자 이메일
   *         example: sadqueen@naver.com
   *     responses:
   *       200:
   *         description: 검색 성공
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 id:
   *                   type: number
   *                 email:
   *                   type: string
   *                 name:
   *                   type: string
   *                 profileImage:
   *                   type: string
   *                   nullable: true
   *       400:
   *         description: 이메일 파라미터 누락
   *       404:
   *         description: 해당 이메일의 사용자를 찾을 수 없음
   */
  router.route('/search').get(asyncHandler(userController.findUserByEmail)); // 단순 검색은 공개 가능

  /**
   * @swagger
   * /users/me:
   *   get:
   *     summary: 내 정보 조회
   *     tags: [Users]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: 내 정보 조회 성공
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 id:
   *                   type: number
   *                 email:
   *                   type: string
   *                 name:
   *                   type: string
   *                 profileImage:
   *                   type: string
   *                   nullable: true
   *   patch:
   *     summary: 내 정보 수정
   *     tags: [Users]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               name:
   *                 type: string
   *               password:
   *                 type: string
   *     responses:
   *       200:
   *         description: 수정 성공
   *   delete:
   *     summary: 회원 탈퇴
   *     tags: [Users]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: 탈퇴 성공
   */
  router
    .route('/me')
    .patch(authenticate, validate(UpdateUserStruct), asyncHandler(userController.updateUser))
    .get(authenticate, asyncHandler(userController.getMe)) // 조회는 인증 필요
    .delete(authenticate, asyncHandler(userController.deleteUser)); // 삭제는 인증 필요

  /**
   * @swagger
   * /users/me/verify-password:
   *   post:
   *     summary: 비밀번호 확인 (정보 수정 전 등)
   *     tags: [Users]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - password
   *             properties:
   *               password:
   *                 type: string
   *                 example: mySecretPassword123
   *     responses:
   *       200:
   *         description: 비밀번호 일치
   *       401:
   *         description: 비밀번호 불일치
   */
  router
    .route('/me/verify-password')
    .post(authenticate, asyncHandler(userController.verifyPassword));

  /**
   * @swagger
   * /users/me/password:
   *   patch:
   *     summary: 비밀번호 변경
   *     tags: [Users]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - password
   *             properties:
   *               password:
   *                 type: string
   *                 description: 변경할 새 비밀번호
   *                 example: newSecretPassword123!
   *     responses:
   *       200:
   *         description: 비밀번호 변경 성공
   *       400:
   *         description: 잘못된 요청 (유효성 검사 실패 등)
   */
  router.route('/me/password').patch(authenticate, asyncHandler(userController.updatePassword));

  /**
   * @swagger
   * /users/me/projects:
   *   get:
   *     summary: 내가 속한 프로젝트 목록 조회
   *     tags: [Users]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: 프로젝트 목록 조회 성공
   */
  router.route('/me/projects').get(authenticate, asyncHandler(userController.getMyProjects));

  /**
   * @swagger
   * /users/me/tasks:
   *   get:
   *     summary: 내게 할당된 작업(Task) 목록 조회
   *     tags: [Users]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: 작업 목록 조회 성공
   */
  router.route('/me/tasks').get(authenticate, asyncHandler(userController.getMyTasks));

  return router;
};
