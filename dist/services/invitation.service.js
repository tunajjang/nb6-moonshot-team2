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
exports.InvitationService = void 0;
const _repositories_1 = require("@repositories");
const _lib_1 = require("@lib");
const mail_service_1 = require("./mail.service");
class InvitationService {
    constructor() {
        this.memberRepository = new _repositories_1.MemberRepository();
        this.invitationRepository = new _repositories_1.InvitationRepository();
        this.mailService = new mail_service_1.MailService();
    }
    // 초대 생성
    createInvitation(projectId, hostId, guestEmail) {
        return __awaiter(this, void 0, void 0, function* () {
            // 프로젝트 존재 여부 확인
            const projectExists = yield this.memberRepository.projectExists(projectId);
            if (!projectExists) {
                throw new _lib_1.ProjectNotFoundError(projectId);
            }
            // 프로젝트 소유자만 초대 가능
            const isOwner = yield this.memberRepository.isProjectOwner(projectId, hostId);
            if (!isOwner) {
                throw new _lib_1.MemberUnauthorizedError('Only project owner can invite members');
            }
            // 이메일로 사용자 조회
            const guest = yield this.invitationRepository.findUserByEmail(guestEmail);
            if (!guest) {
                throw new _lib_1.UserNotFoundError(guestEmail);
            }
            // 자신을 초대할 수 없음
            if (guest.id === hostId) {
                throw new _lib_1.MemberUnauthorizedError('You cannot invite yourself');
            }
            // 이미 프로젝트 멤버인지 확인
            const existingMember = yield this.memberRepository.findByProjectAndUser(projectId, guest.id);
            if (existingMember) {
                throw new _lib_1.MemberAlreadyExistsError('User is already a member of this project');
            }
            // 이미 PENDING 상태의 초대가 있는지 확인
            const existingInvitation = yield this.invitationRepository.findByProjectAndGuest(projectId, guest.id);
            if (existingInvitation) {
                throw new _lib_1.InvitationAlreadyExistsError('Invitation already exists for this user and project');
            }
            // 초대 생성
            const invitation = yield this.invitationRepository.create({
                project: { connect: { id: projectId } },
                host: { connect: { id: hostId } },
                guest: { connect: { id: guest.id } },
                invitationStatus: 'PENDING',
            });
            // 초대 링크 생성
            const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
            const invitationLink = `${frontendUrl}/invitations/${invitation.id}/accept`;
            // 이메일 발송 (비동기, 에러가 발생해도 초대는 생성되었으므로 로깅만 하고 계속 진행)
            this.mailService
                .sendInvitationEmail({
                to: guestEmail,
                projectName: invitation.project.name,
                hostName: invitation.host.name,
                invitationLink,
            })
                .catch((error) => {
                console.error('초대 이메일 발송 실패 (초대는 생성됨):', error);
                // 이메일 발송 실패해도 초대는 이미 생성되었으므로 에러를 던지지 않음
            });
            return invitation;
        });
    }
    // 초대 수락 (초대 링크 접속 시)
    acceptInvitation(invitationId, guestId) {
        return __awaiter(this, void 0, void 0, function* () {
            // 초대 존재 여부 확인
            const invitation = yield this.invitationRepository.findById(invitationId);
            if (!invitation) {
                throw new _lib_1.InvitationNotFoundError(invitationId);
            }
            // 초대받은 사용자인지 확인
            if (invitation.guestId !== guestId) {
                throw new _lib_1.MemberUnauthorizedError('You are not authorized to accept this invitation');
            }
            // 이미 수락된 초대인지 확인
            if (invitation.invitationStatus === 'ACCEPTED') {
                throw new _lib_1.InvitationAlreadyAcceptedError('Invitation has already been accepted');
            }
            // 취소된 초대인지 확인
            if (invitation.invitationStatus === 'CANCELED') {
                throw new _lib_1.InvitationAlreadyCanceledError('Invitation has been canceled');
            }
            // 이미 프로젝트 멤버인지 확인
            const existingMember = yield this.memberRepository.findByProjectAndUser(invitation.projectId, guestId);
            if (existingMember) {
                throw new _lib_1.MemberAlreadyExistsError('User is already a member of this project');
            }
            // 트랜잭션으로 초대 수락 및 멤버 생성
            const result = yield _lib_1.prisma.$transaction((tx) => __awaiter(this, void 0, void 0, function* () {
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
                throw new _lib_1.InvitationNotFoundError(invitationId);
            }
            // 프로젝트 소유자인지 확인
            const isOwner = yield this.memberRepository.isProjectOwner(invitation.projectId, hostId);
            if (!isOwner) {
                throw new _lib_1.MemberUnauthorizedError('Only project owner can cancel invitations');
            }
            // 이미 수락된 초대는 취소 불가
            if (invitation.invitationStatus === 'ACCEPTED') {
                throw new _lib_1.InvitationAlreadyAcceptedError('Cannot cancel an accepted invitation');
            }
            // 이미 취소된 초대인지 확인
            if (invitation.invitationStatus === 'CANCELED') {
                throw new _lib_1.InvitationAlreadyCanceledError('Invitation has already been canceled');
            }
            // 초대 취소
            return yield this.invitationRepository.updateStatus(invitationId, 'CANCELED');
        });
    }
    // 초대 삭제 (프로젝트 소유자만 가능) - DELETE 메서드용
    deleteInvitation(invitationId, hostId) {
        return __awaiter(this, void 0, void 0, function* () {
            // 초대 존재 여부 확인
            const invitation = yield this.invitationRepository.findById(invitationId);
            if (!invitation) {
                throw new _lib_1.InvitationNotFoundError(invitationId);
            }
            // 프로젝트 소유자인지 확인
            const isOwner = yield this.memberRepository.isProjectOwner(invitation.projectId, hostId);
            if (!isOwner) {
                throw new _lib_1.MemberUnauthorizedError('Only project owner can delete invitations');
            }
            // 이미 수락된 초대는 삭제 불가
            if (invitation.invitationStatus === 'ACCEPTED') {
                throw new _lib_1.InvitationAlreadyAcceptedError('Cannot delete an accepted invitation');
            }
            // 이미 취소된 초대인지 확인
            if (invitation.invitationStatus === 'CANCELED') {
                throw new _lib_1.InvitationAlreadyCanceledError('Invitation has already been canceled');
            }
            // 초대 취소
            return yield this.invitationRepository.updateStatus(invitationId, 'CANCELED');
        });
    }
    // 초대 정보 조회 (링크 접속 시 사용)
    getInvitationById(invitationId) {
        return __awaiter(this, void 0, void 0, function* () {
            const invitation = yield this.invitationRepository.findById(invitationId);
            if (!invitation) {
                throw new _lib_1.InvitationNotFoundError(invitationId);
            }
            return invitation;
        });
    }
    // 프로젝트의 초대 목록 조회
    getInvitationsByProjectId(projectId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            // 프로젝트 존재 여부 확인
            const projectExists = yield this.memberRepository.projectExists(projectId);
            if (!projectExists) {
                throw new _lib_1.ProjectNotFoundError(projectId);
            }
            // 프로젝트 소유자만 초대 목록 조회 가능
            const isOwner = yield this.memberRepository.isProjectOwner(projectId, userId);
            if (!isOwner) {
                throw new _lib_1.MemberUnauthorizedError('Only project owner can view invitations');
            }
            return yield this.invitationRepository.findByProjectId(projectId);
        });
    }
}
exports.InvitationService = InvitationService;
