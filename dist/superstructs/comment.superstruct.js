"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateCommentSchema = exports.CreateCommentSchema = void 0;
const express_validator_1 = require("express-validator");
exports.CreateCommentSchema = [
    (0, express_validator_1.body)('content')
        .trim()
        .notEmpty()
        .withMessage('Content is required')
        .isLength({ min: 1, max: 1000 })
        .withMessage('Content must be between 1 and 1000 characters'),
];
exports.UpdateCommentSchema = [
    (0, express_validator_1.body)('content')
        .trim()
        .notEmpty()
        .withMessage('Content is required')
        .isLength({ min: 1, max: 1000 })
        .withMessage('Content must be between 1 and 1000 characters'),
];
