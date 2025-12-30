import { Router } from 'express';
import { CommentController } from '@controllers';
import { CreateCommentSchema, UpdateCommentSchema } from '@superstructs';

const router = Router();
const commentController = new CommentController();

// 특정 태스크의 댓글 목록 조회
router.get('/tasks/:taskId/comments', commentController.getCommentsByTaskId);

// 댓글 생성
router.post('/tasks/:taskId/comments', ...CreateCommentSchema, commentController.createComment);

// 댓글 수정
router.put('/comments/:commentId', ...UpdateCommentSchema, commentController.updateComment);

// 댓글 삭제
router.delete('/comments/:commentId', commentController.deleteComment);

export default router;
