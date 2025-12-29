import { Router } from 'express';
import { UserController } from '@/controllers';
import { asyncHandler, validate } from '@/middlewares';
import { UpdateUserStruct } from '@superstructs';

export const userRouter = (userController: UserController) => {
  const router = Router();

  router.route('/').get(asyncHandler(userController.findUsers));

  router.route('/search').get(asyncHandler(userController.findUserByEmail));

  router
    .route('/:id')
    .patch(validate(UpdateUserStruct), asyncHandler(userController.updateUser))
    .get(asyncHandler(userController.getUserById))
    .delete(asyncHandler(userController.deleteUser));

  return router;
};
