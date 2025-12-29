import * as s from 'superstruct';
import { PageParamsStrict } from './common-structs';

const TaskStatusStruct = s.enums(['PENDING', 'IN_PROGRESS', 'DONE']);

export const GetTaskListParamsStruct = PageParamsStrict;

export const CreateTaskBodyStruct = s.object({
  projectId: s.number(),
  title: s.nonempty(s.string()),
  startAt: s.string(),
  endAt: s.string(),
  status: TaskStatusStruct,
  assigneeId: s.number(),
  tagId: s.optional(s.array(s.number())),
  attachmentId: s.optional(s.array(s.number())),
});

export const UpdateTaskBodyStruct = s.partial(CreateTaskBodyStruct);

export type CreateTaskInput = s.Infer<typeof CreateTaskBodyStruct>;
export type UpdateTaskInput = s.Infer<typeof UpdateTaskBodyStruct>;

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
