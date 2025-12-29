import { object, string, number, size } from 'superstruct';

export const CreateProjectStruct = object({
  userId: number(),
  name: size(string(), 1, 10),
  description: size(string(), 1, 40),
});
