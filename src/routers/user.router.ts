import { Router } from 'express';
import { UserController } from '@controllers';
import { authenticate, asyncHandler, validate } from '@middlewares';
import { UpdateUserStruct } from '@superstructs';

export const userRouter = (userController: UserController) => {
  const router = Router();

  router.route('/').get(asyncHandler(userController.findUsers));

  router.route('/search').get(asyncHandler(userController.findUserByEmail));

  router
    .route('/me')
    .patch(authenticate, validate(UpdateUserStruct), asyncHandler(userController.updateUser))
    .get(asyncHandler(userController.getUserById)) // 조회는 공개 가능
    .delete(authenticate, asyncHandler(userController.deleteUser)); // 삭제는 인증 필요

  return router;
};
