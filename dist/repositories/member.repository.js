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
exports.MemberRepository = void 0;
const prisma_1 = __importDefault(require("../lib/prisma"));
class MemberRepository {
    // 프로젝트 멤버 목록 조회 (삭제되지 않은 멤버만, 초대 정보 포함)
    findByProjectId(projectId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma_1.default.projectMember.findMany({
                where: {
                    projectId,
                    deletedAt: null,
                },
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                            profileImage: true,
                        },
                    },
                    invitation: {
                        select: {
                            id: true,
                            invitationStatus: true,
                            createdAt: true,
                        },
                    },
                },
                orderBy: {
                    createdAt: 'asc',
                },
            });
        });
    }
    // 멤버 ID로 조회
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma_1.default.projectMember.findFirst({
                where: {
                    id,
                    deletedAt: null,
                },
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
    // 프로젝트와 사용자로 멤버 조회
    findByProjectAndUser(projectId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma_1.default.projectMember.findFirst({
                where: {
                    projectId,
                    userId,
                    deletedAt: null,
                },
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
    // 멤버 역할 변경
    updateRole(id, role) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma_1.default.projectMember.update({
                where: { id },
                data: { role },
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
    // 멤버 상태 변경
    updateStatus(id, memberStatus) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma_1.default.projectMember.update({
                where: { id },
                data: { memberStatus },
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
    // 멤버 삭제 (soft delete)
    softDelete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma_1.default.projectMember.update({
                where: { id },
                data: { deletedAt: new Date() },
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
    // 프로젝트 존재 여부 확인
    projectExists(projectId) {
        return __awaiter(this, void 0, void 0, function* () {
            const project = yield prisma_1.default.project.findFirst({
                where: {
                    id: projectId,
                    deletedAt: null,
                },
            });
            return project !== null;
        });
    }
    // 프로젝트 소유자 확인
    isProjectOwner(projectId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const project = yield prisma_1.default.project.findFirst({
                where: {
                    id: projectId,
                    ownerId: userId,
                    deletedAt: null,
                },
            });
            return project !== null;
        });
    }
    // 프로젝트 멤버 여부 확인 (ACCEPTED 상태이고 삭제되지 않은 멤버만)
    isProjectMember(projectId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const projectMember = yield prisma_1.default.projectMember.findFirst({
                where: {
                    projectId,
                    userId,
                    memberStatus: 'ACCEPTED',
                    deletedAt: null,
                },
            });
            return projectMember !== null;
        });
    }
    // 프로젝트의 OWNER 역할 멤버 수 확인
    countOwners(projectId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma_1.default.projectMember.count({
                where: {
                    projectId,
                    role: 'OWNER',
                    deletedAt: null,
                },
            });
        });
    }
}
exports.MemberRepository = MemberRepository;
