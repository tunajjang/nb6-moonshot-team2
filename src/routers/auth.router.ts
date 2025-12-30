import { Router } from 'express';
import { asyncHandler } from '@middlewares';
import { AuthController } from '@controllers';

export const authRouter = (authController: AuthController) => {
  const router = Router();

  router.route('/signup').post(asyncHandler(authController.signUp));

  router.route('/login').post(asyncHandler(authController.login));

  return router;
};
