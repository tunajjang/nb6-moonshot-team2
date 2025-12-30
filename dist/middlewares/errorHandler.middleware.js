"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const http_status_codes_1 = require("http-status-codes");
const _lib_1 = require("@lib");
const errorHandler = (error, req, res, next) => {
    console.error(error.stack);
    if (error instanceof _lib_1.BaseError) {
        return res.status(error.statusCode).json({ message: error.message });
    }
    res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Internal Server Error' });
};
exports.errorHandler = errorHandler;
// export default errorHandler;
