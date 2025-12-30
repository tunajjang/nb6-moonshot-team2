import { Router } from 'express';
import prisma from '../lib/prisma';
import { ProjectRepository } from '../repositories/projectRepository';
import { ProjectService } from '../services/projectService';
import { ProjectController } from '../controllers/projectController';
import { asyncHandler, validate } from '@/middlewares';
import { CreateProjectStruct, UpdateProjectStruct } from '../superstructs/projectStruct';

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
