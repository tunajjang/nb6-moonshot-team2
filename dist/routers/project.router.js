"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.projectRouter = void 0;
const express_1 = require("express");
const _superstructs_1 = require("@superstructs");
const _middlewares_1 = require("@middlewares"); // asyncHandler 잊지 말고 임포트!
const projectRouter = (projectController, memberController, invitationController) => {
    const router = (0, express_1.Router)();
    router.use(_middlewares_1.authenticate);
    router.post('/', (0, _middlewares_1.asyncHandler)(projectController.createProject));
    // 프로젝트 멤버 조회 (더 구체적인 경로를 먼저 정의)
    router.get('/:projectId/users', (0, _middlewares_1.asyncHandler)(memberController.getMembersByProjectId));
    // 프로젝트에서 유저 제외하기
    router.delete('/:projectId/users/:userId', (0, _middlewares_1.asyncHandler)(memberController.removeUserFromProject));
    // 프로젝트에 멤버 초대
    router.post('/:projectId/invitations', ..._superstructs_1.CreateInvitationSchema, (0, _middlewares_1.asyncHandler)(invitationController.createInvitation));
    // 프로젝트의 초대 목록 조회
    router.get('/:projectId/invitations', (0, _middlewares_1.asyncHandler)(invitationController.getInvitationsByProjectId));
    // 프로젝트 상세 조회, 수정, 삭제
    router.get('/:projectId', (0, _middlewares_1.asyncHandler)(projectController.getProjectDetail));
    router.patch('/:projectId', (0, _middlewares_1.asyncHandler)(projectController.updateProject));
    router.delete('/:projectId', (0, _middlewares_1.asyncHandler)(projectController.deleteProject));
    return router;
};
exports.projectRouter = projectRouter;
