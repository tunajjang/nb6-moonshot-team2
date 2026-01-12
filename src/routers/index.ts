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
import {
  UserService,
  AuthService,
  CommentService,
  MemberService,
  ProjectService,
  MailService,
  InvitationService,
} from '@services';
import {
  UserController,
  AuthController,
  CommentController,
  MemberController,
  ProjectController,
  InvitationController,
} from '@controllers';

import { authRouter } from './auth.router';
import { userRouter } from './user.router';
import { projectRouter } from './project.router';
import memberRouter from './member.router';
import commentRouter from './comment.router';
import imageRouter from './image.router';
import taskRouter from './task.router';
import subTaskRouter from './subTask.router';
import invitationRouter from './invitation.router';

const router = Router();

const userRepository = new UserRepository(prisma);
const authRepository = new AuthRepository(prisma);
const commentRepository = new CommentRepository();
const memberRepository = new MemberRepository();
const invitationRepository = new InvitationRepository();
const projectRepository = new ProjectRepository(prisma);

const userService = new UserService(userRepository);
const authService = new AuthService(authRepository, userRepository);
const mailService = new MailService();
const commentService = new CommentService(commentRepository);
const memberService = new MemberService(memberRepository);
const invitationService = new InvitationService(
  memberRepository,
  invitationRepository,
  mailService,
);
const projectService = new ProjectService(projectRepository, mailService);

const userController = new UserController(userService);
const authController = new AuthController(authService);
const commentController = new CommentController(commentService);
const memberController = new MemberController(memberService);
const invitationController = new InvitationController(invitationService);
const projectController = new ProjectController(projectService);

router.route('/').get((req, res) => {
  res.send('ok');
});

router.use('/', commentRouter(commentController));
router.use('/auth', authRouter(authController));
router.use('/users', userRouter(userController));
router.use('/projects', projectRouter(projectController, memberController, invitationController));
router.use('/members', memberRouter(memberController));
router.use('/file', imageRouter);
router.use('/tasks', taskRouter);
router.use('/subtasks', subTaskRouter);
router.use('/invitations', invitationRouter(invitationController));

export default router;
