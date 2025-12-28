import { Router } from 'express';
import userRouter from './userRouter';

const router = Router();

router.route('/').get((req, res) => {
  res.send('ok');
});

// router.use('/auth', authRouter);
router.use('/users', userRouter);
// router.use('/projects', projectRouter);
// router.use('/tasks', taskRouter);
// router.use('/subtasks', subtaskRouter);
// router.use('/invitations', invitationRouter);
// router.use('/comments', commentRouter);

export default router;
