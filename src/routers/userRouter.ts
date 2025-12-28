import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { UserRepository } from '@/repositories';
import { UserService } from '@/services';
import { UserController } from '@/controllers';
import { asyncHandler, validate } from '@/middlewares';
import { UpdateUserStruct } from '@superstructs';

const prisma = new PrismaClient();
const userRepository = new UserRepository(prisma);
const userService = new UserService(userRepository);
const userController = new UserController(userService);

const router = Router();

router.route('/').get(asyncHandler(userController.findUsers));

router.route('/search').get(asyncHandler(userController.findUserByEmail));

router
  .route('/:id')
  .patch(validate(UpdateUserStruct), asyncHandler(userController.updateUser))
  .get(asyncHandler(userController.getUserById))
  .delete(asyncHandler(userController.deleteUser));

export default router;
