import * as s from 'superstruct';

const TaskStatusStruct = s.enums(['PENDING', 'IN_PROGRESS', 'DONE']);
const ParamOrderStruct = s.enums(['asc', 'desc']);
const ParamOrderByStruct = s.enums([`created_at`, `name`, `end_date`]);

export const CreateTaskBodyStruct = s.object({
  projectId: s.number(),
  title: s.nonempty(s.string()),
  startAt: s.date(),
  endAt: s.date(),
  status: TaskStatusStruct,
  assigneeId: s.number(),
  tagId: s.optional(s.array(s.number())),
  attachmentId: s.optional(s.array(s.number())),
});

export const TaskParamsStruct = s.object({
  page: s.defaulted(s.number(), 1),
  limit: s.defaulted(s.number(), 10),
  status: s.optional(TaskStatusStruct),
  order: s.optional(ParamOrderStruct),
  orderBy: s.optional(ParamOrderByStruct),
  assigneeId: s.optional(s.number()),
  keyword: s.optional(s.nonempty(s.string())),
});

export const UpdateTaskBodyStruct = s.partial(CreateTaskBodyStruct);

export type CreateTaskInput = s.Infer<typeof CreateTaskBodyStruct>;
export type UpdateTaskInput = s.Infer<typeof UpdateTaskBodyStruct>;
export type TaskParams = s.Infer<typeof TaskParamsStruct>;

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
