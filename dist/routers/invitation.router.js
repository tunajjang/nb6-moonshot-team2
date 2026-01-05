"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const _controllers_1 = require("@controllers");
const _middlewares_1 = require("@middlewares");
const router = (0, express_1.Router)();
const invitationController = new _controllers_1.InvitationController();
// 초대 수락 (초대 링크 접속 시) (인증 필요)
router.post('/:invitationId/accept', _middlewares_1.authenticate, (0, _middlewares_1.asyncHandler)(invitationController.acceptInvitation));
// 초대 삭제 (인증 필요)
router.delete('/:invitationId', _middlewares_1.authenticate, (0, _middlewares_1.asyncHandler)(invitationController.deleteInvitation));
// 초대 취소 (인증 필요)
router.post('/:invitationId/cancel', _middlewares_1.authenticate, (0, _middlewares_1.asyncHandler)(invitationController.cancelInvitation));
exports.default = router;
