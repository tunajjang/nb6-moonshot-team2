export interface CreateProjectDto {
  name: string;
  description: string;
}

export interface UpdateProjectDto {
  name?: string;
  description?: string;
}

export interface ProjectDetailDto {
  id: number;
  name: string;
  description: string;
  memberCount: number;
  todoCount: number;
  inProgressCount: number;
  doneCount: number;
}
