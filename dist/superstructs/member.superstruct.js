"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateInvitationSchema = exports.UpdateMemberStatusSchema = exports.UpdateMemberRoleSchema = void 0;
const express_validator_1 = require("express-validator");
exports.UpdateMemberRoleSchema = [
    (0, express_validator_1.body)('role').isIn(['OWNER', 'MEMBER']).withMessage('Role must be either OWNER or MEMBER'),
];
exports.UpdateMemberStatusSchema = [
    (0, express_validator_1.body)('memberStatus')
        .isIn(['PENDING', 'ACCEPTED'])
        .withMessage('MemberStatus must be either PENDING or ACCEPTED'),
];
exports.CreateInvitationSchema = [
    (0, express_validator_1.body)('email')
        .trim()
        .notEmpty()
        .withMessage('Email is required')
        .isEmail()
        .withMessage('Email must be a valid email address'),
];
