import { Router } from 'express';
import { UserController } from '@controllers';
import { authenticate, asyncHandler, validate } from '@middlewares';
import { UpdateUserStruct } from '@superstructs';

export const userRouter = (userController: UserController) => {
  const router = Router();

  router.route('/').get(asyncHandler(userController.findUsers));

  router.route('/search').get(asyncHandler(userController.findUserByEmail)); // 단순 검색은 공개 가능

  router
    .route('/me')
    .patch(authenticate, validate(UpdateUserStruct), asyncHandler(userController.updateUser))
    .get(authenticate, asyncHandler(userController.getMe)) // 조회는 인증 필요
    .delete(authenticate, asyncHandler(userController.deleteUser)); // 삭제는 인증 필요

  router
    .route('/me/verify-password')
    .post(authenticate, asyncHandler(userController.verifyPassword));
  router.route('/me/projects').get(authenticate, asyncHandler(userController.getMyProjects));
  router.route('/me/tasks').get(authenticate, asyncHandler(userController.getMyTasks));

  return router;
};
