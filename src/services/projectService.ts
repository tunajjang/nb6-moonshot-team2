import { Project } from '@prisma/client';
import { ProjectRepository } from '../repositories/projectRepository';

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
  async createProject(userId: number, dto: CreateProjectDto): Promise<Project> {
    const existingProjectCount = await this.projectRepository.countProjectsByUserId(userId);

    if (existingProjectCount >= MAX_PROJECT_COUNT) {
      throw new Error(`프로젝트는 최대 ${MAX_PROJECT_COUNT}개까지만 생성할 수 있습니다.`);
    }

    const newProject = await this.projectRepository.createProject(
      userId,
      dto.name,
      dto.description,
    );

    return newProject;
  }
}
