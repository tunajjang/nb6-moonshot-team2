import { Router } from 'express';
import { prisma } from '../lib/prisma';
import { ProjectRepository } from '../repositories/projectRepository';
import { ProjectService } from '../services/projectService';
import { ProjectController } from '../controllers/projectController';

const router = Router();

const projectRepository = new ProjectRepository(prisma);
const projectService = new ProjectService(projectRepository);
const projectController = new ProjectController(projectService);

router.post('/', projectController.createProject);

export default router;
