import { Router } from 'express';
import { ProjectController, MemberController } from '@controllers';
import { CreateInvitationSchema } from '@superstructs';
import { authenticate, asyncHandler } from '@middlewares'; // asyncHandler 잊지 말고 임포트!

export const projectRouter = (
  projectController: ProjectController,
  memberController: MemberController,
) => {
  const router = Router();

  router.use(authenticate);

  router.post('/', asyncHandler(projectController.createProject));

  // 프로젝트 멤버 조회 (더 구체적인 경로를 먼저 정의)
  router.get('/:projectId/users', asyncHandler(memberController.getMembersByProjectId));

  // 프로젝트에서 유저 제외하기
  router.delete('/:projectId/users/:userId', asyncHandler(memberController.removeUserFromProject));

  // 프로젝트에 멤버 초대
  router.post(
    '/:projectId/invitations',
    ...CreateInvitationSchema,
    asyncHandler(memberController.createInvitation),
  );

  // 프로젝트 상세 조회, 수정, 삭제
  router.get('/:projectId', asyncHandler(projectController.getProjectDetail));
  router.patch('/:projectId', asyncHandler(projectController.updateProject));
  router.delete('/:projectId', asyncHandler(projectController.deleteProject));

  return router;
};
