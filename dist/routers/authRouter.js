"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRouter = void 0;
const express_1 = require("express");
const _middlewares_1 = require("@middlewares");
const authRouter = (authController) => {
    const router = (0, express_1.Router)();
    router.route('/signup').post((0, _middlewares_1.asyncHandler)(authController.signUp));
    router.route('/login').post((0, _middlewares_1.asyncHandler)(authController.login));
    return router;
};
exports.authRouter = authRouter;
