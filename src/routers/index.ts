import { Router } from 'express';
import userRouter from './userRouter';
import commentRouter from './comment.router';

const router = Router();

router.route('/').get((req, res) => {
  res.send('ok');
});

// router.use('/auth', authRouter);
router.use('/users', userRouter);
router.use('/api', commentRouter);
// router.use('/projects', projectRouter);
// router.use('/tasks', taskRouter);
// router.use('/subtasks', subtaskRouter);
// router.use('/invitations', invitationRouter);

export default router;
