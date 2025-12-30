"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const dotenv_1 = __importDefault(require("dotenv"));
const _lib_1 = require("@lib");
const _middlewares_1 = require("@middlewares");
const _routers_1 = __importDefault(require("@routers"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use(_routers_1.default);
app.use(_middlewares_1.errorHandler);
app.listen(_lib_1.PORT, () => {
    console.log(`Server is running on port ${_lib_1.PORT}`);
});
