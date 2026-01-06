import { Router } from 'express';
import { withAsync } from '../lib/withAsync';
import { updateTask, deleteTask, getTaskList, getTaskById } from '../controllers/task.controller';
import { authenticate, validate } from '@/middlewares';
import { CreateTaskBodyStruct, UpdateTaskBodyStruct } from '@/superstructs/task.superstruct';

const taskRouter = Router();

taskRouter.get('/:taskId', authenticate, withAsync(getTaskById));
taskRouter.patch('/:taskId', authenticate, validate(UpdateTaskBodyStruct), withAsync(updateTask));
taskRouter.delete('/:taskId', authenticate, withAsync(deleteTask));

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
