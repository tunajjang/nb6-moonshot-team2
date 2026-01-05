"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvitationController = void 0;
const express_validator_1 = require("express-validator");
const _services_1 = require("@services");
const _lib_1 = require("@lib");
class InvitationController {
    constructor() {
        // 초대 생성
        this.createInvitation = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const { projectId } = req.params;
                const hostId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id; // 인증 미들웨어에서 설정된 사용자 ID
                if (!hostId) {
                    throw new _lib_1.UnauthorizedError('User authentication required');
                }
                // 요청 데이터 검증
                const errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    throw new _lib_1.BadRequestError('Invalid input');
                }
                const invitation = yield this.invitationService.createInvitation(parseInt(projectId), hostId, req.body.email);
                res.status(201).json({
                    success: true,
                    message: 'Invitation created successfully',
                    data: invitation,
                });
            }
            catch (err) {
                next(err);
            }
        });
        // 초대 링크 접속 시 (GET) - 로그인되어 있으면 자동 수락, 없으면 로그인 페이지로 리다이렉트
        this.getInvitationLink = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const { invitationId } = req.params;
                const guestId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id; // 선택적 인증 미들웨어에서 설정된 사용자 ID
                // 초대 정보 조회
                const invitation = yield this.invitationService.getInvitationById(invitationId);
                // 로그인되어 있지 않은 경우
                if (!guestId) {
                    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
                    // 로그인 페이지로 리다이렉트 (초대 ID를 쿼리 파라미터로 전달)
                    return res.redirect(`${frontendUrl}/login?invitation=${invitationId}`);
                }
                // 로그인되어 있고, 초대받은 사용자인 경우 자동 수락
                if (invitation.guest.id === guestId) {
                    try {
                        const acceptedInvitation = yield this.invitationService.acceptInvitation(invitationId, guestId);
                        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
                        // 프로젝트 페이지로 리다이렉트
                        return res.redirect(`${frontendUrl}/projects/${acceptedInvitation.project.id}`);
                    }
                    catch (acceptError) {
                        // 이미 수락되었거나 다른 에러인 경우
                        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
                        return res.redirect(`${frontendUrl}/invitations/${invitationId}?error=already_accepted`);
                    }
                }
                // 로그인되어 있지만 초대받은 사용자가 아닌 경우
                const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
                return res.redirect(`${frontendUrl}/invitations/${invitationId}?error=unauthorized`);
            }
            catch (err) {
                next(err);
            }
        });
        // 초대 수락 (POST) - API 호출용
        this.acceptInvitation = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const { invitationId } = req.params;
                const guestId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id; // 인증 미들웨어에서 설정된 사용자 ID
                if (!guestId) {
                    throw new _lib_1.UnauthorizedError('User authentication required');
                }
                const invitation = yield this.invitationService.acceptInvitation(invitationId, guestId);
                res.status(200).json({
                    success: true,
                    message: 'Invitation accepted successfully',
                    data: invitation,
                });
            }
            catch (err) {
                next(err);
            }
        });
        // 초대 취소
        this.cancelInvitation = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const { invitationId } = req.params;
                const hostId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id; // 인증 미들웨어에서 설정된 사용자 ID
                if (!hostId) {
                    throw new _lib_1.UnauthorizedError('User authentication required');
                }
                const invitation = yield this.invitationService.cancelInvitation(invitationId, hostId);
                res.status(200).json({
                    success: true,
                    message: 'Invitation canceled successfully',
                    data: invitation,
                });
            }
            catch (err) {
                next(err);
            }
        });
        // 프로젝트의 초대 목록 조회
        this.getInvitationsByProjectId = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const { projectId } = req.params;
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id; // 인증 미들웨어에서 설정된 사용자 ID
                if (!userId) {
                    throw new _lib_1.UnauthorizedError('User authentication required');
                }
                const invitations = yield this.invitationService.getInvitationsByProjectId(parseInt(projectId), userId);
                res.status(200).json({
                    success: true,
                    message: 'Invitations retrieved successfully',
                    data: invitations,
                });
            }
            catch (err) {
                next(err);
            }
        });
        // 초대 삭제
        this.deleteInvitation = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const { invitationId } = req.params;
                const hostId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id; // 인증 미들웨어에서 설정된 사용자 ID
                if (!hostId) {
                    throw new _lib_1.UnauthorizedError('User authentication required');
                }
                yield this.invitationService.deleteInvitation(invitationId, hostId);
                res.status(200).json({
                    success: true,
                    message: 'Invitation deleted successfully',
                });
            }
            catch (err) {
                next(err);
            }
        });
        this.invitationService = new _services_1.InvitationService();
    }
}
exports.InvitationController = InvitationController;
