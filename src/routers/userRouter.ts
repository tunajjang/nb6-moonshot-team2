import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { UserRepository } from '@/repositories';
import { UserService } from '@/services';
import { UserController } from '@/controllers';
import { asyncHandler } from '@/middlewares';

const prisma = new PrismaClient();
const userRepository = new UserRepository(prisma);
const userService = new UserService(userRepository);
const userController = new UserController(userService);

const router = Router();

router.route('/:id').get(asyncHandler(userController.getUserById));

export default router;
