import { Router } from 'express';
import { prisma } from '@lib';
import {
  UserRepository,
  AuthRepository,
  CommentRepository,
  MemberRepository,
  InvitationRepository,
  ProjectRepository,
} from '@repositories';
import { UserService, AuthService, CommentService, MemberService, ProjectService } from '@services';
import {
  UserController,
  AuthController,
  CommentController,
  MemberController,
  ProjectController,
} from '@controllers';

import { authRouter } from './auth.router';
import { userRouter } from './user.router';
import { projectRouter } from './project.router';
import memberRouter from './member.router';
import commentRouter from './comment.router';

const router = Router();

const userRepository = new UserRepository(prisma);
const authRepository = new AuthRepository(prisma);
const commentRepository = new CommentRepository();
const memberRepository = new MemberRepository();
const invitationRepository = new InvitationRepository();
const projectRepository = new ProjectRepository(prisma);

const userService = new UserService(userRepository);
const authService = new AuthService(authRepository, userRepository);
const commentService = new CommentService();
const memberService = new MemberService();
const projectService = new ProjectService(projectRepository);

const userController = new UserController(userService);
const authController = new AuthController(authService);
const commentController = new CommentController();
const memberController = new MemberController();
const projectController = new ProjectController(projectService);

router.route('/').get((req, res) => {
  res.send('ok');
});

router.use('/api', commentRouter);
router.use('/auth', authRouter(authController));
router.use('/users', userRouter(userController));
router.use('/projects', projectRouter(projectController));
router.use('/members', memberRouter);
// router.use('/tasks', taskRouter);
// router.use('/subtasks', subtaskRouter);
// router.use('/invitations', invitationRouter);

export default router;
