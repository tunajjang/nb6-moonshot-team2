"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const superstruct_1 = require("superstruct");
const _superstructs_1 = require("@superstructs");
const http_status_codes_1 = require("http-status-codes");
class UserController {
    constructor(userService) {
        this.userService = userService;
        this.getUserById = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const userId = parseInt(req.params.id, 10);
            if (isNaN(userId)) {
                res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({ message: 'Invalid user Id' });
                return;
            }
            const user = yield this.userService.getUserById(userId);
            return res.status(http_status_codes_1.StatusCodes.OK).json(user);
        });
        this.updateUser = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const userId = parseInt(req.params.id);
            const userData = req.body;
            const updatedUser = yield this.userService.updateUser(userId, userData);
            return res.status(http_status_codes_1.StatusCodes.OK).json(updatedUser);
        });
        this.findUsers = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const users = yield this.userService.findUsers();
            return res.status(http_status_codes_1.StatusCodes.OK).json(users);
        });
        this.deleteUser = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const userId = parseInt(req.params.id);
            const deletedUser = yield this.userService.deleteUser(userId);
            return res.status(http_status_codes_1.StatusCodes.OK).json(deletedUser);
        });
        this.findUserByEmail = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const email = req.query.email;
            if (!(0, superstruct_1.is)(email, _superstructs_1.EmailStruct)) {
                res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({ message: 'Email is required' });
                return;
            }
            const user = yield this.userService.findUserByEmail(email);
            return res.status(http_status_codes_1.StatusCodes.OK).json(user);
        });
    }
}
exports.UserController = UserController;
