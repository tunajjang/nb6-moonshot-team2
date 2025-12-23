export interface CreateCommentDto {
  content: string;
}

export interface UpdateCommentDto {
  content: string;
}

export interface CommentResponseDto {
  id: number;
  content: string;
  taskId: number;
  authorId: number;
  author: {
    id: number;
    name: string;
    email: string;
    profileImage: string;
  };
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}
