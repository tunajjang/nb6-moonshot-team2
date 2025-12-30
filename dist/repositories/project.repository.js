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
    countProjectsByUserId(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.prisma.project.count({
                where: {
                    ownerId: userId,
                    deletedAt: null,
                },
            });
        });
    }
    // 프로젝트 생성 (트랜잭션 포함: 프로젝트 생성 + 멤버 추가)
    createProject(userId, name, description) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.prisma.project.create({
                data: {
                    ownerId: userId,
                    name,
                    description,
                    // Nested Write: 프로젝트를 만들면서 동시에 멤버 테이블에도 데이터 넣기
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
    // 프로젝트 목록 조회 (Soft Delete)
    getMyProjects(userId, sort) {
        return __awaiter(this, void 0, void 0, function* () {
            const orderBy = sort === 'latest' ? { createdAt: 'desc' } : { name: 'asc' };
            return this.prisma.project.findMany({
                where: {
                    projectMembers: {
                        some: { userId, deletedAt: null },
                    },
                    deletedAt: null,
                },
                include: {
                    _count: {
                        select: { projectMembers: { where: { deletedAt: null } } },
                    },
                    tasks: {
                        where: { deletedAt: null },
                        select: { status: true },
                    },
                },
                orderBy,
            });
        });
    }
    // 유저 존재 여부 확인
    findUserById(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.prisma.user.findFirst({
                where: { id: userId, deletedAt: null },
            });
        });
    }
    // 프로젝트 상세 조회
    getProjectDetail(projectId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.prisma.project.findFirst({
                where: {
                    id: projectId,
                    deletedAt: null,
                },
                include: {
                    _count: {
                        select: { projectMembers: { where: { deletedAt: null } } },
                    },
                    tasks: {
                        where: { deletedAt: null },
                        select: { status: true },
                    },
                },
            });
        });
    }
    // 프로젝트 ID로 조회 (수정 시 존재 확인용)
    findProjectById(projectId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.prisma.project.findFirst({
                where: { id: projectId, deletedAt: null },
            });
        });
    }
    // 프로젝트 수정
    updateProject(projectId, projectData) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.prisma.project.update({
                where: { id: projectId },
                data: projectData,
            });
        });
    }
    // 프로젝트 삭제
    deleteProject(projectId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.prisma.project.update({
                where: { id: projectId },
                data: {
                    deletedAt: new Date(),
                },
            });
        });
    }
}
exports.ProjectRepository = ProjectRepository;
