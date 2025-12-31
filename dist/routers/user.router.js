"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRouter = void 0;
const express_1 = require("express");
const _middlewares_1 = require("@middlewares");
const _superstructs_1 = require("@superstructs");
const userRouter = (userController) => {
    const router = (0, express_1.Router)();
    router.route('/').get((0, _middlewares_1.asyncHandler)(userController.findUsers));
    router.route('/search').get((0, _middlewares_1.asyncHandler)(userController.findUserByEmail));
    router
        .route('/:id')
        .patch(_middlewares_1.authenticate, (0, _middlewares_1.validate)(_superstructs_1.UpdateUserStruct), (0, _middlewares_1.asyncHandler)(userController.updateUser))
        .get((0, _middlewares_1.asyncHandler)(userController.getUserById)) // 조회는 공개 가능
        .delete(_middlewares_1.authenticate, (0, _middlewares_1.asyncHandler)(userController.deleteUser)); // 삭제는 인증 필요
    return router;
};
exports.userRouter = userRouter;
