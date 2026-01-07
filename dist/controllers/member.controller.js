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
const express_validator_1 = require("express-validator");
const _services_1 = require("@services");
const _lib_1 = require("@lib");
class MemberController {
    constructor(memberService) {
        // 프로젝트 멤버 목록 조회
        this.getMembersByProjectId = (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const { projectId } = req.params;
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id; // 인증 미들웨어에서 설정된 사용자 ID
            if (!userId) {
                throw new _lib_1.UnauthorizedError('User authentication required');
            }
            const members = yield this.memberService.getMembersByProjectId(parseInt(projectId), userId);
            res.status(200).json({
                success: true,
                message: 'Members retrieved successfully',
                data: members,
            });
        });
        // 멤버 역할 변경
        this.updateMemberRole = (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const { memberId } = req.params;
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id; // 인증 미들웨어에서 설정된 사용자 ID
            if (!userId) {
                throw new _lib_1.UnauthorizedError('User authentication required');
            }
            // 요청 데이터 검증
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                throw new _lib_1.BadRequestError('Invalid input');
            }
            const member = yield this.memberService.updateMemberRole(parseInt(memberId), req.body.role, userId);
            res.status(200).json({
                success: true,
                message: 'Member role updated successfully',
                data: member,
            });
        });
        // 멤버 상태 변경
        this.updateMemberStatus = (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const { memberId } = req.params;
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id; // 인증 미들웨어에서 설정된 사용자 ID
            if (!userId) {
                throw new _lib_1.UnauthorizedError('User authentication required');
            }
            // 요청 데이터 검증
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                throw new _lib_1.BadRequestError('Invalid input');
            }
            const member = yield this.memberService.updateMemberStatus(parseInt(memberId), req.body.memberStatus, userId);
            res.status(200).json({
                success: true,
                message: 'Member status updated successfully',
                data: member,
            });
        });
        // 멤버 삭제 (탈퇴)
        this.deleteMember = (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const { memberId } = req.params;
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id; // 인증 미들웨어에서 설정된 사용자 ID
            if (!userId) {
                throw new _lib_1.UnauthorizedError('User authentication required');
            }
            yield this.memberService.deleteMember(parseInt(memberId), userId);
            res.status(200).json({
                success: true,
                message: 'Member deleted successfully',
            });
        });
        // 멤버 강제 제외 (프로젝트 생성자만 가능)
        this.removeMember = (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const { memberId } = req.params;
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id; // 인증 미들웨어에서 설정된 사용자 ID
            if (!userId) {
                throw new _lib_1.UnauthorizedError('User authentication required');
            }
            yield this.memberService.removeMember(parseInt(memberId), userId);
            res.status(200).json({
                success: true,
                message: 'Member removed successfully',
            });
        });
        // 프로젝트에서 유저 제외하기
        this.removeUserFromProject = (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const { projectId, userId } = req.params;
            const requesterId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id; // 인증 미들웨어에서 설정된 사용자 ID
            if (!requesterId) {
                throw new _lib_1.UnauthorizedError('User authentication required');
            }
            yield this.memberService.removeUserFromProject(parseInt(projectId), parseInt(userId), requesterId);
            res.status(200).json({
                success: true,
                message: 'User removed from project successfully',
            });
        });
        this.memberService = memberService || new _services_1.MemberService();
    }
}
exports.MemberController = MemberController;
