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
exports.UserService = void 0;
const _lib_1 = require("@lib");
class UserService {
    constructor(userRepository) {
        this.userRepository = userRepository;
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
            return this.userRepository.updateUser(userId, userData);
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
}
exports.UserService = UserService;
