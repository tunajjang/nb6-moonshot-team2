"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const _lib_1 = require("@lib");
const _repositories_1 = require("@repositories");
const _services_1 = require("@services");
const _controllers_1 = require("@controllers");
const _middlewares_1 = require("@middlewares");
const _superstructs_1 = require("@superstructs");
const router = (0, express_1.Router)();
const projectRepository = new _repositories_1.ProjectRepository(_lib_1.prisma);
const projectService = new _services_1.ProjectService(projectRepository);
const projectController = new _controllers_1.ProjectController(projectService);
// 프로젝트 생성 (인증 필요)
router.post('/', _middlewares_1.authenticate, (0, _middlewares_1.validate)(_superstructs_1.CreateProjectStruct), (0, _middlewares_1.asyncHandler)(projectController.createProject));
// 프로젝트 상세 조회 (인증 필요)
router.get('/:projectId', _middlewares_1.authenticate, (0, _middlewares_1.asyncHandler)(projectController.getProjectDetail));
// 프로젝트 수정 (인증 필요)
router.patch('/:projectId', _middlewares_1.authenticate, (0, _middlewares_1.validate)(_superstructs_1.UpdateProjectStruct), (0, _middlewares_1.asyncHandler)(projectController.updateProject));
// 프로젝트 삭제 (인증 필요)
router.delete('/:projectId', _middlewares_1.authenticate, (0, _middlewares_1.asyncHandler)(projectController.deleteProject));
exports.default = router;
