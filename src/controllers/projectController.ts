import { Request, RequestHandler, Response } from 'express';
import { ProjectService } from '../services/projectService';
import { NotFoundError } from '../lib/errors/notFoundError';
import { BadRequestError } from '../lib/errors/badRequestError';

export class ProjectController {
  private projectService: ProjectService;

  constructor(projectService: ProjectService) {
    this.projectService = projectService;
  }

  public createProject: RequestHandler = async (req, res) => {
    const { userId, name, description } = req.body;

    const newProject = await this.projectService.createProject(parseInt(userId, 10), {
      name,
      description,
    });

    res.status(200).json(newProject);
  };

  public getProjectDetail: RequestHandler = async (req, res) => {
    const projectId = parseInt(req.params.projectId, 10);

    try {
      const project = await this.projectService.getProjectDetail(projectId);
      return res.status(200).json(project);
    } catch (error) {
      if (error instanceof NotFoundError) {
        res.status(404).send();
        return;
      }
      throw error;
    }
  };

  public updateProject: RequestHandler = async (req, res) => {
    const projectId = parseInt(req.params.projectId, 10);
    const { name, description } = req.body;

    if (isNaN(projectId)) {
      throw new BadRequestError('잘못된 데이터 형식');
    }

    try {
      const updatedProject = await this.projectService.updateProject(projectId, {
        name,
        description,
      });

      res.status(200).json(updatedProject);
    } catch (error) {
      if (error instanceof NotFoundError) {
        res.status(404).send();
        return;
      }
      throw error;
    }
  };

  public deleteProject: RequestHandler = async (req, res) => {
    const projectId = parseInt(req.params.projectId, 10);

    if (isNaN(projectId)) {
      throw new BadRequestError('잘못된 데이터 형식');
    }

    try {
      await this.projectService.deleteProject(projectId);

      res.status(204).send();
    } catch (error) {
      if (error instanceof NotFoundError) {
        res.status(404).send();
        return;
      }
      throw error;
    }
  };
}
