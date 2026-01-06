import { Router } from 'express';
import { prisma } from '@lib';
import { ProjectRepository } from '@repositories';
import { ProjectService } from '@services';
import { ProjectController } from '@controllers';
import { asyncHandler, authenticate, validate } from '@middlewares';
import { CreateProjectStruct, UpdateProjectStruct } from '@superstructs';
import { CreateTaskBodyStruct } from '@/superstructs/task.superstruct';
import { withAsync } from '@/lib/withAsync';
import { createTask, getTaskList } from '@/controllers/task.controller';

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

// //아래는 Task 생성/목록조회 라우터
router.post('/:projectId/tasks', authenticate, withAsync(createTask));
router.get('/:projectId/tasks', authenticate, withAsync(getTaskList));

export default router;
