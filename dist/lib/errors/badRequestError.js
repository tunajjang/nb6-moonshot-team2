"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BadRequestError = void 0;
const http_status_codes_1 = require("http-status-codes");
const _lib_1 = require("@lib");
class BadRequestError extends _lib_1.BaseError {
    constructor(message) {
        super(http_status_codes_1.StatusCodes.BAD_REQUEST, message);
    }
}
exports.BadRequestError = BadRequestError;
