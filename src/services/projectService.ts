import { Project, User } from '@prisma/client';
import { ProjectRepository } from '../repositories/projectRepository';
import { BadRequestError } from '../lib/errors/badRequestError';
import { NotFoundError } from '../lib/errors/notFoundError';

export interface CreateProjectDto {
  name: string;
  description: string;
}

// 유저당 최대 5개의 프로젝트만 생성 가능
const MAX_PROJECT_COUNT = 5;

export class ProjectService {
  private projectRepository: ProjectRepository;

  constructor(projectRepository: ProjectRepository) {
    this.projectRepository = projectRepository;
  }

  // 프로젝트 생성
  async createProject(userId: User['id'], dto: CreateProjectDto): Promise<Project> {
    const existingProjectCount = await this.projectRepository.countProjectsByUserId(userId);

    if (existingProjectCount >= MAX_PROJECT_COUNT) {
      throw new BadRequestError(`프로젝트는 최대 ${MAX_PROJECT_COUNT}개까지만 생성할 수 있습니다.`);
    }

    const newProject = await this.projectRepository.createProject(
      userId,
      dto.name,
      dto.description,
    );

    return newProject;
  }

  // 프로젝트 조회
  async getMyProjects(userId: User['id'], sort: 'latest' | 'alphabetical') {
    const user = await this.projectRepository.findUserById(userId);
    if (!user) {
      throw new NotFoundError();
    }

    const projects = await this.projectRepository.getMyProjects(userId, sort);

    return projects.map((project) => {
      const taskCount = {
        PENDING: 0,
        IN_PROGRESS: 0,
        DONE: 0,
      };

      project.tasks.forEach((task) => {
        const status = task.status as keyof typeof taskCount;
        if (taskCount[status] !== undefined) {
          taskCount[status]++;
        }
      });

      return {
        id: project.id,
        name: project.name,
        description: project.description,
        memberCount: project._count.projectMembers,
        todoCount: taskCount.PENDING,
        inProgressCount: taskCount.IN_PROGRESS,
        doneCount: taskCount.DONE,
      };
    });
  }
}
