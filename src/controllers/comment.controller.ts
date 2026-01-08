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
      throw new UnauthorizedError('로그인이 필요합니다');
    }
    // 요청 데이터 검증
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new BadRequestError('잘못된 요청 형식');
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
    const userId = req.user?.id; // 인증 미들웨어에서 설정된 사용자 ID
    if (!userId) {
      throw new UnauthorizedError('로그인이 필요합니다');
    }
    // 페이지네이션 파라미터 파싱 (기본값: page=1, limit=10)
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = (page - 1) * limit;

    // limit과 page 유효성 검사
    if (limit <= 0 || page <= 0) {
      throw new BadRequestError('잘못된 요청 형식');
    }

    const { comments, total } = await this.commentService.getCommentsByTaskId(
      parseInt(taskId),
      limit,
      offset,
      userId,
    );
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
      total,
    });
  };

  // 단일 댓글 조회
  getComment = async (req: Request, res: Response) => {
    const { commentId } = req.params;
    const userId = req.user?.id; // 인증 미들웨어에서 설정된 사용자 ID
    if (!userId) {
      throw new UnauthorizedError('로그인이 필요합니다');
    }
    const comment = await this.commentService.getCommentById(parseInt(commentId), userId);
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

  // 댓글 수정
  updateComment = async (req: Request, res: Response) => {
    const { commentId } = req.params;
    const authorId = req.user?.id; // 인증 미들웨어에서 설정된 사용자 ID
    if (!authorId) {
      throw new UnauthorizedError('로그인이 필요합니다');
    }
    // 요청 데이터 검증
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new BadRequestError('잘못된 요청 형식');
    }
    const comment = await this.commentService.updateComment(
      parseInt(commentId),
      req.body.content,
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

  // 댓글 삭제
  deleteComment = async (req: Request, res: Response) => {
    const { commentId } = req.params;
    const authorId = req.user?.id; // 인증 미들웨어에서 설정된 사용자 ID
    if (!authorId) {
      throw new UnauthorizedError('로그인이 필요합니다');
    }
    await this.commentService.deleteComment(parseInt(commentId), authorId);
    // 요구사항에 맞는 응답 형식: 204 No Content (응답 본문 없음)
    res.status(204).send();
  };
}
