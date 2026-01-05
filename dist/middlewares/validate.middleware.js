"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
const superstruct_1 = require("superstruct");
const http_status_codes_1 = require("http-status-codes");
const validate = (struct) => {
    return (req, res, next) => {
        try {
            (0, superstruct_1.assert)(req.body, struct);
            next();
        }
        catch (e) {
            res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({ message: '잘못된 데이터 형식' });
        }
    };
};
exports.validate = validate;
