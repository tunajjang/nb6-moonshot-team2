import { Request, Response, NextFunction } from 'express';
import { CommentService } from '../services/comment.service';
import { validationResult } from 'express-validator';
import { UnauthorizedError, BadRequestError } from '../lib/errors/app.error';

export class CommentController {
  private commentService: CommentService;

  constructor() {
    this.commentService = new CommentService();
  }

  // 댓글 생성
  createComment = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { taskId } = req.params;
      const authorId = (req as any).user?.id; // 인증 미들웨어에서 설정된 사용자 ID

      if (!authorId) {
        throw new UnauthorizedError('User authentication required');
      }

      // 요청 데이터 검증
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw new BadRequestError('Invalid input');
      }

      const comment = await this.commentService.createComment(
        req.body.content,
        parseInt(taskId),
        authorId,
      );

      res.status(201).json({
        success: true,
        message: 'Comment created successfully',
        data: comment,
      });
    } catch (err) {
      next(err);
    }
  };

  // 특정 태스크의 댓글 목록 조회
  getCommentsByTaskId = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { taskId } = req.params;

      const comments = await this.commentService.getCommentsByTaskId(parseInt(taskId));

      res.status(200).json({
        success: true,
        message: 'Comments retrieved successfully',
        data: comments,
      });
    } catch (err) {
      next(err);
    }
  };

  // 댓글 수정
  updateComment = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { commentId } = req.params;
      const authorId = (req as any).user?.id; // 인증 미들웨어에서 설정된 사용자 ID

      if (!authorId) {
        throw new UnauthorizedError('User authentication required');
      }

      // 요청 데이터 검증
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw new BadRequestError('Invalid input');
      }

      const comment = await this.commentService.updateComment(
        parseInt(commentId),
        req.body.content,
        authorId,
      );

      res.status(200).json({
        success: true,
        message: 'Comment updated successfully',
        data: comment,
      });
    } catch (err) {
      next(err);
    }
  };

  // 댓글 삭제
  deleteComment = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { commentId } = req.params;
      const authorId = (req as any).user?.id; // 인증 미들웨어에서 설정된 사용자 ID

      if (!authorId) {
        throw new UnauthorizedError('User authentication required');
      }

      await this.commentService.deleteComment(parseInt(commentId), authorId);

      res.status(200).json({
        success: true,
        message: 'Comment deleted successfully',
      });
    } catch (err) {
      next(err);
    }
  };
}
