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
