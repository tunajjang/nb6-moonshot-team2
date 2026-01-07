import {
  deleteSubTask,
  getSubTaskById,
  getSubTaskList,
  updateSubTask,
} from '@/controllers/subTask.controller';
import { updateTask } from '@/controllers/task.controller';
import { withAsync } from '@/lib/withAsync';
import { authenticate, validate } from '@/middlewares';
import { UpdateSubTaskBodyStruct } from '@/superstructs/subTask.struct';
import { Router } from 'express';

const subTaskRouter = Router();

subTaskRouter.get('/:subTaskId', authenticate, withAsync(getSubTaskById));
subTaskRouter.patch(
  '/:subTaskId',
  authenticate,
  validate(UpdateSubTaskBodyStruct),
  withAsync(updateSubTask),
);
subTaskRouter.delete('/:subTaskId', authenticate, withAsync(deleteSubTask));

export default subTaskRouter;
