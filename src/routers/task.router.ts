import { Router } from 'express';
import { withAsync } from '../lib/withAsync';
import { updateTask, deleteTask, getTaskList, getTaskById } from '../controllers/task.controller';
import { authenticate, validate } from '@/middlewares';
import { UpdateTaskBodyStruct } from '@/superstructs/task.superstruct';
import { createSubTask, getSubTaskList } from '@/controllers/subTask.controller';

const taskRouter = Router();

taskRouter.get('/:taskId', authenticate, withAsync(getTaskById));
taskRouter.patch('/:taskId', authenticate, validate(UpdateTaskBodyStruct), withAsync(updateTask));
taskRouter.delete('/:taskId', authenticate, withAsync(deleteTask));

// //아래는 SubTask 생성/목록조회 라우터
taskRouter.post('/:taskId/subtasks', authenticate, withAsync(createSubTask));
taskRouter.get('/:taskId/subtasks', authenticate, withAsync(getSubTaskList));

export default taskRouter;
