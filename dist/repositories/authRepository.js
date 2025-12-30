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
class AuthRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    /**
     * 회원가입
     */
    signUp(userData) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.prisma.user.create({ data: userData });
        });
    }
    /**
     * 로그인
     * Refresh Token 저장
     */
    saveToken(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.prisma.token.create({ data });
        });
    }
    /**
     * 로그아웃
     */
    logout() {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    /**
     * 토큰 재발급
     */
    updateRefreshToken(id, refreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.prisma.user.update({
                where: { id },
                data: refreshToken,
            });
        });
    }
}
exports.AuthRepository = AuthRepository;
