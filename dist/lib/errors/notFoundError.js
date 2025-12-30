"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotFoundError = void 0;
const http_status_codes_1 = require("http-status-codes");
const _lib_1 = require("@lib");
class NotFoundError extends _lib_1.BaseError {
    constructor(message = '') {
        super(http_status_codes_1.StatusCodes.NOT_FOUND, message);
    }
}
exports.NotFoundError = NotFoundError;
