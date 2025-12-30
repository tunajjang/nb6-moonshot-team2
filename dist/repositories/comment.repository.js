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
exports.CommentRepository = void 0;
const prisma_1 = __importDefault(require("../lib/prisma"));
class CommentRepository {
    // 댓글 생성
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma_1.default.comment.create({
                data,
                include: {
                    author: {
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
    // 특정 태스크의 댓글 목록 조회 (삭제되지 않은 댓글만)
    findByTaskId(taskId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma_1.default.comment.findMany({
                where: {
                    taskId,
                    deletedAt: null,
                },
                include: {
                    author: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                            profileImage: true,
                        },
                    },
                },
                orderBy: {
                    createdAt: 'asc',
                },
            });
        });
    }
    // 댓글 ID로 조회
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma_1.default.comment.findFirst({
                where: {
                    id,
                    deletedAt: null,
                },
                include: {
                    author: {
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
    // 댓글 수정
    update(id, content) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma_1.default.comment.update({
                where: { id },
                data: { content },
                include: {
                    author: {
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
    // 댓글 삭제 (soft delete)
    softDelete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma_1.default.comment.update({
                where: { id },
                data: { deletedAt: new Date() },
                include: {
                    author: {
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
    // 태스크 존재 여부 확인
    taskExists(taskId) {
        return __awaiter(this, void 0, void 0, function* () {
            const task = yield prisma_1.default.task.findFirst({
                where: {
                    id: taskId,
                    deletedAt: null,
                },
            });
            return task !== null;
        });
    }
    // 태스크의 프로젝트 ID 조회
    getTaskProjectId(taskId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const task = yield prisma_1.default.task.findFirst({
                where: {
                    id: taskId,
                    deletedAt: null,
                },
                select: {
                    projectId: true,
                },
            });
            return (_a = task === null || task === void 0 ? void 0 : task.projectId) !== null && _a !== void 0 ? _a : null;
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
}
exports.CommentRepository = CommentRepository;
