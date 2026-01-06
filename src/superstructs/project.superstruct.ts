import * as s from 'superstruct';

const NonEmptyString = (min: number, max: number) =>
  s.refine(s.string(), 'TrimmedString', (value) => {
    const trimmed = value.trim();
    return trimmed.length >= min && trimmed.length <= max;
  });

export const CreateProjectStruct = s.object({
  name: NonEmptyString(1, 10),
  description: NonEmptyString(1, 40),
});

export const UpdateProjectStruct = s.object({
  name: s.optional(NonEmptyString(1, 10)),
  description: s.optional(NonEmptyString(1, 40)),
});
