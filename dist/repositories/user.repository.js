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
exports.UserRepository = void 0;
class UserRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    /**
     * 사용자 정보 조회
     */
    getUserById(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.prisma.user.findFirst({ where: { id: userId, deletedAt: null } });
        });
    }
    /**
     * 사용자 정보 수정
     */
    updateUser(userId, userData) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.prisma.user.update({
                where: { id: userId },
                data: userData,
            });
        });
    }
    /**
     * 사용자 정보 삭제 soft delete
     */
    deleteUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.prisma.user.update({
                where: { id: userId },
                data: {
                    deletedAt: new Date(),
                },
            });
        });
    }
    /**
     * 사용자 목록 조회
     */
    findUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.prisma.user.findMany({ where: { deletedAt: null } });
        });
    }
    /**
     * 이메일로 사용자 조회
     */
    findUserByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.prisma.user.findFirst({
                where: { email, deletedAt: null },
            });
        });
    }
    /**
     * 내가 멤버로 속한 프로젝트 목록 조회
     */
    findProjectsByUserId(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const projects = yield this.prisma.projectMember.findMany({
                where: { userId, deletedAt: null },
                include: { project: true },
                orderBy: { createdAt: 'desc' },
            });
            return projects;
        });
    }
    /**
     * 나에게 할당된 태스크 목록 조회
     */
    findTasksByUserId(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const tasks = yield this.prisma.task.findMany({
                where: { assigneeId: userId, deletedAt: null },
                include: { project: true },
                orderBy: { createdAt: 'desc' },
            });
            return tasks;
        });
    }
}
exports.UserRepository = UserRepository;
