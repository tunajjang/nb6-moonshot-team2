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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const _lib_1 = require("@lib");
const http_status_codes_1 = require("http-status-codes");
class UserService {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    /**
     * 비밀번호 검증
     */
    verifyPassword(userId, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.userRepository.getUserById(userId);
            if (!user) {
                throw new _lib_1.NotFoundError('User Not Found!');
            }
            const isMatch = yield bcrypt_1.default.compare(password, user.password);
            if (!isMatch) {
                throw new _lib_1.AppError('비밀번호가 일치하지 않습니다.', http_status_codes_1.StatusCodes.UNAUTHORIZED);
            }
            return true;
        });
    }
    /**
     * 사용자 정보 조회
     */
    getUserById(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.userRepository.getUserById(userId);
            if (!user) {
                throw new _lib_1.NotFoundError('User not found!');
            }
            return user;
        });
    }
    /**
     * 사용자 정보 수정
     */
    updateUser(userId, userData) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.getUserById(userId);
            if (userData.password && typeof userData.password === 'string') {
                userData.password = yield bcrypt_1.default.hash(userData.password, 10);
            }
            return this.userRepository.updateUser(userId, userData);
        });
    }
    /**
     * 비밀번호 수정
     */
    updatePassword(userId, userData) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.getUserById(userId);
            const hashedPassword = yield bcrypt_1.default.hash(userData.password, 10);
            return yield this.userRepository.updatePassword(userId, { password: hashedPassword });
        });
    }
    /**
     * 사용자 정보 삭제(soft delete)
     */
    deleteUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.getUserById(userId);
            return this.userRepository.deleteUser(userId);
        });
    }
    /**
     * 사용자 목록 조회
     */
    findUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.userRepository.findUsers();
        });
    }
    /**
     * 이메일로 사용자 조회
     */
    findUserByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.userRepository.findUserByEmail(email);
            if (!user) {
                throw new _lib_1.NotFoundError('User not found');
            }
            return user;
        });
    }
    /**
     * 내 프로젝트 목록 조회
     */
    getMyProjects(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const members = yield this.userRepository.findProjectsByUserId(userId);
            return members.map((member) => member.project);
        });
    }
    /**
     * 내 태크스 목록 조회
     */
    getMyTasks(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const tasks = yield this.userRepository.findTasksByUserId(userId);
            return tasks;
        });
    }
}
exports.UserService = UserService;
