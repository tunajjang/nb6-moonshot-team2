"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PORT = exports.prisma = void 0;
require("dotenv/config");
const prisma_1 = __importDefault(require("./prisma"));
exports.prisma = prisma_1.default;
const PORT = process.env.PORT || 3000;
exports.PORT = PORT;
