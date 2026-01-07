import * as s from 'superstruct';
import { PageParamsStrict } from './common.structs';

const TaskStatusStruct = s.enums(['PENDING', 'IN_PROGRESS', 'DONE']);

export const GetTaskListParamsStruct = PageParamsStrict;

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
