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
exports.CommentService = void 0;
const _repositories_1 = require("@repositories");
const _lib_1 = require("@lib");
class CommentService {
    constructor() {
        this.commentRepository = new _repositories_1.CommentRepository();
    }
    // 댓글 생성
    createComment(content, taskId, authorId) {
        return __awaiter(this, void 0, void 0, function* () {
            // 태스크 존재 여부 확인
            const taskExists = yield this.commentRepository.taskExists(taskId);
            if (!taskExists) {
                throw new _lib_1.TaskNotFoundError(taskId);
            }
            // 태스크의 프로젝트 ID 조회
            const projectId = yield this.commentRepository.getTaskProjectId(taskId);
            if (!projectId) {
                throw new _lib_1.TaskNotFoundError(taskId);
            }
            // 프로젝트 멤버 여부 확인
            const isMember = yield this.commentRepository.isProjectMember(projectId, authorId);
            if (!isMember) {
                throw new _lib_1.ProjectMemberRequiredError('You must be a project member to create comments');
            }
            // 댓글 생성
            return yield this.commentRepository.create({
                content,
                taskId,
                authorId,
            });
        });
    }
    // 특정 태스크의 댓글 목록 조회
    getCommentsByTaskId(taskId) {
        return __awaiter(this, void 0, void 0, function* () {
            // 태스크 존재 여부 확인
            const taskExists = yield this.commentRepository.taskExists(taskId);
            if (!taskExists) {
                throw new _lib_1.TaskNotFoundError(taskId);
            }
            return yield this.commentRepository.findByTaskId(taskId);
        });
    }
    // 댓글 수정
    updateComment(commentId, content, authorId) {
        return __awaiter(this, void 0, void 0, function* () {
            // 댓글 존재 여부 및 작성자 확인
            const comment = yield this.commentRepository.findById(commentId);
            if (!comment) {
                throw new _lib_1.CommentNotFoundError(commentId);
            }
            // 작성자 확인
            if (comment.authorId !== authorId) {
                throw new _lib_1.CommentUnauthorizedError('You can only update your own comments');
            }
            return yield this.commentRepository.update(commentId, content);
        });
    }
    // 댓글 삭제
    deleteComment(commentId, authorId) {
        return __awaiter(this, void 0, void 0, function* () {
            // 댓글 존재 여부 및 작성자 확인
            const comment = yield this.commentRepository.findById(commentId);
            if (!comment) {
                throw new _lib_1.CommentNotFoundError(commentId);
            }
            // 작성자 확인
            if (comment.authorId !== authorId) {
                throw new _lib_1.CommentUnauthorizedError('You can only delete your own comments');
            }
            return yield this.commentRepository.softDelete(commentId);
        });
    }
}
exports.CommentService = CommentService;
