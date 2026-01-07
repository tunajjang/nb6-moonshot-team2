import { deleteSubTask, getSubTaskById, updateSubTask } from '@controllers';
import { authenticate, validate, asyncHandler } from '@middlewares';
import { UpdateSubTaskBodyStruct } from '@superstructs';
import { Router } from 'express';

const subTaskRouter = Router();

subTaskRouter.get('/:subTaskId', authenticate, asyncHandler(getSubTaskById));
subTaskRouter.patch(
  '/:subTaskId',
  authenticate,
  validate(UpdateSubTaskBodyStruct),
  asyncHandler(updateSubTask),
);
subTaskRouter.delete('/:subTaskId', authenticate, asyncHandler(deleteSubTask));

export default subTaskRouter;
