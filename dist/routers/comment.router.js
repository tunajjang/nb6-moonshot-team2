"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const comment_controller_1 = require("../controllers/comment.controller");
const comment_superstruct_1 = require("../superstructs/comment.superstruct");
const _middlewares_1 = require("@middlewares");
const router = (0, express_1.Router)();
const commentController = new comment_controller_1.CommentController();
// 특정 태스크의 댓글 목록 조회 (인증 불필요)
router.get('/tasks/:taskId/comments', (0, _middlewares_1.asyncHandler)(commentController.getCommentsByTaskId));
// 댓글 생성 (인증 필요)
router.post('/tasks/:taskId/comments', _middlewares_1.authenticate, ...comment_superstruct_1.CreateCommentSchema, (0, _middlewares_1.asyncHandler)(commentController.createComment));
// 댓글 수정 (인증 필요)
router.put('/comments/:commentId', _middlewares_1.authenticate, ...comment_superstruct_1.UpdateCommentSchema, (0, _middlewares_1.asyncHandler)(commentController.updateComment));
// 댓글 삭제 (인증 필요)
router.delete('/comments/:commentId', _middlewares_1.authenticate, (0, _middlewares_1.asyncHandler)(commentController.deleteComment));
exports.default = router;
