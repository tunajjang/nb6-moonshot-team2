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
exports.InvitationRepository = void 0;
const _lib_1 = require("@lib");
class InvitationRepository {
    constructor() {
        // 공통: 사용자 정보 select 필드
        this.userSelect = {
            id: true,
            name: true,
            email: true,
            profileImage: true,
        };
        // 공통: 프로젝트 정보 select 필드
        this.projectSelect = {
            id: true,
            name: true,
            description: true,
        };
    }
    // 공통: 초대 정보를 포함한 include 옵션 (host, guest, project)
    get invitationInclude() {
        return {
            host: {
                select: this.userSelect,
            },
            guest: {
                select: this.userSelect,
            },
            project: {
                select: this.projectSelect,
            },
        };
    }
    // 공통: 사용자 정보를 포함한 include 옵션
    get userInclude() {
        return {
            user: {
                select: this.userSelect,
            },
        };
    }
    // 초대 생성
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield _lib_1.prisma.invitation.create({
                data,
                include: this.invitationInclude,
            });
        });
    }
    // 초대 ID로 조회
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield _lib_1.prisma.invitation.findUnique({
                where: { id },
                include: this.invitationInclude,
            });
        });
    }
    // 프로젝트와 게스트로 초대 조회 (PENDING 상태만)
    findByProjectAndGuest(projectId, guestId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield _lib_1.prisma.invitation.findFirst({
                where: {
                    projectId,
                    guestId,
                    invitationStatus: 'PENDING',
                },
                include: this.invitationInclude,
            });
        });
    }
    // 프로젝트의 초대 목록 조회
    findByProjectId(projectId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield _lib_1.prisma.invitation.findMany({
                where: {
                    projectId,
                },
                include: this.invitationInclude,
                orderBy: {
                    createdAt: 'desc',
                },
            });
        });
    }
    // 초대 상태 변경
    updateStatus(id, invitationStatus) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield _lib_1.prisma.invitation.update({
                where: { id },
                data: { invitationStatus },
                include: this.invitationInclude,
            });
        });
    }
    // 이메일로 사용자 조회
    findUserByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield _lib_1.prisma.user.findUnique({
                where: { email },
                select: this.userSelect,
            });
        });
    }
    // 프로젝트 멤버 생성 (초대 수락 시)
    createProjectMember(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield _lib_1.prisma.projectMember.create({
                data,
                include: this.userInclude,
            });
        });
    }
}
exports.InvitationRepository = InvitationRepository;
