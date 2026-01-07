import { ProjectRepository } from '@repositories';
import { NotFoundError, BadRequestError, ForbiddenError } from '@lib';
import { CreateProjectDto, ProjectDetailDto, UpdateProjectDto } from '@types';
import * as s from 'superstruct';
import { CreateProjectStruct, UpdateProjectStruct } from '@superstructs';
import { MailService } from '@services';

// 유저당 최대 5개의 프로젝트만 생성 가능
const MAX_PROJECT_COUNT = 5;

interface ProjectWithMembers {
  id: number;
  name: string;
  ownerId: number;
  projectMembers: {
    user: {
      email: string;
    };
  }[];
}

export class ProjectService {
  constructor(private projectRepository: ProjectRepository, private mailService: MailService) {}

  // 프로젝트 생성
  async createProject(userId: number, dto: CreateProjectDto): Promise<ProjectDetailDto> {
    s.assert(dto, CreateProjectStruct);

    const count = await this.projectRepository.countOwnedProjectsByUserId(userId);
    if (count >= MAX_PROJECT_COUNT) throw new BadRequestError('최대 5개까지 생성 가능합니다.');

    const newProject = await this.projectRepository.createProject(
      userId,
      dto.name.trim(),
      dto.description.trim(),
    );

    return this.getProjectDetail(newProject.id, userId);
  }

  // 프로젝트 상세 조회
  async getProjectDetail(projectId: number, userId: number): Promise<ProjectDetailDto> {
    const projectDetail = await this.projectRepository.getProjectDetailData(projectId);
    if (!projectDetail) throw new NotFoundError();

    const isMember = await this.projectRepository.isMember(projectId, userId);
    if (!isMember) throw new ForbiddenError('프로젝트 멤버가 아닙니다');

    return projectDetail;
  }

  // 프로젝트 수정
  async updateProject(
    projectId: number,
    userId: number,
    dto: UpdateProjectDto,
  ): Promise<ProjectDetailDto> {
    s.assert(dto, UpdateProjectStruct);

    const project = await this.projectRepository.findProjectById(projectId);

    if (!project) throw new NotFoundError();
    if (project.ownerId !== userId) throw new ForbiddenError('프로젝트 관리자가 아닙니다');

    const name = dto.name?.trim();
    const description = dto.description?.trim();

    const hasNoValidName = dto.name !== undefined && !name;
    const hasNoValidDesc = dto.description !== undefined && !description;
    const isAllEmpty = dto.name === undefined && dto.description === undefined;

    if (hasNoValidName || hasNoValidDesc || isAllEmpty) {
      throw new BadRequestError('잘못된 데이터 형식');
    }

    await this.projectRepository.updateProject(projectId, { name, description });

    return this.getProjectDetail(projectId, userId);
  }

  // 프로젝트 삭제
  async deleteProject(projectId: number, userId: number): Promise<void> {
    if (!projectId || isNaN(projectId)) {
      throw new BadRequestError('잘못된 데이터 형식');
    }

    const project = (await this.projectRepository.findProjectById(
      projectId,
    )) as ProjectWithMembers | null;
    if (!project) throw new NotFoundError();

    if (project.ownerId !== userId) {
      throw new ForbiddenError('프로젝트 관리자가 아닙니다');
    }

    const memberEmails = project.projectMembers
      .map((member) => member.user?.email)
      .filter((email): email is string => !!email);

    await this.projectRepository.deleteProject(projectId);

    if (memberEmails.length > 0) {
      this.mailService.sendProjectDeletionEmail(memberEmails, project.name);
    }
  }
}
