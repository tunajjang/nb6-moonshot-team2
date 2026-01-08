import * as s from 'superstruct';
import { integerString } from './common.structs';

const TaskStatusStruct = s.enums(['PENDING', 'IN_PROGRESS', 'DONE']);

export const GetTaskListParamsStruct = s.object({
  page: s.defaulted(integerString, 1),
  limit: s.defaulted(integerString, 10),
  order_by: s.defaulted(s.enums(['created_at', 'name', 'end_date']), 'created_at'),
  order: s.defaulted(s.enums(['asc', 'desc']), 'desc'),
  keyword: s.optional(s.nonempty(s.string())),
  status: s.optional(s.enums(['todo', 'in_progress', 'done'])),
  assignee: s.optional(integerString),
});

export const CreateTaskBodyStruct = s.object({
  title: s.nonempty(s.string()),
  startYear: s.number(),
  startMonth: s.number(),
  startDay: s.number(),
  endYear: s.number(),
  endMonth: s.number(),
  endDay: s.number(),
  status: TaskStatusStruct,
  assigneeId: s.optional(s.number()),
  tags: s.optional(s.array(s.string())),
  attachments: s.optional(s.array(s.string())),
});

export const UpdateTaskBodyStruct = s.partial(CreateTaskBodyStruct);

// YYYY-MM-DD 형식 검증
const DateString = s.define('DateString', (val) => {
  return typeof val === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(val);
});

export const GetMyTasksQueryStruct = s.object({
  page: s.defaulted(integerString, 1),
  limit: s.defaulted(integerString, 10),
  from: s.optional(DateString),
  to: s.optional(DateString),
  project_id: s.optional(integerString),
  status: s.optional(s.enums(['todo', 'in_progress', 'done'])),
  assignee_id: s.optional(integerString),
  keyword: s.optional(s.string()),
  order: s.defaulted(s.enums(['asc', 'desc']), 'desc'),
  order_by: s.defaulted(s.enums(['created_at', 'name', 'end_date']), 'created_at'),
});

/*
title: string;
    startAt: Date;
    endAt: Date;
    status: $Enums.TaskStatus;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
    id: number;
    projectId: number;
    assigneeId: number;
*/
