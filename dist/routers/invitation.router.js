"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const _middlewares_1 = require("@middlewares");
const invitationRouter = (invitationController) => {
    const router = (0, express_1.Router)();
    // 초대 링크 접속 시 (GET) - 로그인되어 있으면 자동 수락, 없으면 로그인 페이지로 리다이렉트
    router.get('/:invitationId/accept', _middlewares_1.optionalAuthenticate, (0, _middlewares_1.asyncHandler)(invitationController.getInvitationLink));
    // 초대 수락 (POST) - API 호출용 (인증 필요)
    router.post('/:invitationId/accept', _middlewares_1.authenticate, (0, _middlewares_1.asyncHandler)(invitationController.acceptInvitation));
    // 초대 삭제 (인증 필요)
    router.delete('/:invitationId', _middlewares_1.authenticate, (0, _middlewares_1.asyncHandler)(invitationController.deleteInvitation));
    // 초대 취소 (인증 필요)
    router.post('/:invitationId/cancel', _middlewares_1.authenticate, (0, _middlewares_1.asyncHandler)(invitationController.cancelInvitation));
    return router;
};
exports.default = invitationRouter;
