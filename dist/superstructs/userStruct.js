"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateUserStruct = exports.loginStruct = exports.signUpStruct = exports.EmailStruct = void 0;
const s = __importStar(require("superstruct"));
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
exports.EmailStruct = s.define('Email', (value) => {
    return typeof value === 'string' && EMAIL_REGEX.test(value);
});
exports.signUpStruct = s.object({
    name: s.size(s.string(), 2, 20),
    email: exports.EmailStruct,
    password: s.size(s.string(), 4, 20),
    profileImage: s.optional(s.string()),
});
exports.loginStruct = s.object({
    email: exports.EmailStruct,
    password: s.size(s.string(), 4, 20),
});
exports.UpdateUserStruct = s.object({
    name: s.optional(s.size(s.string(), 2, 20)),
    email: s.optional(exports.EmailStruct),
    password: s.optional(s.size(s.string(), 4, 20)),
    profileImage: s.optional(s.string()),
});
