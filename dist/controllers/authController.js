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
exports.AuthController = void 0;
const http_status_codes_1 = require("http-status-codes");
const superstruct_1 = require("superstruct");
const _superstructs_1 = require("@superstructs");
class AuthController {
    constructor(authService) {
        this.authService = authService;
        /**
         * 회원가입
         */
        this.signUp = (req, res) => __awaiter(this, void 0, void 0, function* () {
            if (!(0, superstruct_1.is)(req.body, _superstructs_1.signUpStruct)) {
                return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({ message: 'Invalid input data.' });
            }
            const newUser = yield this.authService.signUp(req.body);
            return res.status(http_status_codes_1.StatusCodes.CREATED).json(newUser);
        });
        /**
         * 로그인
         */
        this.login = (req, res) => __awaiter(this, void 0, void 0, function* () {
            if (!(0, superstruct_1.is)(req.body, _superstructs_1.loginStruct)) {
                return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({ message: 'Invalid input data.' });
            }
            const { email, password } = req.body;
            const userAgent = req.headers['user-agent'] || 'Unknown User Agent';
            const result = yield this.authService.login(email, password, userAgent); //email, password
            return res.status(http_status_codes_1.StatusCodes.OK).json(result);
        });
    }
}
exports.AuthController = AuthController;
