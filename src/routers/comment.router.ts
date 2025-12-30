import { Router } from 'express';
import { CommentController } from '@controllers';
import { CreateCommentSchema, UpdateCommentSchema } from '@superstructs';
import { authenticate, asyncHandler } from '@middlewares';

const router = Router();
const commentController = new CommentController();

// 특정 태스크의 댓글 목록 조회 (인증 불필요)
router.get('/tasks/:taskId/comments', asyncHandler(commentController.getCommentsByTaskId));

// 댓글 생성 (인증 필요)
router.post(
  '/tasks/:taskId/comments',
  authenticate,
  ...CreateCommentSchema,
  asyncHandler(commentController.createComment),
);

// 댓글 수정 (인증 필요)
router.put(
  '/comments/:commentId',
  authenticate,
  ...UpdateCommentSchema,
  asyncHandler(commentController.updateComment),
);

// 댓글 삭제 (인증 필요)
router.delete('/comments/:commentId', authenticate, asyncHandler(commentController.deleteComment));

export default router;
