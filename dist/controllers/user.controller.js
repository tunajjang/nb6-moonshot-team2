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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const superstruct_1 = require("superstruct");
const http_status_codes_1 = require("http-status-codes");
const _superstructs_1 = require("@superstructs");
class UserController {
    constructor(userService) {
        this.userService = userService;
        // 비밀번호 검증
        this.verifyPassword = (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            const { password } = req.body;
            yield this.userService.verifyPassword(userId, password);
            return res.status(http_status_codes_1.StatusCodes.OK).json({ message: 'Password verified successfully!' });
        });
        // ID로 찾기
        this.getUserById = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const userId = parseInt(req.params.id, 10);
            if (isNaN(userId)) {
                res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({ message: 'Invalid user Id' });
                return;
            }
            const _a = yield this.userService.getUserById(userId), { password } = _a, userData = __rest(_a, ["password"]);
            return res.status(http_status_codes_1.StatusCodes.OK).json(userData);
        });
        // 내정보 찾기
        this.getMe = (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            const _b = yield this.userService.getUserById(userId), { password } = _b, userData = __rest(_b, ["password"]);
            return res.status(http_status_codes_1.StatusCodes.OK).json(userData);
        });
        // 내정보 수정
        this.updateUser = (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            const _b = yield this.userService.updateUser(userId, req.body), { password } = _b, userData = __rest(_b, ["password"]);
            return res.status(http_status_codes_1.StatusCodes.OK).json(userData);
        });
        // 비밀번호 수정
        this.updatePassword = (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            const { password } = req.body;
            yield this.userService.updatePassword(userId, { password });
            return res.status(http_status_codes_1.StatusCodes.OK).json({ message: '비밀번호가 변경되었습니다.' });
        });
        // 사용자 찾기
        this.findUsers = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const users = yield this.userService.findUsers();
            const usersWithoutPassword = users.map((user) => {
                const { password } = user, userData = __rest(user, ["password"]);
                return userData;
            });
            return res.status(http_status_codes_1.StatusCodes.OK).json(usersWithoutPassword);
        });
        // 사용자 삭제
        this.deleteUser = (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            yield this.userService.deleteUser((_a = req.user) === null || _a === void 0 ? void 0 : _a.id);
            return res.status(http_status_codes_1.StatusCodes.OK).json({ message: '사용자를 삭제했습니다.' });
        });
        // EMAIL로 찾기
        this.findUserByEmail = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const email = req.query.email;
            if (!(0, superstruct_1.is)(email, _superstructs_1.EmailStruct)) {
                res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({ message: 'Email is required' });
                return;
            }
            const _a = yield this.userService.findUserByEmail(email), { password } = _a, userData = __rest(_a, ["password"]);
            return res.status(http_status_codes_1.StatusCodes.OK).json(userData);
        });
        // 내 프로젝트 목록 보기
        this.getMyProjects = (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            const projects = yield this.userService.getMyProjects(userId);
            return res.status(http_status_codes_1.StatusCodes.OK).json(projects);
        });
        // 내 할일 목록 보기
        this.getMyTasks = (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            const tasks = yield this.userService.getMyTasks(userId);
            return res.status(http_status_codes_1.StatusCodes.OK).json(tasks);
        });
    }
}
exports.UserController = UserController;
