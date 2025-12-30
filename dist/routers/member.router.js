"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const member_controller_1 = require("../controllers/member.controller");
const member_superstruct_1 = require("../superstructs/member.superstruct");
const router = (0, express_1.Router)();
const memberController = new member_controller_1.MemberController();
// 프로젝트 멤버 목록 조회
router.get('/projects/:projectId/members', memberController.getMembersByProjectId);
// 멤버 역할 변경
router.put('/projects/:projectId/members/:memberId/role', ...member_superstruct_1.UpdateMemberRoleSchema, memberController.updateMemberRole);
// 멤버 상태 변경
router.patch('/projects/:projectId/members/:memberId/status', ...member_superstruct_1.UpdateMemberStatusSchema, memberController.updateMemberStatus);
// 멤버 삭제 (탈퇴)
router.delete('/projects/:projectId/members/:memberId', memberController.deleteMember);
// 멤버 강제 제외 (프로젝트 생성자만 가능)
router.delete('/projects/:projectId/members/:memberId/remove', memberController.removeMember);
// 초대 생성
router.post('/projects/:projectId/invitations', ...member_superstruct_1.CreateInvitationSchema, memberController.createInvitation);
// 초대 수락 (초대 링크 접속 시)
router.post('/invitations/:invitationId/accept', memberController.acceptInvitation);
// 초대 취소
router.post('/invitations/:invitationId/cancel', memberController.cancelInvitation);
// 프로젝트의 초대 목록 조회
router.get('/projects/:projectId/invitations', memberController.getInvitationsByProjectId);
exports.default = router;
