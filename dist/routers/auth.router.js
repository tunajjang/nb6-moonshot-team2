"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRouter = void 0;
const express_1 = require("express");
const _middlewares_1 = require("@middlewares");
const authRouter = (authController) => {
    const router = (0, express_1.Router)();
    /**
     * @swagger
     * /auth/register:
     *   post:
     *     summary: 회원가입
     *     tags: [Auth]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - email
     *               - password
     *               - name
     *             properties:
     *               email:
     *                 type: string
     *                 example: user@example.com
     *               password:
     *                 type: string
     *                 example: password123!
     *               name:
     *                 type: string
     *                 example: 홍길동
     *     responses:
     *       201:
     *         description: 회원가입 성공
     *       400:
     *         description: 잘못된 요청
     */
    router.route('/register').post((0, _middlewares_1.asyncHandler)(authController.signUp));
    /**
     * @swagger
     * /auth/login:
     *   post:
     *     summary: 로그인
     *     tags: [Auth]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - email
     *               - password
     *             properties:
     *               email:
     *                 type: string
     *                 example: user@example.com
     *               password:
     *                 type: string
     *                 example: password123!
     *     responses:
     *       200:
     *         description: 로그인 성공 (토큰 발급)
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 accessToken:
     *                   type: string
     *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
     *       401:
     *         description: 로그인 실패 (비밀번호 불일치 등)
     */
    router.route('/login').post((0, _middlewares_1.asyncHandler)(authController.login));
    /**
     * @swagger
     * /auth/logout:
     *   post:
     *     summary: 로그아웃
     *     tags: [Auth]
     *     security:
     *       - bearerAuth: [] #토큰(accessToken)이 필요하다는 표시
     *     responses:
     *       200:
     *         description: 로그아웃 성공
     */
    router.route('/logout').post((0, _middlewares_1.asyncHandler)(authController.logout));
    router.route('/refresh').post((0, _middlewares_1.asyncHandler)(authController.refreshTokens));
    router.route('/google').get(authController.googleAuth);
    router.route('/google/callback').get((0, _middlewares_1.asyncHandler)(authController.googleAuthCallback));
    return router;
};
exports.authRouter = authRouter;
