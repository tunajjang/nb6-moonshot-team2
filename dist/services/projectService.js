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
exports.ProjectService = void 0;
const badRequestError_1 = require("../lib/errors/badRequestError");
const notFoundError_1 = require("../lib/errors/notFoundError");
// 유저당 최대 5개의 프로젝트만 생성 가능
const MAX_PROJECT_COUNT = 5;
class ProjectService {
    constructor(projectRepository) {
        this.projectRepository = projectRepository;
    }
    // 프로젝트 생성
    createProject(userId, dto) {
        return __awaiter(this, void 0, void 0, function* () {
            const existingProjectCount = yield this.projectRepository.countProjectsByUserId(userId);
            if (existingProjectCount >= MAX_PROJECT_COUNT) {
                throw new badRequestError_1.BadRequestError(`프로젝트는 최대 ${MAX_PROJECT_COUNT}개까지만 생성할 수 있습니다.`);
            }
            const newProject = yield this.projectRepository.createProject(userId, dto.name, dto.description);
            return newProject;
        });
    }
    // 프로젝트 상세 조회
    getProjectDetail(projectId) {
        return __awaiter(this, void 0, void 0, function* () {
            const project = yield this.projectRepository.getProjectDetail(projectId);
            if (!project) {
                throw new notFoundError_1.NotFoundError('Project not found');
            }
            const taskCount = {
                PENDING: 0,
                IN_PROGRESS: 0,
                DONE: 0,
            };
            project.tasks.forEach((task) => {
                const status = task.status;
                if (taskCount[status] !== undefined) {
                    taskCount[status]++;
                }
            });
            return {
                id: project.id,
                name: project.name,
                description: project.description,
                memberCount: project._count.projectMembers,
                todoCount: taskCount.PENDING,
                inProgressCount: taskCount.IN_PROGRESS,
                doneCount: taskCount.DONE,
            };
        });
    }
    // 프로젝트 수정
    updateProject(projectId, projectData) {
        return __awaiter(this, void 0, void 0, function* () {
            const project = yield this.projectRepository.findProjectById(projectId);
            if (!project) {
                throw new notFoundError_1.NotFoundError('Project not found');
            }
            return this.projectRepository.updateProject(projectId, projectData);
        });
    }
    // 프로젝트 삭제
    deleteProject(projectId) {
        return __awaiter(this, void 0, void 0, function* () {
            const project = yield this.projectRepository.findProjectById(projectId);
            if (!project) {
                throw new notFoundError_1.NotFoundError('Project not found');
            }
            return this.projectRepository.deleteProject(projectId);
        });
    }
}
exports.ProjectService = ProjectService;
