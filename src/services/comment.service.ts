import { Comment } from '@prisma/client';
import { CommentRepository } from '@repositories';
import {
  TaskNotFoundError,
  CommentNotFoundError,
  CommentUnauthorizedError,
  ProjectMemberRequiredError,
} from '@lib';

export class CommentService {
  private commentRepository: CommentRepository;

  constructor(commentRepository?: CommentRepository) {
    this.commentRepository = commentRepository || new CommentRepository();
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
      throw new ProjectMemberRequiredError('프로젝트 멤버가 아닙니다');
    }

    // 댓글 생성
    return await this.commentRepository.create({
      content,
      taskId,
      authorId,
    });
  }

  // 특정 태스크의 댓글 목록 조회
  async getCommentsByTaskId(
    taskId: number,
    limit: number,
    offset: number,
    userId: number,
  ): Promise<{ comments: Comment[]; total: number }> {
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
    const isMember = await this.commentRepository.isProjectMember(projectId, userId);
    if (!isMember) {
      throw new ProjectMemberRequiredError('프로젝트 멤버가 아닙니다');
    }

    const [comments, total] = await Promise.all([
      this.commentRepository.findByTaskId(taskId, limit, offset),
      this.commentRepository.countByTaskId(taskId),
    ]);

    return { comments, total };
  }

  // 단일 댓글 조회
  async getCommentById(commentId: number, userId: number): Promise<Comment> {
    const comment = await this.commentRepository.findById(commentId);
    if (!comment) {
      throw new CommentNotFoundError(commentId);
    }

    // 태스크의 프로젝트 ID 조회
    const projectId = await this.commentRepository.getTaskProjectId(comment.taskId);
    if (!projectId) {
      throw new TaskNotFoundError(comment.taskId);
    }

    // 프로젝트 멤버 여부 확인
    const isMember = await this.commentRepository.isProjectMember(projectId, userId);
    if (!isMember) {
      throw new ProjectMemberRequiredError('프로젝트 멤버가 아닙니다');
    }

    return comment;
  }

  // 댓글 수정
  async updateComment(commentId: number, content: string, authorId: number): Promise<Comment> {
    // 댓글 존재 여부 및 작성자 확인
    const comment = await this.commentRepository.findById(commentId);
    if (!comment) {
      throw new CommentNotFoundError(commentId);
    }

    // 태스크의 프로젝트 ID 조회
    const projectId = await this.commentRepository.getTaskProjectId(comment.taskId);
    if (!projectId) {
      throw new TaskNotFoundError(comment.taskId);
    }

    // 프로젝트 멤버 여부 확인
    const isMember = await this.commentRepository.isProjectMember(projectId, authorId);
    if (!isMember) {
      throw new ProjectMemberRequiredError('프로젝트 멤버가 아닙니다');
    }

    // 작성자 확인
    if (comment.authorId !== authorId) {
      throw new CommentUnauthorizedError('자신이 작성한 댓글만 수정할 수 있습니다');
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

    // 태스크의 프로젝트 ID 조회
    const projectId = await this.commentRepository.getTaskProjectId(comment.taskId);
    if (!projectId) {
      throw new TaskNotFoundError(comment.taskId);
    }

    // 프로젝트 멤버 여부 확인
    const isMember = await this.commentRepository.isProjectMember(projectId, authorId);
    if (!isMember) {
      throw new ProjectMemberRequiredError('프로젝트 멤버가 아닙니다');
    }

    // 작성자 확인
    if (comment.authorId !== authorId) {
      throw new CommentUnauthorizedError('자신이 작성한 댓글만 삭제할 수 있습니다');
    }

    return await this.commentRepository.softDelete(commentId);
  }
}
