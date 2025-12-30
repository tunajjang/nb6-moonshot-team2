"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const member_controller_1 = require("../controllers/member.controller");
const member_superstruct_1 = require("../superstructs/member.superstruct");
const _middlewares_1 = require("@middlewares");
const router = (0, express_1.Router)();
const memberController = new member_controller_1.MemberController();
// 프로젝트 멤버 목록 조회 (인증 필요)
router.get('/projects/:projectId/members', _middlewares_1.authenticate, (0, _middlewares_1.asyncHandler)(memberController.getMembersByProjectId));
// 멤버 역할 변경 (인증 필요)
router.put('/projects/:projectId/members/:memberId/role', _middlewares_1.authenticate, ...member_superstruct_1.UpdateMemberRoleSchema, (0, _middlewares_1.asyncHandler)(memberController.updateMemberRole));
// 멤버 상태 변경 (인증 필요)
router.patch('/projects/:projectId/members/:memberId/status', _middlewares_1.authenticate, ...member_superstruct_1.UpdateMemberStatusSchema, (0, _middlewares_1.asyncHandler)(memberController.updateMemberStatus));
// 멤버 삭제 (탈퇴) (인증 필요)
router.delete('/projects/:projectId/members/:memberId', _middlewares_1.authenticate, (0, _middlewares_1.asyncHandler)(memberController.deleteMember));
// 멤버 강제 제외 (프로젝트 생성자만 가능) (인증 필요)
router.delete('/projects/:projectId/members/:memberId/remove', _middlewares_1.authenticate, (0, _middlewares_1.asyncHandler)(memberController.removeMember));
// 초대 생성 (인증 필요)
router.post('/projects/:projectId/invitations', _middlewares_1.authenticate, ...member_superstruct_1.CreateInvitationSchema, (0, _middlewares_1.asyncHandler)(memberController.createInvitation));
// 초대 수락 (초대 링크 접속 시) (인증 필요)
router.post('/invitations/:invitationId/accept', _middlewares_1.authenticate, (0, _middlewares_1.asyncHandler)(memberController.acceptInvitation));
// 초대 취소 (인증 필요)
router.post('/invitations/:invitationId/cancel', _middlewares_1.authenticate, (0, _middlewares_1.asyncHandler)(memberController.cancelInvitation));
// 프로젝트의 초대 목록 조회 (인증 필요)
router.get('/projects/:projectId/invitations', _middlewares_1.authenticate, (0, _middlewares_1.asyncHandler)(memberController.getInvitationsByProjectId));
exports.default = router;
