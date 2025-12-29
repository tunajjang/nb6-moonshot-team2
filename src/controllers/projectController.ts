import { Request, RequestHandler, Response } from 'express';
import { ProjectService } from '../services/projectService';

export class ProjectController {
  private projectService: ProjectService;

  constructor(projectService: ProjectService) {
    this.projectService = projectService;
  }

  createProject: RequestHandler = async (req, res) => {
    const { userId, name, description } = req.body;

    const newProject = await this.projectService.createProject(Number(userId), {
      name,
      description,
    });

    res.status(201).json(newProject);
  };
}
