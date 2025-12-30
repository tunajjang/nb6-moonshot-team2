import { Router } from 'express';
import { prisma } from '@lib';
import { ProjectRepository } from '@repositories';
import { ProjectService } from '@services';
import { ProjectController } from '@controllers';
import { authenticate, asyncHandler, validate } from '@middlewares';
import { CreateProjectStruct, UpdateProjectStruct } from '@superstructs';

const router = Router();

const projectRepository = new ProjectRepository(prisma);
const projectService = new ProjectService(projectRepository);
const projectController = new ProjectController(projectService);

// 프로젝트 생성 (인증 필요)
router.post(
  '/',
  authenticate,
  validate(CreateProjectStruct),
  asyncHandler(projectController.createProject),
);
// 프로젝트 상세 조회 (인증 필요)
router.get('/:projectId', authenticate, asyncHandler(projectController.getProjectDetail));
// 프로젝트 수정 (인증 필요)
router.patch(
  '/:projectId',
  authenticate,
  validate(UpdateProjectStruct),
  asyncHandler(projectController.updateProject),
);
// 프로젝트 삭제 (인증 필요)
router.delete('/:projectId', authenticate, asyncHandler(projectController.deleteProject));

export default router;
