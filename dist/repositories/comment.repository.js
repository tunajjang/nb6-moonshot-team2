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
exports.CommentRepository = void 0;
const _lib_1 = require("@lib");
class CommentRepository {
    constructor() {
        // 공통: 작성자 정보 select 필드
        this.authorSelect = {
            id: true,
            name: true,
            email: true,
            profileImage: true,
        };
    }
    // 공통: 작성자 정보를 포함한 include 옵션
    get authorInclude() {
        return {
            author: {
                select: this.authorSelect,
            },
        };
    }
    // 공통: 삭제되지 않은 댓글 조건
    get notDeletedCondition() {
        return { deletedAt: null };
    }
    // 댓글 생성
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield _lib_1.prisma.comment.create({
                data,
                include: this.authorInclude,
            });
        });
    }
    // 특정 태스크의 댓글 목록 조회 (삭제되지 않은 댓글만)
    findByTaskId(taskId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield _lib_1.prisma.comment.findMany({
                where: Object.assign({ taskId }, this.notDeletedCondition),
                include: this.authorInclude,
                orderBy: {
                    createdAt: 'asc',
                },
            });
        });
    }
    // 댓글 ID로 조회
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield _lib_1.prisma.comment.findFirst({
                where: Object.assign({ id }, this.notDeletedCondition),
                include: this.authorInclude,
            });
        });
    }
    // 댓글 수정
    update(id, content) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield _lib_1.prisma.comment.update({
                where: { id },
                data: { content },
                include: this.authorInclude,
            });
        });
    }
    // 댓글 삭제 (soft delete)
    softDelete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield _lib_1.prisma.comment.update({
                where: { id },
                data: { deletedAt: new Date() },
                include: this.authorInclude,
            });
        });
    }
    // 태스크 존재 여부 확인
    taskExists(taskId) {
        return __awaiter(this, void 0, void 0, function* () {
            const task = yield _lib_1.prisma.task.findFirst({
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
            const task = yield _lib_1.prisma.task.findFirst({
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
            const projectMember = yield _lib_1.prisma.projectMember.findFirst({
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
