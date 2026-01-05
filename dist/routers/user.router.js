"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRouter = void 0;
const express_1 = require("express");
const _middlewares_1 = require("@middlewares");
const _superstructs_1 = require("@superstructs");
const userRouter = (userController) => {
    const router = (0, express_1.Router)();
    router.route('/').get((0, _middlewares_1.asyncHandler)(userController.findUsers));
    router.route('/search').get((0, _middlewares_1.asyncHandler)(userController.findUserByEmail)); // 단순 검색은 공개 가능
    router
        .route('/me')
        .patch(_middlewares_1.authenticate, (0, _middlewares_1.validate)(_superstructs_1.UpdateUserStruct), (0, _middlewares_1.asyncHandler)(userController.updateUser))
        .get(_middlewares_1.authenticate, (0, _middlewares_1.asyncHandler)(userController.getMe)) // 조회는 인증 필요
        .delete(_middlewares_1.authenticate, (0, _middlewares_1.asyncHandler)(userController.deleteUser)); // 삭제는 인증 필요
    router
        .route('/me/verify-password')
        .post(_middlewares_1.authenticate, (0, _middlewares_1.asyncHandler)(userController.verifyPassword));
    router.route('/me/projects').get(_middlewares_1.authenticate, (0, _middlewares_1.asyncHandler)(userController.getMyProjects));
    router.route('/me/tasks').get(_middlewares_1.authenticate, (0, _middlewares_1.asyncHandler)(userController.getMyTasks));
    return router;
};
exports.userRouter = userRouter;
