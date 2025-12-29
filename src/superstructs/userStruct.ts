import * as s from 'superstruct';

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export const EmailStruct = s.define('Email', (value) => {
  return typeof value === 'string' && EMAIL_REGEX.test(value);
});

export const signUpStruct = s.object({
  name: s.size(s.string(), 2, 20),
  email: EmailStruct,
  password: s.size(s.string(), 4, 20),
  profileImage: s.optional(s.string()),
});

export const loginStruct = s.object({
  email: EmailStruct,
  password: s.size(s.string(), 4, 20),
});

export const UpdateUserStruct = s.object({
  name: s.optional(s.size(s.string(), 2, 20)),
  email: s.optional(EmailStruct),
  password: s.optional(s.size(s.string(), 4, 20)),
  profileImage: s.optional(s.string()),
});
