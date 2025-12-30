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
exports.InvitationRepository = void 0;
const prisma_1 = __importDefault(require("../lib/prisma"));
class InvitationRepository {
    // 초대 생성
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma_1.default.invitation.create({
                data,
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
        });
    }
    // 초대 ID로 조회
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma_1.default.invitation.findUnique({
                where: { id },
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
        });
    }
    // 프로젝트와 게스트로 초대 조회 (PENDING 상태만)
    findByProjectAndGuest(projectId, guestId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma_1.default.invitation.findFirst({
                where: {
                    projectId,
                    guestId,
                    invitationStatus: 'PENDING',
                },
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
        });
    }
    // 프로젝트의 초대 목록 조회
    findByProjectId(projectId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma_1.default.invitation.findMany({
                where: {
                    projectId,
                },
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
                orderBy: {
                    createdAt: 'desc',
                },
            });
        });
    }
    // 초대 상태 변경
    updateStatus(id, invitationStatus) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma_1.default.invitation.update({
                where: { id },
                data: { invitationStatus },
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
        });
    }
    // 이메일로 사용자 조회
    findUserByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma_1.default.user.findUnique({
                where: { email },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    profileImage: true,
                },
            });
        });
    }
    // 프로젝트 멤버 생성 (초대 수락 시)
    createProjectMember(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma_1.default.projectMember.create({
                data,
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                            profileImage: true,
                        },
                    },
                },
            });
        });
    }
}
exports.InvitationRepository = InvitationRepository;
