import * as s from 'superstruct';

const integerString = s.coerce(s.integer(), s.string(), (value) => parseInt(value));

export const IdParamStruct = s.object({
  id: integerString,
});
