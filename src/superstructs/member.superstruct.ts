import { body } from 'express-validator';

export const UpdateMemberRoleSchema = [
  body('role').isIn(['OWNER', 'MEMBER']).withMessage('Role must be either OWNER or MEMBER'),
];

export const UpdateMemberStatusSchema = [
  body('memberStatus')
    .isIn(['PENDING', 'ACCEPTED'])
    .withMessage('MemberStatus must be either PENDING or ACCEPTED'),
];

export const CreateInvitationSchema = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Email must be a valid email address'),
];

