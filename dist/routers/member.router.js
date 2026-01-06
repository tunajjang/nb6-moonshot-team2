"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const _controllers_1 = require("@controllers");
const _superstructs_1 = require("@superstructs");
const _middlewares_1 = require("@middlewares");
const router = (0, express_1.Router)();
const memberController = new _controllers_1.MemberController();
// 프로젝트 멤버 목록 조회 (인증 필요)
router.get('/projects/:projectId/members', _middlewares_1.authenticate, (0, _middlewares_1.asyncHandler)(memberController.getMembersByProjectId));
// 멤버 역할 변경 (인증 필요)
router.put('/projects/:projectId/members/:memberId/role', _middlewares_1.authenticate, ..._superstructs_1.UpdateMemberRoleSchema, (0, _middlewares_1.asyncHandler)(memberController.updateMemberRole));
// 멤버 상태 변경 (인증 필요)
router.patch('/projects/:projectId/members/:memberId/status', _middlewares_1.authenticate, ..._superstructs_1.UpdateMemberStatusSchema, (0, _middlewares_1.asyncHandler)(memberController.updateMemberStatus));
// 멤버 삭제 (탈퇴) (인증 필요)
router.delete('/projects/:projectId/members/:memberId', _middlewares_1.authenticate, (0, _middlewares_1.asyncHandler)(memberController.deleteMember));
// 멤버 강제 제외 (프로젝트 생성자만 가능) (인증 필요)
router.delete('/projects/:projectId/members/:memberId/remove', _middlewares_1.authenticate, (0, _middlewares_1.asyncHandler)(memberController.removeMember));
exports.default = router;
