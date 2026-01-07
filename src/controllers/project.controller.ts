import { Response } from 'express';
import { ProjectService } from '@services';
import { AuthRequest } from '@middlewares';
import { BadRequestError, UnauthorizedError } from '@/lib';

export class ProjectController {
  constructor(private projectService: ProjectService) {}

  createProject = async (req: AuthRequest, res: Response) => {
    const user = req.user;

    if (!user) {
      throw new UnauthorizedError('인증 정보가 없습니다.');
    }
    const result = await this.projectService.createProject(user.id, req.body);
    return res.status(201).json(result);
  };

  getProjectDetail = async (req: AuthRequest, res: Response) => {
    const { projectId } = req.params;

    const id = parseInt(projectId, 10);

    if (isNaN(id)) {
      throw new BadRequestError('프로젝트 ID는 숫자여야 합니다.');
    }

    const userId = req.user!.id;
    const result = await this.projectService.getProjectDetail(Number(projectId), userId);

    return res.status(200).json(result);
  };

  updateProject = async (req: AuthRequest, res: Response) => {
    const { projectId } = req.params;
    const userId = req.user!.id;
    const result = await this.projectService.updateProject(Number(projectId), userId, req.body);

    return res.status(200).json(result);
  };

  deleteProject = async (req: AuthRequest, res: Response) => {
    const { projectId } = req.params;
    const userId = req.user!.id;
    await this.projectService.deleteProject(Number(projectId), userId);

    return res.status(204).send();
  };
}
