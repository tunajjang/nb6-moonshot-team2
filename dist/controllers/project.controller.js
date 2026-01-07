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
const lib_1 = require("@/lib");
class ProjectController {
    constructor(projectService) {
        this.projectService = projectService;
        this.createProject = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const user = req.user;
            if (!user) {
                throw new lib_1.UnauthorizedError('인증 정보가 없습니다.');
            }
            const result = yield this.projectService.createProject(user.id, req.body);
            return res.status(201).json(result);
        });
        this.getProjectDetail = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { projectId } = req.params;
            const id = parseInt(projectId, 10);
            if (isNaN(id)) {
                throw new lib_1.BadRequestError('프로젝트 ID는 숫자여야 합니다.');
            }
            const userId = req.user.id;
            const result = yield this.projectService.getProjectDetail(Number(projectId), userId);
            return res.status(200).json(result);
        });
        this.updateProject = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { projectId } = req.params;
            const userId = req.user.id;
            const result = yield this.projectService.updateProject(Number(projectId), userId, req.body);
            return res.status(200).json(result);
        });
        this.deleteProject = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { projectId } = req.params;
            const userId = req.user.id;
            yield this.projectService.deleteProject(Number(projectId), userId);
            return res.status(204).send();
        });
    }
}
exports.ProjectController = ProjectController;
