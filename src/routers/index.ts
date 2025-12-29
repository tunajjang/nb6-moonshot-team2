import { Router } from 'express';

import commentRouter from './comment.router';
import { PrismaClient } from '@prisma/client';

import { UserRepository, AuthRepository } from '@repositories';
import { UserService, AuthService } from '@services';
import { UserController, AuthController } from '@controllers';

import { authRouter } from './authRouter';
import { userRouter } from './userRouter';
import projectRouter from './projectRouter';

const router = Router();

const prisma = new PrismaClient();

const userRepository = new UserRepository(prisma);
const authRepository = new AuthRepository(prisma);
const userService = new UserService(userRepository);
const authService = new AuthService(authRepository, userRepository);
const userController = new UserController(userService);
const authController = new AuthController(authService);

router.route('/').get((req, res) => {
  res.send('ok');
});

router.use('/api', commentRouter);

router.use('/auth', authRouter(authController));
router.use('/users', userRouter(userController));
router.use('/projects', projectRouter);
// router.use('/tasks', taskRouter);
// router.use('/subtasks', subtaskRouter);
// router.use('/invitations', invitationRouter);

export default router;
