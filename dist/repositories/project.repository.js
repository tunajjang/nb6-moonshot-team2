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
exports.ProjectRepository = void 0;
const client_1 = require("@prisma/client");
class ProjectRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    // 유저가 가진 프로젝트 개수 조회
    countOwnedProjectsByUserId(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.prisma.project.count({
                where: {
                    ownerId: userId,
                    deletedAt: null,
                },
            });
        });
    }
    // 프로젝트 생성
    createProject(userId, name, description) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.prisma.project.create({
                data: {
                    ownerId: userId,
                    name,
                    description,
                    projectMembers: {
                        create: {
                            userId,
                            role: client_1.ProjectRole.OWNER,
                            memberStatus: client_1.MemberStatus.ACCEPTED,
                        },
                    },
                },
            });
        });
    }
    // 프로젝트 상세 조회
    getProjectDetailData(projectId) {
        return __awaiter(this, void 0, void 0, function* () {
            const project = yield this.prisma.project.findUnique({
                where: {
                    id: projectId,
                    deletedAt: null,
                },
                include: {
                    _count: {
                        select: { projectMembers: { where: { deletedAt: null } } },
                    },
                },
            });
            if (!project)
                return null;
            // 상태별 할 일 개수
            const [todoCount, inProgressCount, doneCount] = yield Promise.all([
                this.prisma.task.count({ where: { projectId, status: 'PENDING', deletedAt: null } }),
                this.prisma.task.count({ where: { projectId, status: 'IN_PROGRESS', deletedAt: null } }),
                this.prisma.task.count({ where: { projectId, status: 'DONE', deletedAt: null } }),
            ]);
            return {
                id: project.id,
                name: project.name,
                description: project.description,
                memberCount: project._count.projectMembers,
                todoCount,
                inProgressCount,
                doneCount,
            };
        });
    }
    // 프로젝트 수정
    updateProject(projectId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.prisma.project.update({
                where: {
                    id: projectId,
                    deletedAt: null,
                },
                data: {
                    name: data.name,
                    description: data.description,
                },
            });
        });
    }
    // 권한 체크용 (이 유저가 멤버인지 확인)
    isMember(projectId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const member = yield this.prisma.projectMember.findFirst({
                where: { projectId, userId, deletedAt: null },
            });
            return !!member;
        });
    }
    // 프로젝트 ID로 조회
    findProjectById(projectId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.prisma.project.findUnique({
                where: {
                    id: projectId,
                    deletedAt: null,
                },
            });
        });
    }
    // 프로젝트 삭제
    deleteProject(projectId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.prisma.$transaction([
                this.prisma.project.update({
                    where: {
                        id: projectId,
                        deletedAt: null,
                    },
                    data: { deletedAt: new Date() },
                }),
                this.prisma.projectMember.updateMany({
                    where: { projectId, deletedAt: null },
                    data: { deletedAt: new Date() },
                }),
                this.prisma.task.updateMany({
                    where: { projectId, deletedAt: null },
                    data: { deletedAt: new Date() },
                }),
            ]);
        });
    }
}
exports.ProjectRepository = ProjectRepository;
