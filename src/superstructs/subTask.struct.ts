import * as s from 'superstruct';

const SubTaskStatusStruct = s.enums(['PENDING', 'IN_PROGRESS', 'DONE']);

export const CreateSubTaskBodyStruct = s.object({
  title: s.nonempty(s.string()),
  status: SubTaskStatusStruct,
});

export const UpdateSubTaskBodyStruct = s.partial(CreateSubTaskBodyStruct);
