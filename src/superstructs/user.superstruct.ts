import * as s from 'superstruct';
import { integerString } from '@superstructs';

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export const EmailStruct = s.define('Email', (value) => {
  return typeof value === 'string' && EMAIL_REGEX.test(value);
});

export const signUpStruct = s.object({
  name: s.size(s.string(), 2, 20),
  email: EmailStruct,
  password: s.size(s.string(), 4, 20),
  profileImage: s.optional(s.nullable(s.string())),
});

export const loginStruct = s.object({
  email: EmailStruct,
  password: s.size(s.string(), 4, 20),
});

export const UpdateUserStruct = s.object({
  email: s.optional(EmailStruct),
  name: s.optional(s.size(s.string(), 2, 20)),
  currentPassword: s.optional(s.size(s.string(), 4, 20)),
  newPassword: s.optional(s.size(s.string(), 4, 20)),
  profileImage: s.optional(s.nullable(s.string())),
});

export const GetMyProjectsQueryStruct = s.object({
  page: s.defaulted(integerString, 1),
  limit: s.defaulted(integerString, 10),
  order: s.defaulted(s.enums(['asc', 'desc']), 'desc'),
  order_by: s.defaulted(s.enums(['created_at', 'name']), 'created_at'),
});
