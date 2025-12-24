import express from 'express';
import { withAsync } from '../lib/withAsync';
import { getTaskDebug } from '../controllers/task-controller';

const taskRouter = express.Router();

taskRouter.get('/:id', withAsync(getTaskDebug));

export default taskRouter;
