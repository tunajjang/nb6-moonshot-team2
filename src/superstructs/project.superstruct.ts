import * as s from 'superstruct';

const NonEmptyString = (min: number, max: number) =>
  s.refine(s.size(s.string(), min, max), 'NonEmptyString', (value) => {
    return value.trim().length > 0;
  });

export const CreateProjectStruct = s.object({
  name: NonEmptyString(1, 10),
  description: NonEmptyString(1, 40),
});

export const UpdateProjectStruct = s.object({
  name: s.optional(NonEmptyString(1, 10)),
  description: s.optional(NonEmptyString(1, 40)),
});
