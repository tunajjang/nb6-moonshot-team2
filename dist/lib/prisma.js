"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PORT = exports.prisma = void 0;
require("dotenv/config");
const client_1 = require("@prisma/client");
const prismaClientSingleton = () => {
    return new client_1.PrismaClient();
};
const globalForPrisma = globalThis;
const prisma = (_a = globalForPrisma.prisma) !== null && _a !== void 0 ? _a : prismaClientSingleton();
exports.prisma = prisma;
if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = prisma;
}
const PORT = process.env.PORT || 3000;
exports.PORT = PORT;
