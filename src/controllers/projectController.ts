import { Request, RequestHandler, Response } from 'express';
import { ProjectService } from '../services/projectService';

export class ProjectController {
  private projectService: ProjectService;

  constructor(projectService: ProjectService) {
    this.projectService = projectService;
  }

  createProject: RequestHandler = async (req, res) => {
    try {
      const { userId, name, description } = req.body;

      if (!userId || isNaN(Number(userId))) {
        return res.status(400).json({ message: '올바르지 않은 유저 ID입니다.' });
      }

      const newProject = await this.projectService.createProject(Number(userId), {
        name,
        description,
      });

      res.status(201).json(newProject);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  };
}
