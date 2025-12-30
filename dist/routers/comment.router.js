"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const comment_controller_1 = require("../controllers/comment.controller");
const comment_superstruct_1 = require("../superstructs/comment.superstruct");
const router = (0, express_1.Router)();
const commentController = new comment_controller_1.CommentController();
// 특정 태스크의 댓글 목록 조회
router.get('/tasks/:taskId/comments', commentController.getCommentsByTaskId);
// 댓글 생성
router.post('/tasks/:taskId/comments', ...comment_superstruct_1.CreateCommentSchema, commentController.createComment);
// 댓글 수정
router.put('/comments/:commentId', ...comment_superstruct_1.UpdateCommentSchema, commentController.updateComment);
// 댓글 삭제
router.delete('/comments/:commentId', commentController.deleteComment);
exports.default = router;
