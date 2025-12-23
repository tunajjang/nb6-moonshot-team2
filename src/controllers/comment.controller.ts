import { Request, Response } from 'express';
import { CommentService } from '../services/comment.service';
import { validationResult } from 'express-validator';

export class CommentController {
  private commentService: CommentService;

  constructor() {
    this.commentService = new CommentService();
  }

  // 댓글 생성
  createComment = async (req: Request, res: Response): Promise<void> => {
    try {
      const { taskId } = req.params;
      const authorId = (req as any).user?.id; // 인증 미들웨어에서 설정된 사용자 ID

      if (!authorId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      // 요청 데이터 검증
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ error: 'Invalid input', details: errors.array() });
        return;
      }

      const comment = await this.commentService.createComment(
        req.body.content,
        parseInt(taskId),
        authorId,
      );

      res.status(201).json({
        message: 'Comment created successfully',
        data: comment,
      });
    } catch (err: any) {
      if (err.message === 'Task not found') {
        res.status(404).json({ error: err.message });
      } else if (err.message.includes('Unauthorized')) {
        res.status(403).json({ error: err.message });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  };

  // 특정 태스크의 댓글 목록 조회
  getCommentsByTaskId = async (req: Request, res: Response): Promise<void> => {
    try {
      const { taskId } = req.params;

      const comments = await this.commentService.getCommentsByTaskId(parseInt(taskId));

      res.status(200).json({
        message: 'Comments retrieved successfully',
        data: comments,
      });
    } catch (err: any) {
      if (err.message === 'Task not found') {
        res.status(404).json({ error: err.message });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  };

  // 댓글 수정
  updateComment = async (req: Request, res: Response): Promise<void> => {
    try {
      const { commentId } = req.params;
      const authorId = (req as any).user?.id; // 인증 미들웨어에서 설정된 사용자 ID

      if (!authorId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      // 요청 데이터 검증
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ error: 'Invalid input', details: errors.array() });
        return;
      }

      const comment = await this.commentService.updateComment(
        parseInt(commentId),
        req.body.content,
        authorId,
      );

      res.status(200).json({
        message: 'Comment updated successfully',
        data: comment,
      });
    } catch (err: any) {
      if (err.message === 'Comment not found') {
        res.status(404).json({ error: err.message });
      } else if (err.message.includes('Unauthorized')) {
        res.status(403).json({ error: err.message });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  };

  // 댓글 삭제
  deleteComment = async (req: Request, res: Response): Promise<void> => {
    try {
      const { commentId } = req.params;
      const authorId = (req as any).user?.id; // 인증 미들웨어에서 설정된 사용자 ID

      if (!authorId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      await this.commentService.deleteComment(parseInt(commentId), authorId);

      res.status(200).json({
        message: 'Comment deleted successfully',
      });
    } catch (err: any) {
      if (err.message === 'Comment not found') {
        res.status(404).json({ error: err.message });
      } else if (err.message.includes('Unauthorized')) {
        res.status(403).json({ error: err.message });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  };
}
