import { Router } from 'express';
import { withAsync } from '../lib/withAsync';
import {
  createTask,
  updateTask,
  deleteTask,
  getTaskList,
  getTaskById,
} from '../controllers/task.controller';

const taskRouter = Router();

taskRouter.post('/projects/:projectId/tasks', withAsync(createTask));
taskRouter.get('/projects/:projectId/tasks', withAsync(getTaskList));
taskRouter.get('/:taskId', withAsync(getTaskById));
taskRouter.patch('/:taskId', withAsync(updateTask));
taskRouter.delete('/:taskId', withAsync(deleteTask));

//taskRouter.get('/:id', withAsync(getTaskDebug));

export default taskRouter;

/*
import { Router } from 'express';
import { prisma } from '@lib';
import { ProjectRepository } from '@repositories';
import { ProjectService } from '@services';
import { ProjectController } from '@controllers';
import { asyncHandler, validate } from '@middlewares';
import { CreateProjectStruct, UpdateProjectStruct } from '@superstructs';

const router = Router();

const projectRepository = new ProjectRepository(prisma);
const projectService = new ProjectService(projectRepository);
const projectController = new ProjectController(projectService);

router.post('/', validate(CreateProjectStruct), asyncHandler(projectController.createProject));
router.get('/:projectId', asyncHandler(projectController.getProjectDetail));
router.patch(
  '/:projectId',
  validate(UpdateProjectStruct),
  asyncHandler(projectController.updateProject),
);
router.delete('/:projectId', asyncHandler(projectController.deleteProject));

export default router;

*/
