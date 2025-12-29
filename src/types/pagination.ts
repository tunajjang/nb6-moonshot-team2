export interface PaginationParams {
  page: number;
  limit: number;
  status?: 'PENDING' | 'IN_PROGRESS' | 'DONE';
  assigneeId?: number;
  keyword?: string;
  order: 'asc' | 'desc';
  orderBy: 'created_at' | 'name' | 'end_date';
}

/*
Request params
- page: `number`
- limit: `number`
- status: `todo` | `in_progress` | `done` (상태 필터)
- assignee: `number` (담당자 필터)
- keyword: `string` (검색어)
- order:  `asc` | `desc`
- order_by: `created_at` , `name` , `end_date`
*/
