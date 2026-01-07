"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRouter = void 0;
const express_1 = require("express");
const _middlewares_1 = require("@middlewares");
const _superstructs_1 = require("@superstructs");
const userRouter = (userController) => {
    const router = (0, express_1.Router)();
    /** 사용자 목록
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
    router.route('/').get((0, _middlewares_1.asyncHandler)(userController.findUsers));
    /** 이메일로 회원 찾기
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
    router.route('/search').get((0, _middlewares_1.asyncHandler)(userController.findUserByEmail)); // 단순 검색은 공개 가능
    /** 내 정보 조회
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
        .patch(_middlewares_1.authenticate, (0, _middlewares_1.validate)(_superstructs_1.UpdateUserStruct), (0, _middlewares_1.asyncHandler)(userController.updateUser))
        .get(_middlewares_1.authenticate, (0, _middlewares_1.asyncHandler)(userController.getMe)) // 조회는 인증 필요
        .delete(_middlewares_1.authenticate, (0, _middlewares_1.asyncHandler)(userController.deleteUser)); // 삭제는 인증 필요
    /** 비밀번호 확인 (정보 수정 전 등)
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
        .post(_middlewares_1.authenticate, (0, _middlewares_1.asyncHandler)(userController.verifyPassword));
    /** 비밀번호 변경
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
    router.route('/me/password').patch(_middlewares_1.authenticate, (0, _middlewares_1.asyncHandler)(userController.updatePassword));
    /** 내가 속한 프로젝트 목록 조회
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
    router.route('/me/projects').get(_middlewares_1.authenticate, (0, _middlewares_1.asyncHandler)(userController.getMyProjects));
    /** 내가 속한 프로젝트 목록 조회
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
    router.route('/me/tasks').get(_middlewares_1.authenticate, (0, _middlewares_1.asyncHandler)(userController.getMyTasks));
    return router;
};
exports.userRouter = userRouter;
