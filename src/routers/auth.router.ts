import { Router } from 'express';
import { asyncHandler } from '@middlewares';
import { AuthController } from '@controllers';

export const authRouter = (authController: AuthController) => {
  const router = Router();

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
   *                 example: sadqueen@naver.com
   *               password:
   *                 type: string
   *                 example: password1234
   *               name:
   *                 type: string
   *                 example: 호랭이
   *     responses:
   *       201:
   *         description: 회원가입 성공
   *       400:
   *         description: 잘못된 요청
   */
  router.route('/register').post(asyncHandler(authController.signUp));

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
   *                 example: sadqueen@naver.com
   *               password:
   *                 type: string
   *                 example: password1234
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
  router.route('/login').post(asyncHandler(authController.login));

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
  router.route('/logout').post(asyncHandler(authController.logout));

  /**
   * @swagger
   * /auth/refresh:
   *   post:
   *     summary: 리프래시 토큰 재발급
   *     tags: [Auth]
   *     security:
   *       - bearerAuth: [] # [추가] Authorization 헤더에 Refresh Token을 넣어주세요
   *     # [제거] requestBody 섹션 전체 제거
   *     responses:
   *       200:
   *         description: OK - 리프래시 토큰 재발급 성공
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 accessToken:
   *                   type: string
   *                 refreshToken:
   *                   type: string
   *       401:
   *         description: Unauthorized - 토큰이 유효하지 않습니다.
   */
  router.route('/refresh').post(asyncHandler(authController.refreshTokens));

  /**
   * @swagger
   * /auth/google:
   *   get:
   *     summary: 구글 로그인 페이지로 리다이렉트
   *     tags: [Auth]
   *     responses:
   *       302:
   *         description: 구글 로그인 페이지로 이동
   *         headers:
   *           Location:
   *             schema:
   *               type: string
   *               example: https://accounts.google.com/o/oauth2/v2/auth?...
   */
  router.route('/google').get(authController.googleAuth);

  /**
   * @swagger
   * /auth/google/callback:
   *   get:
   *     summary: 구글 로그인 콜백 (구글에서 리다이렉트됨)
   *     tags: [Auth]
   *     parameters:
   *       - in: query
   *         name: code
   *         schema:
   *           type: string
   *         required: true
   *         description: 구글에서 받은 인증 코드
   *     responses:
   *       200:
   *         description: 구글 로그인/회원가입 성공 및 토큰 발급
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 accessToken:
   *                   type: string
   *                 refreshToken:
   *                   type: string
   *                 user:
   *                   type: object
   *                   properties:
   *                     email:
   *                       type: string
   *                     name:
   *                       type: string
   *       400:
   *         description: 인증 코드가 없음
   */
  router.route('/google/callback').get(asyncHandler(authController.googleAuthCallback));

  return router;
};
