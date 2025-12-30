import { Prisma, Project, User } from '@prisma/client';
import { ProjectRepository } from '@repositories';
import { NotFoundError, BadRequestError } from '@lib';

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

  // 프로젝트 상세 조회
  async getProjectDetail(projectId: Project['id']) {
    const project = await this.projectRepository.getProjectDetail(projectId);

    if (!project) {
      throw new NotFoundError('Project not found');
    }

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
  }

  // 프로젝트 수정
  async updateProject(projectId: Project['id'], projectData: Prisma.ProjectUpdateInput) {
    const project = await this.projectRepository.findProjectById(projectId);
    if (!project) {
      throw new NotFoundError('Project not found');
    }

    return this.projectRepository.updateProject(projectId, projectData);
  }

  // 프로젝트 삭제
  async deleteProject(projectId: Project['id']) {
    const project = await this.projectRepository.findProjectById(projectId);
    if (!project) {
      throw new NotFoundError('Project not found');
    }

    return this.projectRepository.deleteProject(projectId);
  }
}
