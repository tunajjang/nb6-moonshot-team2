import { Request, RequestHandler, Response } from 'express';
import { ProjectService } from '../services/projectService';
import { NotFoundError } from '../lib/errors/notFoundError';

export class ProjectController {
  private projectService: ProjectService;

  constructor(projectService: ProjectService) {
    this.projectService = projectService;
  }

  createProject: RequestHandler = async (req, res) => {
    const { userId, name, description } = req.body;

    const newProject = await this.projectService.createProject(parseInt(userId, 10), {
      name,
      description,
    });

    res.status(201).json(newProject);
  };

  getMyProjects: RequestHandler = async (req, res) => {
    const userId = parseInt(req.params.projectId, 10);
    const sort = (req.query.sort as 'latest' | 'alphabetical') || 'latest';

    try {
      const projects = await this.projectService.getMyProjects(userId, sort);
      return res.status(200).json(projects);
    } catch (error) {
      if (error instanceof NotFoundError) {
        res.status(404).send();
        return;
      }
      throw error;
    }
  };
}
