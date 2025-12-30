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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MemberService = void 0;
const member_repository_1 = require("../repositories/member.repository");
const invitation_repository_1 = require("../repositories/invitation.repository");
const prisma_1 = __importDefault(require("../lib/prisma"));
const member_error_1 = require("../lib/errors/member.error");
class MemberService {
    constructor() {
        this.memberRepository = new member_repository_1.MemberRepository();
        this.invitationRepository = new invitation_repository_1.InvitationRepository();
    }
    // 프로젝트 멤버 목록 조회
    getMembersByProjectId(projectId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            // 프로젝트 존재 여부 확인
            const projectExists = yield this.memberRepository.projectExists(projectId);
            if (!projectExists) {
                throw new member_error_1.ProjectNotFoundError(projectId);
            }
            // 프로젝트 소유자이거나 멤버인지 확인
            const isOwner = yield this.memberRepository.isProjectOwner(projectId, userId);
            const isMember = yield this.memberRepository.isProjectMember(projectId, userId);
            if (!isOwner && !isMember) {
                throw new member_error_1.MemberUnauthorizedError('You must be a project member to view members');
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
                throw new member_error_1.MemberNotFoundError(memberId);
            }
            // 프로젝트 소유자만 역할 변경 가능
            const isOwner = yield this.memberRepository.isProjectOwner(member.projectId, userId);
            if (!isOwner) {
                throw new member_error_1.MemberUnauthorizedError('Only project owner can change member roles');
            }
            // 자신의 역할을 변경하려는 경우
            if (member.userId === userId && role === 'MEMBER') {
                const ownerCount = yield this.memberRepository.countOwners(member.projectId);
                if (ownerCount <= 1) {
                    throw new member_error_1.MemberUnauthorizedError('Project must have at least one owner');
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
                throw new member_error_1.MemberNotFoundError(memberId);
            }
            // 자신의 상태만 변경 가능하거나, 프로젝트 소유자가 변경 가능
            const isOwner = yield this.memberRepository.isProjectOwner(member.projectId, userId);
            const isSelf = member.userId === userId;
            if (!isOwner && !isSelf) {
                throw new member_error_1.MemberUnauthorizedError('You can only update your own member status');
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
                throw new member_error_1.MemberNotFoundError(memberId);
            }
            // 자신만 탈퇴 가능
            if (member.userId !== userId) {
                throw new member_error_1.MemberUnauthorizedError('You can only leave the project yourself');
            }
            // 프로젝트 소유자는 탈퇴 불가
            if (member.role === 'OWNER') {
                const ownerCount = yield this.memberRepository.countOwners(member.projectId);
                if (ownerCount <= 1) {
                    throw new member_error_1.OwnerCannotLeaveError('Project owner cannot leave the project');
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
                throw new member_error_1.MemberNotFoundError(memberId);
            }
            // 프로젝트 소유자만 멤버 제외 가능
            const isOwner = yield this.memberRepository.isProjectOwner(member.projectId, userId);
            if (!isOwner) {
                throw new member_error_1.MemberUnauthorizedError('Only project owner can remove members');
            }
            // 자신을 제외할 수 없음 (탈퇴는 deleteMember 사용)
            if (member.userId === userId) {
                throw new member_error_1.MemberUnauthorizedError('You cannot remove yourself. Use leave project instead.');
            }
            // 프로젝트 소유자를 제외할 수 없음
            if (member.role === 'OWNER') {
                const ownerCount = yield this.memberRepository.countOwners(member.projectId);
                if (ownerCount <= 1) {
                    throw new member_error_1.MemberUnauthorizedError('Cannot remove the only owner of the project');
                }
            }
            return yield this.memberRepository.softDelete(memberId);
        });
    }
    // 초대 생성
    createInvitation(projectId, hostId, guestEmail) {
        return __awaiter(this, void 0, void 0, function* () {
            // 프로젝트 존재 여부 확인
            const projectExists = yield this.memberRepository.projectExists(projectId);
            if (!projectExists) {
                throw new member_error_1.ProjectNotFoundError(projectId);
            }
            // 프로젝트 소유자만 초대 가능
            const isOwner = yield this.memberRepository.isProjectOwner(projectId, hostId);
            if (!isOwner) {
                throw new member_error_1.MemberUnauthorizedError('Only project owner can invite members');
            }
            // 이메일로 사용자 조회
            const guest = yield this.invitationRepository.findUserByEmail(guestEmail);
            if (!guest) {
                throw new member_error_1.UserNotFoundError(guestEmail);
            }
            // 자신을 초대할 수 없음
            if (guest.id === hostId) {
                throw new member_error_1.MemberUnauthorizedError('You cannot invite yourself');
            }
            // 이미 프로젝트 멤버인지 확인
            const existingMember = yield this.memberRepository.findByProjectAndUser(projectId, guest.id);
            if (existingMember) {
                throw new member_error_1.MemberAlreadyExistsError('User is already a member of this project');
            }
            // 이미 PENDING 상태의 초대가 있는지 확인
            const existingInvitation = yield this.invitationRepository.findByProjectAndGuest(projectId, guest.id);
            if (existingInvitation) {
                throw new member_error_1.InvitationAlreadyExistsError('Invitation already exists for this user and project');
            }
            // 초대 생성
            return yield this.invitationRepository.create({
                projectId,
                hostId,
                guestId: guest.id,
                invitationStatus: 'PENDING',
            });
        });
    }
    // 초대 수락 (초대 링크 접속 시)
    acceptInvitation(invitationId, guestId) {
        return __awaiter(this, void 0, void 0, function* () {
            // 초대 존재 여부 확인
            const invitation = yield this.invitationRepository.findById(invitationId);
            if (!invitation) {
                throw new member_error_1.InvitationNotFoundError(invitationId);
            }
            // 초대받은 사용자인지 확인
            if (invitation.guestId !== guestId) {
                throw new member_error_1.MemberUnauthorizedError('You are not authorized to accept this invitation');
            }
            // 이미 수락된 초대인지 확인
            if (invitation.invitationStatus === 'ACCEPTED') {
                throw new member_error_1.InvitationAlreadyAcceptedError('Invitation has already been accepted');
            }
            // 취소된 초대인지 확인
            if (invitation.invitationStatus === 'CANCELED') {
                throw new member_error_1.InvitationAlreadyCanceledError('Invitation has been canceled');
            }
            // 이미 프로젝트 멤버인지 확인
            const existingMember = yield this.memberRepository.findByProjectAndUser(invitation.projectId, guestId);
            if (existingMember) {
                throw new member_error_1.MemberAlreadyExistsError('User is already a member of this project');
            }
            // 트랜잭션으로 초대 수락 및 멤버 생성
            const result = yield prisma_1.default.$transaction((tx) => __awaiter(this, void 0, void 0, function* () {
                // 초대 상태를 ACCEPTED로 변경
                const updatedInvitation = yield tx.invitation.update({
                    where: { id: invitationId },
                    data: { invitationStatus: 'ACCEPTED' },
                    include: {
                        host: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                                profileImage: true,
                            },
                        },
                        guest: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                                profileImage: true,
                            },
                        },
                        project: {
                            select: {
                                id: true,
                                name: true,
                                description: true,
                            },
                        },
                    },
                });
                // 프로젝트 멤버 생성 (초대 수락 시 바로 참여 가능하도록 ACCEPTED 상태로 생성)
                yield tx.projectMember.create({
                    data: {
                        projectId: invitation.projectId,
                        userId: guestId,
                        role: 'MEMBER',
                        memberStatus: 'ACCEPTED',
                        invitationId: invitationId,
                    },
                });
                return updatedInvitation;
            }));
            return result;
        });
    }
    // 초대 취소 (프로젝트 소유자만 가능)
    cancelInvitation(invitationId, hostId) {
        return __awaiter(this, void 0, void 0, function* () {
            // 초대 존재 여부 확인
            const invitation = yield this.invitationRepository.findById(invitationId);
            if (!invitation) {
                throw new member_error_1.InvitationNotFoundError(invitationId);
            }
            // 프로젝트 소유자인지 확인
            const isOwner = yield this.memberRepository.isProjectOwner(invitation.projectId, hostId);
            if (!isOwner) {
                throw new member_error_1.MemberUnauthorizedError('Only project owner can cancel invitations');
            }
            // 이미 수락된 초대는 취소 불가
            if (invitation.invitationStatus === 'ACCEPTED') {
                throw new member_error_1.InvitationAlreadyAcceptedError('Cannot cancel an accepted invitation');
            }
            // 이미 취소된 초대인지 확인
            if (invitation.invitationStatus === 'CANCELED') {
                throw new member_error_1.InvitationAlreadyCanceledError('Invitation has already been canceled');
            }
            // 초대 취소
            return yield this.invitationRepository.updateStatus(invitationId, 'CANCELED');
        });
    }
    // 프로젝트의 초대 목록 조회
    getInvitationsByProjectId(projectId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            // 프로젝트 존재 여부 확인
            const projectExists = yield this.memberRepository.projectExists(projectId);
            if (!projectExists) {
                throw new member_error_1.ProjectNotFoundError(projectId);
            }
            // 프로젝트 소유자만 초대 목록 조회 가능
            const isOwner = yield this.memberRepository.isProjectOwner(projectId, userId);
            if (!isOwner) {
                throw new member_error_1.MemberUnauthorizedError('Only project owner can view invitations');
            }
            return yield this.invitationRepository.findByProjectId(projectId);
        });
    }
}
exports.MemberService = MemberService;
