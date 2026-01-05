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
const axios_1 = __importDefault(require("axios"));
const http_status_codes_1 = require("http-status-codes");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const _lib_1 = require("@lib");
class AuthService {
    constructor(authRepository, userRepository) {
        this.authRepository = authRepository;
        this.userRepository = userRepository;
    }
    /**
     * 회원가입
     */
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
    /**
     * 로그인
     */
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
     * 로그아웃
     */
    logout(refreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.authRepository.logout(refreshToken);
        });
    }
    /**
     * 토큰 재발급
     */
    refreshTokens(refreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            const foundToken = yield this.authRepository.findToken(refreshToken);
            if (!foundToken || foundToken.tokenStatus === client_1.TokenStatus.EXPIRED) {
                throw new _lib_1.AppError('토큰이 유효하지 않습니다.', http_status_codes_1.StatusCodes.UNAUTHORIZED);
            }
            const payload = jsonwebtoken_1.default.verify(refreshToken, process.env.JWT_SECRET || '');
            if (!payload) {
                throw new _lib_1.AppError('토큰이 만료되었거나 유효하지 않습니다.', http_status_codes_1.StatusCodes.UNAUTHORIZED);
            }
            const user = yield this.userRepository.getUserById(payload.id);
            if (!user) {
                throw new _lib_1.AppError('사용자를 찾을 수 없습니다.', http_status_codes_1.StatusCodes.UNAUTHORIZED);
            }
            const { accessToken: newAccessToken, refreshToken: newRefreshToken } = this._issueToken(user);
            const newExpiresAt = new Date();
            newExpiresAt.setDate(newExpiresAt.getDate() + 7);
            yield this.authRepository.updateRefreshToken(refreshToken, {
                refreshToken: newRefreshToken,
                expiresAt: newExpiresAt,
                tokenStatus: client_1.TokenStatus.OKAY,
            });
            return { accessToken: newAccessToken, refreshToken: newRefreshToken };
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
    /**
     * 구글 로그인 페이지 URL 생성
     */
    getGoogleAuthURL() {
        const rootUrl = 'https://accounts.google.com/o/oauth2/v2/auth';
        const options = {
            redirect_uri: process.env.GOOGLE_REDIRECT_URI,
            client_id: process.env.GOOGLE_CLIENT_ID,
            access_type: 'offline',
            response_type: 'code',
            prompt: 'consent',
            scope: [
                'https://www.googleapis.com/auth/userinfo.profile',
                'https://www.googleapis.com/auth/userinfo.email',
            ].join(' '),
        };
        const qs = new URLSearchParams(options);
        return `${rootUrl}?${qs.toString()}`;
    }
    /**
     * 구글 로그인 처리(토큰 교환 & 유저 정보 조회& 회원가입/로그인)
     */
    googleLogin(code) {
        return __awaiter(this, void 0, void 0, function* () {
            const { data: tokenData } = yield axios_1.default.post('https://oauth2.googleapis.com/token', {
                code,
                client_id: process.env.GOOGLE_CLIENT_ID,
                client_secret: process.env.GOOGLE_CLIENT_SECRET,
                redirect_uri: process.env.GOOGLE_REDIRECT_URI,
                grant_type: 'authorization_code',
            });
            const { data: googleUser } = yield axios_1.default.get('https://www.googleapis.com/oauth2/v2/userinfo', {
                headers: {
                    Authorization: `Bearer ${tokenData.access_token}`,
                },
            });
            let user = yield this.userRepository.findUserByEmail(googleUser.email);
            if (!user) {
                user = yield this.authRepository.createSocialUser({
                    email: googleUser.email,
                    name: googleUser.name,
                });
            }
            const { accessToken, refreshToken } = this._issueToken(user);
            const expiresAt = new Date();
            expiresAt.setDate(expiresAt.getDate() + 7);
            yield this.authRepository.saveToken({
                refreshToken,
                userAgent: 'Google Login',
                tokenStatus: client_1.TokenStatus.OKAY,
                expiresAt,
                user: { connect: { id: user.id } },
            });
            return { accessToken, refreshToken, user };
        });
    }
}
exports.AuthService = AuthService;
