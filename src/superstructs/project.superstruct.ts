import * as s from 'superstruct';

export const CreateProjectStruct = s.object({
  userId: s.number(),
  name: s.size(s.string(), 1, 10),
  description: s.size(s.string(), 1, 40),
});

export const UpdateProjectStruct = s.object({
  name: s.optional(s.size(s.string(), 1, 10)),
  description: s.optional(s.size(s.string(), 1, 40)),
});
