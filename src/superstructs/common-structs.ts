import * as s from 'superstruct';

const integerString = s.coerce(s.integer(), s.string(), (value) => parseInt(value));

export const IdParamStruct = s.object({
  taskId: integerString,
});

export const ProjectIdParamStruct = s.object({
  projectId: integerString,
});

export const PageParamsStrict = s.object({
  page: s.defaulted(integerString, 1),
  limit: s.defaulted(integerString, 10),
  orderBy: s.defaulted(s.enums(['created_at', 'name', 'end_date']), 'created_at'),
  order: s.defaulted(s.enums(['asc', 'desc']), 'desc'),
  keyword: s.optional(s.nonempty(s.string())),
  status: s.optional(s.enums(['PENDING', 'IN_PROGRESS', 'DONE'])),
  assigneeId: s.optional(integerString),
});
