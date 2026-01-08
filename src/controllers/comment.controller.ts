import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { CommentService } from '@services';
import { UnauthorizedError, BadRequestError } from '@lib';

export class CommentController {
  private commentService: CommentService;

  constructor(commentService: CommentService) {
    this.commentService = new CommentService();
  }

  // 댓글 생성
  createComment = async (req: Request, res: Response) => {
    const { taskId } = req.params;
    const authorId = req.user?.id; // 인증 미들웨어에서 설정된 사용자 ID
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
    // 요구사항에 맞는 응답 형식으로 변환 (authorId, deletedAt 제외)
    const { authorId: _, deletedAt: __, ...responseData } = comment as any;
    res.status(200).json({
      id: responseData.id,
      content: responseData.content,
      taskId: responseData.taskId,
      author: responseData.author,
      createdAt: responseData.createdAt,
      updatedAt: responseData.updatedAt,
    });
  };

  // 특정 태스크의 댓글 목록 조회
  getCommentsByTaskId = async (req: Request, res: Response) => {
    const { taskId } = req.params;
    const comments = await this.commentService.getCommentsByTaskId(parseInt(taskId));
    // 요구사항에 맞는 응답 형식으로 변환 (authorId, deletedAt 제외)
    const formattedComments = comments.map((comment: any) => ({
      id: comment.id,
      content: comment.content,
      taskId: comment.taskId,
      author: comment.author,
      createdAt: comment.createdAt,
      updatedAt: comment.updatedAt,
    }));
    res.status(200).json({
      data: formattedComments,
      total: formattedComments.length,
    });
  };

  // 댓글 수정
  updateComment = async (req: Request, res: Response) => {
    const { commentId } = req.params;
    const authorId = req.user?.id; // 인증 미들웨어에서 설정된 사용자 ID
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
  };

  // 댓글 삭제
  deleteComment = async (req: Request, res: Response) => {
    const { commentId } = req.params;
    const authorId = req.user?.id; // 인증 미들웨어에서 설정된 사용자 ID
    if (!authorId) {
      throw new UnauthorizedError('User authentication required');
    }
    await this.commentService.deleteComment(parseInt(commentId), authorId);
    res.status(200).json({
      success: true,
      message: 'Comment deleted successfully',
    });
  };
}
