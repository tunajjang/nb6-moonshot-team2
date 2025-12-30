import { prisma } from '@lib';
import { Comment } from '@prisma/client';

export class CommentRepository {
  // 댓글 생성
  async create(data: { content: string; taskId: number; authorId: number }): Promise<Comment> {
    return await prisma.comment.create({
      data,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            profileImage: true,
          },
        },
      },
    });
  }

  // 특정 태스크의 댓글 목록 조회 (삭제되지 않은 댓글만)
  async findByTaskId(taskId: number): Promise<Comment[]> {
    return await prisma.comment.findMany({
      where: {
        taskId,
        deletedAt: null,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            profileImage: true,
          },
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
    });
  }

  // 댓글 ID로 조회
  async findById(id: number): Promise<Comment | null> {
    return await prisma.comment.findFirst({
      where: {
        id,
        deletedAt: null,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            profileImage: true,
          },
        },
      },
    });
  }

  // 댓글 수정
  async update(id: number, content: string): Promise<Comment> {
    return await prisma.comment.update({
      where: { id },
      data: { content },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            profileImage: true,
          },
        },
      },
    });
  }

  // 댓글 삭제 (soft delete)
  async softDelete(id: number): Promise<Comment> {
    return await prisma.comment.update({
      where: { id },
      data: { deletedAt: new Date() },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            profileImage: true,
          },
        },
      },
    });
  }

  // 태스크 존재 여부 확인
  async taskExists(taskId: number): Promise<boolean> {
    const task = await prisma.task.findFirst({
      where: {
        id: taskId,
        deletedAt: null,
      },
    });
    return task !== null;
  }

  // 태스크의 프로젝트 ID 조회
  async getTaskProjectId(taskId: number): Promise<number | null> {
    const task = await prisma.task.findFirst({
      where: {
        id: taskId,
        deletedAt: null,
      },
      select: {
        projectId: true,
      },
    });
    return task?.projectId ?? null;
  }

  // 프로젝트 멤버 여부 확인 (ACCEPTED 상태이고 삭제되지 않은 멤버만)
  async isProjectMember(projectId: number, userId: number): Promise<boolean> {
    const projectMember = await prisma.projectMember.findFirst({
      where: {
        projectId,
        userId,
        memberStatus: 'ACCEPTED',
        deletedAt: null,
      },
    });
    return projectMember !== null;
  }
}
