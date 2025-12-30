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
exports.ProjectController = void 0;
const notFound_error_1 = require("../lib/errors/notFound.error");
const badRequest_error_1 = require("../lib/errors/badRequest.error");
class ProjectController {
    constructor(projectService) {
        this.createProject = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { userId, name, description } = req.body;
            const newProject = yield this.projectService.createProject(parseInt(userId, 10), {
                name,
                description,
            });
            res.status(200).json(newProject);
        });
        this.getProjectDetail = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const projectId = parseInt(req.params.projectId, 10);
            try {
                const project = yield this.projectService.getProjectDetail(projectId);
                return res.status(200).json(project);
            }
            catch (error) {
                if (error instanceof notFound_error_1.NotFoundError) {
                    res.status(404).send();
                    return;
                }
                throw error;
            }
        });
        this.updateProject = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const projectId = parseInt(req.params.projectId, 10);
            const { name, description } = req.body;
            if (isNaN(projectId)) {
                throw new badRequest_error_1.BadRequestError('잘못된 데이터 형식');
            }
            try {
                const updatedProject = yield this.projectService.updateProject(projectId, {
                    name,
                    description,
                });
                res.status(200).json(updatedProject);
            }
            catch (error) {
                if (error instanceof notFound_error_1.NotFoundError) {
                    res.status(404).send();
                    return;
                }
                throw error;
            }
        });
        this.deleteProject = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const projectId = parseInt(req.params.projectId, 10);
            if (isNaN(projectId)) {
                throw new badRequest_error_1.BadRequestError('잘못된 데이터 형식');
            }
            try {
                yield this.projectService.deleteProject(projectId);
                res.status(204).send();
            }
            catch (error) {
                if (error instanceof notFound_error_1.NotFoundError) {
                    res.status(404).send();
                    return;
                }
                throw error;
            }
        });
        this.projectService = projectService;
    }
}
exports.ProjectController = ProjectController;
