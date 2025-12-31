import * as s from 'superstruct';

const SubTaskStatusStruct = s.enums(['PENDING', 'IN_PROGRESS', 'DONE']);

export const CreateSubTaskBodyStruct = s.object({
  taskId: s.number(),
  title: s.nonempty(s.string()),
  status: SubTaskStatusStruct,
});

export const UpdateSubTaskBodyStruct = s.partial(CreateSubTaskBodyStruct);

export type CreateSubTaskInput = s.Infer<typeof CreateSubTaskBodyStruct>;
export type UpdateSubTaskInput = s.Infer<typeof UpdateSubTaskBodyStruct>;
