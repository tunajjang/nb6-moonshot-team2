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
exports.ProjectService = void 0;
const _lib_1 = require("@lib");
const s = __importStar(require("superstruct"));
const _superstructs_1 = require("@superstructs");
// 유저당 최대 5개의 프로젝트만 생성 가능
const MAX_PROJECT_COUNT = 5;
class ProjectService {
    constructor(projectRepository, mailService) {
        this.projectRepository = projectRepository;
        this.mailService = mailService;
    }
    // 프로젝트 생성
    createProject(userId, dto) {
        return __awaiter(this, void 0, void 0, function* () {
            s.assert(dto, _superstructs_1.CreateProjectStruct);
            const count = yield this.projectRepository.countOwnedProjectsByUserId(userId);
            if (count >= MAX_PROJECT_COUNT)
                throw new _lib_1.BadRequestError('최대 5개까지 생성 가능합니다.');
            const newProject = yield this.projectRepository.createProject(userId, dto.name.trim(), dto.description.trim());
            return this.getProjectDetail(newProject.id, userId);
        });
    }
    // 프로젝트 상세 조회
    getProjectDetail(projectId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const projectDetail = yield this.projectRepository.getProjectDetailData(projectId);
            if (!projectDetail)
                throw new _lib_1.NotFoundError();
            const isMember = yield this.projectRepository.isMember(projectId, userId);
            if (!isMember)
                throw new _lib_1.ForbiddenError('프로젝트 멤버가 아닙니다');
            return projectDetail;
        });
    }
    // 프로젝트 수정
    updateProject(projectId, userId, dto) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            s.assert(dto, _superstructs_1.UpdateProjectStruct);
            const project = yield this.projectRepository.findProjectById(projectId);
            if (!project)
                throw new _lib_1.NotFoundError();
            if (project.ownerId !== userId)
                throw new _lib_1.ForbiddenError('프로젝트 관리자가 아닙니다');
            const name = (_a = dto.name) === null || _a === void 0 ? void 0 : _a.trim();
            const description = (_b = dto.description) === null || _b === void 0 ? void 0 : _b.trim();
            const hasNoValidName = dto.name !== undefined && !name;
            const hasNoValidDesc = dto.description !== undefined && !description;
            const isAllEmpty = dto.name === undefined && dto.description === undefined;
            if (hasNoValidName || hasNoValidDesc || isAllEmpty) {
                throw new _lib_1.BadRequestError('잘못된 데이터 형식');
            }
            yield this.projectRepository.updateProject(projectId, { name, description });
            return this.getProjectDetail(projectId, userId);
        });
    }
    // 프로젝트 삭제
    deleteProject(projectId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!projectId || isNaN(projectId)) {
                throw new _lib_1.BadRequestError('잘못된 데이터 형식');
            }
            const project = (yield this.projectRepository.findProjectById(projectId));
            if (!project)
                throw new _lib_1.NotFoundError();
            if (project.ownerId !== userId) {
                throw new _lib_1.ForbiddenError('프로젝트 관리자가 아닙니다');
            }
            const memberEmails = project.projectMembers
                .map((member) => { var _a; return (_a = member.user) === null || _a === void 0 ? void 0 : _a.email; })
                .filter((email) => !!email);
            yield this.projectRepository.deleteProject(projectId);
            if (memberEmails.length > 0) {
                this.mailService.sendProjectDeletionEmail(memberEmails, project.name);
            }
        });
    }
}
exports.ProjectService = ProjectService;
