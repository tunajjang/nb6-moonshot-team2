import { Router } from 'express';
import { asyncHandler } from '@middlewares';
import { AuthController } from '@controllers';

export const authRouter = (authController: AuthController) => {
  const router = Router();

  router.route('/register').post(asyncHandler(authController.signUp));

  router.route('/login').post(asyncHandler(authController.login));

  // router.route('/logout').post(asyncHandler(authController.logout));

  router.route('/refresh').post(asyncHandler(authController.refreshTokens));

  router.route('/google').get(authController.googleAuth);

  router.route('/google/callback').get(asyncHandler(authController.googleAuthCallback));

  return router;
};
