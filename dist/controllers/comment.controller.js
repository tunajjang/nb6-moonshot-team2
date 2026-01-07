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
exports.CommentController = void 0;
const express_validator_1 = require("express-validator");
const _services_1 = require("@services");
const _lib_1 = require("@lib");
class CommentController {
    constructor() {
        // 댓글 생성
        this.createComment = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const { taskId } = req.params;
                const authorId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id; // 인증 미들웨어에서 설정된 사용자 ID
                if (!authorId) {
                    throw new _lib_1.UnauthorizedError('User authentication required');
                }
                // 요청 데이터 검증
                const errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    throw new _lib_1.BadRequestError('Invalid input');
                }
                const comment = yield this.commentService.createComment(req.body.content, parseInt(taskId), authorId);
                res.status(201).json({
                    success: true,
                    message: 'Comment created successfully',
                    data: comment,
                });
            }
            catch (err) {
                next(err);
            }
        });
        // 특정 태스크의 댓글 목록 조회
        this.getCommentsByTaskId = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { taskId } = req.params;
                const comments = yield this.commentService.getCommentsByTaskId(parseInt(taskId));
                res.status(200).json({
                    success: true,
                    message: 'Comments retrieved successfully',
                    data: comments,
                });
            }
            catch (err) {
                next(err);
            }
        });
        // 댓글 수정
        this.updateComment = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const { commentId } = req.params;
                const authorId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id; // 인증 미들웨어에서 설정된 사용자 ID
                if (!authorId) {
                    throw new _lib_1.UnauthorizedError('User authentication required');
                }
                // 요청 데이터 검증
                const errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    throw new _lib_1.BadRequestError('Invalid input');
                }
                const comment = yield this.commentService.updateComment(parseInt(commentId), req.body.content, authorId);
                res.status(200).json({
                    success: true,
                    message: 'Comment updated successfully',
                    data: comment,
                });
            }
            catch (err) {
                next(err);
            }
        });
        // 댓글 삭제
        this.deleteComment = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const { commentId } = req.params;
                const authorId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id; // 인증 미들웨어에서 설정된 사용자 ID
                if (!authorId) {
                    throw new _lib_1.UnauthorizedError('User authentication required');
                }
                yield this.commentService.deleteComment(parseInt(commentId), authorId);
                res.status(200).json({
                    success: true,
                    message: 'Comment deleted successfully',
                });
            }
            catch (err) {
                next(err);
            }
        });
        this.commentService = new _services_1.CommentService();
    }
}
exports.CommentController = CommentController;
