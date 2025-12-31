import express from 'express';
import { withAsync } from '../lib/withAsync';
import {
  getTaskDebug,
  createTask,
  updateTask,
  deleteTask,
  getTaskList,
  getTaskById,
} from '../controllers/task.controller';

const taskRouter = express.Router();

taskRouter.post('/projects/:projectId/tasks', withAsync(createTask));
taskRouter.get('/projects/:projectId/tasks', withAsync(getTaskList));
taskRouter.get('/:taskId', withAsync(getTaskById));
taskRouter.patch('/:taskId', withAsync(updateTask));
taskRouter.delete('/:taskId', withAsync(deleteTask));

//taskRouter.get('/:id', withAsync(getTaskDebug));

export default taskRouter;
