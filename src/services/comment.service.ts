import { CommentRepository } from '../repositories/comment.repository';
import { Comment } from '@prisma/client';
import {
  TaskNotFoundError,
  CommentNotFoundError,
  CommentUnauthorizedError,
  ProjectMemberRequiredError,
} from '../lib/errors/comment.error';

export class CommentService {
  private commentRepository: CommentRepository;

  constructor() {
    this.commentRepository = new CommentRepository();
  }

  // 댓글 생성
  async createComment(content: string, taskId: number, authorId: number): Promise<Comment> {
    // 태스크 존재 여부 확인
    const taskExists = await this.commentRepository.taskExists(taskId);
    if (!taskExists) {
      throw new TaskNotFoundError(taskId);
    }

    // 태스크의 프로젝트 ID 조회
    const projectId = await this.commentRepository.getTaskProjectId(taskId);
    if (!projectId) {
      throw new TaskNotFoundError(taskId);
    }

    // 프로젝트 멤버 여부 확인
    const isMember = await this.commentRepository.isProjectMember(projectId, authorId);
    if (!isMember) {
      throw new ProjectMemberRequiredError('You must be a project member to create comments');
    }

    // 댓글 생성
    return await this.commentRepository.create({
      content,
      taskId,
      authorId,
    });
  }

  // 특정 태스크의 댓글 목록 조회
  async getCommentsByTaskId(taskId: number): Promise<Comment[]> {
    // 태스크 존재 여부 확인
    const taskExists = await this.commentRepository.taskExists(taskId);
    if (!taskExists) {
      throw new TaskNotFoundError(taskId);
    }

    return await this.commentRepository.findByTaskId(taskId);
  }

  // 댓글 수정
  async updateComment(commentId: number, content: string, authorId: number): Promise<Comment> {
    // 댓글 존재 여부 및 작성자 확인
    const comment = await this.commentRepository.findById(commentId);
    if (!comment) {
      throw new CommentNotFoundError(commentId);
    }

    // 작성자 확인
    if (comment.authorId !== authorId) {
      throw new CommentUnauthorizedError('You can only update your own comments');
    }

    return await this.commentRepository.update(commentId, content);
  }

  // 댓글 삭제
  async deleteComment(commentId: number, authorId: number): Promise<Comment> {
    // 댓글 존재 여부 및 작성자 확인
    const comment = await this.commentRepository.findById(commentId);
    if (!comment) {
      throw new CommentNotFoundError(commentId);
    }

    // 작성자 확인
    if (comment.authorId !== authorId) {
      throw new CommentUnauthorizedError('You can only delete your own comments');
    }

    return await this.commentRepository.softDelete(commentId);
  }
}
