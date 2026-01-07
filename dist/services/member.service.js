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
exports.MemberService = void 0;
const _repositories_1 = require("@repositories");
const _lib_1 = require("@lib");
class MemberService {
    constructor() {
        this.memberRepository = new _repositories_1.MemberRepository();
    }
    // 프로젝트 멤버 목록 조회
    getMembersByProjectId(projectId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            // 프로젝트 존재 여부 확인
            const projectExists = yield this.memberRepository.projectExists(projectId);
            if (!projectExists) {
                throw new _lib_1.ProjectNotFoundError(projectId);
            }
            // 프로젝트 소유자이거나 멤버인지 확인
            const isOwner = yield this.memberRepository.isProjectOwner(projectId, userId);
            const isMember = yield this.memberRepository.isProjectMember(projectId, userId);
            if (!isOwner && !isMember) {
                throw new _lib_1.MemberUnauthorizedError('You must be a project member to view members');
            }
            return yield this.memberRepository.findByProjectId(projectId);
        });
    }
    // 멤버 역할 변경
    updateMemberRole(memberId, role, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            // 멤버 존재 여부 확인
            const member = yield this.memberRepository.findById(memberId);
            if (!member) {
                throw new _lib_1.MemberNotFoundError(memberId);
            }
            // 프로젝트 소유자만 역할 변경 가능
            const isOwner = yield this.memberRepository.isProjectOwner(member.projectId, userId);
            if (!isOwner) {
                throw new _lib_1.MemberUnauthorizedError('Only project owner can change member roles');
            }
            // 자신의 역할을 변경하려는 경우
            if (member.userId === userId && role === 'MEMBER') {
                const ownerCount = yield this.memberRepository.countOwners(member.projectId);
                if (ownerCount <= 1) {
                    throw new _lib_1.MemberUnauthorizedError('Project must have at least one owner');
                }
            }
            return yield this.memberRepository.updateRole(memberId, role);
        });
    }
    // 멤버 상태 변경 (PENDING -> ACCEPTED)
    updateMemberStatus(memberId, memberStatus, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            // 멤버 존재 여부 확인
            const member = yield this.memberRepository.findById(memberId);
            if (!member) {
                throw new _lib_1.MemberNotFoundError(memberId);
            }
            // 자신의 상태만 변경 가능하거나, 프로젝트 소유자가 변경 가능
            const isOwner = yield this.memberRepository.isProjectOwner(member.projectId, userId);
            const isSelf = member.userId === userId;
            if (!isOwner && !isSelf) {
                throw new _lib_1.MemberUnauthorizedError('You can only update your own member status');
            }
            return yield this.memberRepository.updateStatus(memberId, memberStatus);
        });
    }
    // 멤버 삭제 (탈퇴)
    deleteMember(memberId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            // 멤버 존재 여부 확인
            const member = yield this.memberRepository.findById(memberId);
            if (!member) {
                throw new _lib_1.MemberNotFoundError(memberId);
            }
            // 자신만 탈퇴 가능
            if (member.userId !== userId) {
                throw new _lib_1.MemberUnauthorizedError('You can only leave the project yourself');
            }
            // 프로젝트 소유자는 탈퇴 불가
            if (member.role === 'OWNER') {
                const ownerCount = yield this.memberRepository.countOwners(member.projectId);
                if (ownerCount <= 1) {
                    throw new _lib_1.OwnerCannotLeaveError('Project owner cannot leave the project');
                }
            }
            return yield this.memberRepository.softDelete(memberId);
        });
    }
    // 멤버 강제 제외 (프로젝트 생성자만 가능)
    removeMember(memberId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            // 멤버 존재 여부 확인
            const member = yield this.memberRepository.findById(memberId);
            if (!member) {
                throw new _lib_1.MemberNotFoundError(memberId);
            }
            // 프로젝트 소유자만 멤버 제외 가능
            const isOwner = yield this.memberRepository.isProjectOwner(member.projectId, userId);
            if (!isOwner) {
                throw new _lib_1.MemberUnauthorizedError('Only project owner can remove members');
            }
            // 자신을 제외할 수 없음 (탈퇴는 deleteMember 사용)
            if (member.userId === userId) {
                throw new _lib_1.MemberUnauthorizedError('You cannot remove yourself. Use leave project instead.');
            }
            // 프로젝트 소유자를 제외할 수 없음
            if (member.role === 'OWNER') {
                const ownerCount = yield this.memberRepository.countOwners(member.projectId);
                if (ownerCount <= 1) {
                    throw new _lib_1.MemberUnauthorizedError('Cannot remove the only owner of the project');
                }
            }
            return yield this.memberRepository.softDelete(memberId);
        });
    }
    // 프로젝트에서 유저 제외하기 (userId로)
    removeUserFromProject(projectId, userId, requesterId) {
        return __awaiter(this, void 0, void 0, function* () {
            // 프로젝트 존재 여부 확인
            const projectExists = yield this.memberRepository.projectExists(projectId);
            if (!projectExists) {
                throw new _lib_1.ProjectNotFoundError(projectId);
            }
            // 프로젝트 소유자만 멤버 제외 가능
            const isOwner = yield this.memberRepository.isProjectOwner(projectId, requesterId);
            if (!isOwner) {
                throw new _lib_1.MemberUnauthorizedError('Only project owner can remove members');
            }
            // 제외할 멤버 조회
            const member = yield this.memberRepository.findByProjectAndUser(projectId, userId);
            if (!member) {
                throw new _lib_1.MemberNotFoundError(0); // userId로 찾은 멤버가 없음
            }
            // 자신을 제외할 수 없음
            if (member.userId === requesterId) {
                throw new _lib_1.MemberUnauthorizedError('You cannot remove yourself. Use leave project instead.');
            }
            // 프로젝트 소유자를 제외할 수 없음
            if (member.role === 'OWNER') {
                const ownerCount = yield this.memberRepository.countOwners(projectId);
                if (ownerCount <= 1) {
                    throw new _lib_1.MemberUnauthorizedError('Cannot remove the only owner of the project');
                }
            }
            return yield this.memberRepository.softDelete(member.id);
        });
    }
    /**
     * 할 일 담당자 지정 시 프로젝트 멤버인지 검증
     * @param projectId 프로젝트 ID
     * @param assigneeId 담당자로 지정할 사용자 ID
     * @throws BadRequestError 담당자가 프로젝트 멤버가 아닌 경우
     */
    validateAssignee(projectId, assigneeId) {
        return __awaiter(this, void 0, void 0, function* () {
            // 프로젝트 존재 여부 확인
            const projectExists = yield this.memberRepository.projectExists(projectId);
            if (!projectExists) {
                throw new _lib_1.ProjectNotFoundError(projectId);
            }
            // 담당자가 프로젝트 멤버인지 확인 (ACCEPTED 상태이고 삭제되지 않은 멤버만)
            const isMember = yield this.memberRepository.isProjectMember(projectId, assigneeId);
            if (!isMember) {
                throw new _lib_1.MemberUnauthorizedError('담당자는 해당 프로젝트에 참여하는 멤버여야 합니다.');
            }
        });
    }
}
exports.MemberService = MemberService;
