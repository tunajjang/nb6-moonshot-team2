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
exports.AuthRepository = void 0;
const client_1 = require("@prisma/client");
class AuthRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    /**
     * 회원가입
     */
    signUp(userData) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.prisma.user.create({ data: userData });
        });
    }
    /**
     * 로그인
     * Refresh Token 저장
     */
    saveToken(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.prisma.token.create({ data });
        });
    }
    /**
     * 로그아웃
     */
    logout(refreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.prisma.token.update({
                where: { refreshToken },
                data: { tokenStatus: client_1.TokenStatus.EXPIRED },
            });
        });
    }
    /**
     * 토큰 재발급
     */
    updateRefreshToken(oldRefreshToken, refreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.prisma.token.update({
                where: { refreshToken: oldRefreshToken },
                data: refreshToken,
            });
        });
    }
    /**
     * 리프레시 토큰 찾기
     */
    findToken(refreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.prisma.token.findUnique({
                where: { refreshToken },
            });
        });
    }
    /**
     * 소셜 로그인 유저 생성
     */
    createSocialUser(userData) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.prisma.user.create({
                data: Object.assign(Object.assign({}, userData), { password: '' }),
            });
        });
    }
}
exports.AuthRepository = AuthRepository;
