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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const http_status_codes_1 = require("http-status-codes");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const _lib_1 = require("@lib");
class AuthService {
    constructor(authRepository, userRepository) {
        this.authRepository = authRepository;
        this.userRepository = userRepository;
    }
    signUp(userData) {
        return __awaiter(this, void 0, void 0, function* () {
            const existingUser = yield this.userRepository.findUserByEmail(userData.email);
            if (existingUser) {
                throw new _lib_1.AppError('이미 존재하는 이메일입니다.', http_status_codes_1.StatusCodes.CONFLICT);
            }
            const hashedPassword = yield bcrypt_1.default.hash(userData.password, 10);
            const createUser = yield this.authRepository.signUp(Object.assign(Object.assign({}, userData), { password: hashedPassword }));
            const { password } = createUser, newUser = __rest(createUser, ["password"]);
            return newUser;
        });
    }
    login(email, pw, userAgent) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.userRepository.findUserByEmail(email);
            if (!user) {
                throw new _lib_1.AppError('이메일 또는 비밀번호가 일치하지 않습니다.', http_status_codes_1.StatusCodes.UNAUTHORIZED);
            }
            const isPasswordValid = yield bcrypt_1.default.compare(pw, user.password);
            if (!isPasswordValid) {
                throw new _lib_1.AppError('이메일 또는 비밀번호가 일치하지 않습니다.', http_status_codes_1.StatusCodes.UNAUTHORIZED);
            }
            // 토큰 발급
            const { accessToken, refreshToken } = this._issueToken(user);
            const expiresAt = new Date();
            expiresAt.setDate(expiresAt.getDate() + 7);
            // refreshToken을 DB에 저장 및 반환
            yield this.authRepository.saveToken({
                refreshToken,
                userAgent,
                tokenStatus: client_1.TokenStatus.OKAY,
                expiresAt,
                user: { connect: { id: user.id } },
            });
            const { password } = user, userInfo = __rest(user, ["password"]);
            return { user: userInfo, accessToken, refreshToken };
        });
    }
    /**
     * Access Token과 Refresh Token을 발급
     */
    _issueToken(user) {
        const payload = { id: user.id, email: user.email };
        const accessToken = jsonwebtoken_1.default.sign(payload, process.env.JWT_SECRET || '', { expiresIn: '1h' });
        const refreshToken = jsonwebtoken_1.default.sign(payload, process.env.JWT_SECRET || '', { expiresIn: '7d' });
        return { accessToken, refreshToken };
    }
}
exports.AuthService = AuthService;
