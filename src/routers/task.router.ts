import { Router } from 'express';
import { updateTask, deleteTask, getTaskById, createSubTask, getSubTaskList } from '@controllers';
import { authenticate, validate, asyncHandler } from '@middlewares';
import { UpdateTaskBodyStruct } from '@superstructs';

const taskRouter = Router();

taskRouter.get('/:taskId', authenticate, asyncHandler(getTaskById));
taskRouter.patch(
  '/:taskId',
  authenticate,
  validate(UpdateTaskBodyStruct),
  asyncHandler(updateTask),
);
taskRouter.delete('/:taskId', authenticate, asyncHandler(deleteTask));

// //아래는 SubTask 생성/목록조회 라우터
taskRouter.post('/:taskId/subtasks', authenticate, asyncHandler(createSubTask));
taskRouter.get('/:taskId/subtasks', authenticate, asyncHandler(getSubTaskList));

export default taskRouter;
