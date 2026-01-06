export interface TaskDto {
  id: number;
  projectId: number;
  title: string;
  startYear: number;
  startMonth: number;
  startDay: number;
  endYear: number;
  endMonth: number;
  endDay: number;
  status: 'TODO' | 'IN_PROGRESS' | 'DONE';
  assigneeId: number;
  tagId?: number[];
  attachmentId?: number[];
}
