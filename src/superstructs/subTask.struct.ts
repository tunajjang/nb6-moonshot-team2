import * as s from 'superstruct';

export const CreateSubTaskBodyStruct = s.object({
  title: s.nonempty(s.string()),
});

export const UpdateSubTaskBodyStruct = s.partial(CreateSubTaskBodyStruct);
