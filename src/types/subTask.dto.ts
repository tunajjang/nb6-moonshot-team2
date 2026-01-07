export interface SubTaskDto {
  id: number;
  taskId: number;
  title: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'DONE';
}
