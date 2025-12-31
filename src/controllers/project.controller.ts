import { Response } from 'express'; // NextFunction은 이제 필요 없어
import { ProjectService } from '@services';
import { AuthRequest } from '@middlewares';

export class ProjectController {
  constructor(private projectService: ProjectService) {}

  createProject = async (req: AuthRequest, res: Response) => {
    const userId = req.user!.id;
    const result = await this.projectService.createProject(userId, req.body);

    return res.status(201).json(result);
  };

  getProjectDetail = async (req: AuthRequest, res: Response) => {
    const { projectId } = req.params;
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
