import { Request, RequestHandler, Response } from 'express';
import { ProjectService } from '../services/projectService';

export class ProjectController {
  // 1단계: ProjectService를 담을 변수를 선언하고, 생성자(constructor)를 만들어보세요.
  private projectService: ProjectService;

  constructor(projectService: ProjectService) {
    this.projectService = projectService;
  }

  createProject: RequestHandler = async (req, res) => {
    try {
      const { userId, name, description } = req.body;

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
