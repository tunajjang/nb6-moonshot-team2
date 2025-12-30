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
exports.MemberController = void 0;
const member_service_1 = require("../services/member.service");
const express_validator_1 = require("express-validator");
const app_error_1 = require("../lib/errors/app.error");
class MemberController {
    constructor() {
        // 프로젝트 멤버 목록 조회
        this.getMembersByProjectId = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const { projectId } = req.params;
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id; // 인증 미들웨어에서 설정된 사용자 ID
                if (!userId) {
                    throw new app_error_1.UnauthorizedError('User authentication required');
                }
                const members = yield this.memberService.getMembersByProjectId(parseInt(projectId), userId);
                res.status(200).json({
                    success: true,
                    message: 'Members retrieved successfully',
                    data: members,
                });
            }
            catch (err) {
                next(err);
            }
        });
        // 멤버 역할 변경
        this.updateMemberRole = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const { memberId } = req.params;
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id; // 인증 미들웨어에서 설정된 사용자 ID
                if (!userId) {
                    throw new app_error_1.UnauthorizedError('User authentication required');
                }
                // 요청 데이터 검증
                const errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    throw new app_error_1.BadRequestError('Invalid input');
                }
                const member = yield this.memberService.updateMemberRole(parseInt(memberId), req.body.role, userId);
                res.status(200).json({
                    success: true,
                    message: 'Member role updated successfully',
                    data: member,
                });
            }
            catch (err) {
                next(err);
            }
        });
        // 멤버 상태 변경
        this.updateMemberStatus = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const { memberId } = req.params;
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id; // 인증 미들웨어에서 설정된 사용자 ID
                if (!userId) {
                    throw new app_error_1.UnauthorizedError('User authentication required');
                }
                // 요청 데이터 검증
                const errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    throw new app_error_1.BadRequestError('Invalid input');
                }
                const member = yield this.memberService.updateMemberStatus(parseInt(memberId), req.body.memberStatus, userId);
                res.status(200).json({
                    success: true,
                    message: 'Member status updated successfully',
                    data: member,
                });
            }
            catch (err) {
                next(err);
            }
        });
        // 멤버 삭제 (탈퇴)
        this.deleteMember = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const { memberId } = req.params;
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id; // 인증 미들웨어에서 설정된 사용자 ID
                if (!userId) {
                    throw new app_error_1.UnauthorizedError('User authentication required');
                }
                yield this.memberService.deleteMember(parseInt(memberId), userId);
                res.status(200).json({
                    success: true,
                    message: 'Member deleted successfully',
                });
            }
            catch (err) {
                next(err);
            }
        });
        // 멤버 강제 제외 (프로젝트 생성자만 가능)
        this.removeMember = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const { memberId } = req.params;
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id; // 인증 미들웨어에서 설정된 사용자 ID
                if (!userId) {
                    throw new app_error_1.UnauthorizedError('User authentication required');
                }
                yield this.memberService.removeMember(parseInt(memberId), userId);
                res.status(200).json({
                    success: true,
                    message: 'Member removed successfully',
                });
            }
            catch (err) {
                next(err);
            }
        });
        // 초대 생성
        this.createInvitation = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const { projectId } = req.params;
                const hostId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id; // 인증 미들웨어에서 설정된 사용자 ID
                if (!hostId) {
                    throw new app_error_1.UnauthorizedError('User authentication required');
                }
                // 요청 데이터 검증
                const errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    throw new app_error_1.BadRequestError('Invalid input');
                }
                const invitation = yield this.memberService.createInvitation(parseInt(projectId), hostId, req.body.email);
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
        // 초대 수락 (초대 링크 접속 시)
        this.acceptInvitation = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const { invitationId } = req.params;
                const guestId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id; // 인증 미들웨어에서 설정된 사용자 ID
                if (!guestId) {
                    throw new app_error_1.UnauthorizedError('User authentication required');
                }
                const invitation = yield this.memberService.acceptInvitation(invitationId, guestId);
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
                    throw new app_error_1.UnauthorizedError('User authentication required');
                }
                const invitation = yield this.memberService.cancelInvitation(invitationId, hostId);
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
                    throw new app_error_1.UnauthorizedError('User authentication required');
                }
                const invitations = yield this.memberService.getInvitationsByProjectId(parseInt(projectId), userId);
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
        this.memberService = new member_service_1.MemberService();
    }
}
exports.MemberController = MemberController;
