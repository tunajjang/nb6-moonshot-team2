import { Router } from 'express';
import { ProjectController } from '@controllers';
import { authenticate, asyncHandler } from '@middlewares'; // asyncHandler 잊지 말고 임포트!

export const projectRouter = (projectController: ProjectController) => {
  const router = Router();

  router.use(authenticate);

  router.post('/', asyncHandler(projectController.createProject));
  router.get('/:projectId', asyncHandler(projectController.getProjectDetail));
  router.patch('/:projectId', asyncHandler(projectController.updateProject));
  router.delete('/:projectId', asyncHandler(projectController.deleteProject));

  return router;
};
