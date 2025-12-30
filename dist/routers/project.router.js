"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const prisma_1 = __importDefault(require("../lib/prisma"));
const project_repository_1 = require("../repositories/project.repository");
const project_service_1 = require("../services/project.service");
const project_controller_1 = require("../controllers/project.controller");
const _middlewares_1 = require("@middlewares");
const project_superstruct_1 = require("../superstructs/project.superstruct");
const router = (0, express_1.Router)();
const projectRepository = new project_repository_1.ProjectRepository(prisma_1.default);
const projectService = new project_service_1.ProjectService(projectRepository);
const projectController = new project_controller_1.ProjectController(projectService);
// 프로젝트 생성 (인증 필요)
router.post('/', _middlewares_1.authenticate, (0, _middlewares_1.validate)(project_superstruct_1.CreateProjectStruct), (0, _middlewares_1.asyncHandler)(projectController.createProject));
// 프로젝트 상세 조회 (인증 필요)
router.get('/:projectId', _middlewares_1.authenticate, (0, _middlewares_1.asyncHandler)(projectController.getProjectDetail));
// 프로젝트 수정 (인증 필요)
router.patch('/:projectId', _middlewares_1.authenticate, (0, _middlewares_1.validate)(project_superstruct_1.UpdateProjectStruct), (0, _middlewares_1.asyncHandler)(projectController.updateProject));
// 프로젝트 삭제 (인증 필요)
router.delete('/:projectId', _middlewares_1.authenticate, (0, _middlewares_1.asyncHandler)(projectController.deleteProject));
exports.default = router;
