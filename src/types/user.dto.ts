export interface UpdateUserRequest {
  email?: string;
  name?: string;
  currentPassword: string; // 필수
  newPassword?: string; // 선택
  profileImage?: string | null;
}

export interface GetMyProjectsQuery {
  page: number;
  limit: number;
  order: 'asc' | 'desc';
  order_by: 'created_at' | 'name';
}
