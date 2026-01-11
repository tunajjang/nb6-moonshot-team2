import { ProjectRepository } from '@repositories';
import { NotFoundError, BadRequestError, ForbiddenError } from '@lib';
import { CreateProjectDto, ProjectDetailDto, UpdateProjectDto, ProjectWithMembers } from '@types';
import * as s from 'superstruct';
import { CreateProjectStruct, UpdateProjectStruct } from '@superstructs';
import { MailService } from '@services';
//구글 캘린더
import { google } from 'googleapis';
const auth = new google.auth.GoogleAuth({
  keyFile: 'path/to/your/service-account-key.json',
  scopes: ['https://www.googleapis.com/auth/calendar'],
});
const calendar = google.calendar({ version: 'v3', auth });

// 유저당 최대 5개의 프로젝트만 생성 가능
const MAX_PROJECT_COUNT = 5;

export class ProjectService {
  constructor(private projectRepository: ProjectRepository, private mailService: MailService) {}

  // 프로젝트 생성
  async createProject(userId: number, dto: CreateProjectDto): Promise<ProjectDetailDto> {
    s.assert(dto, CreateProjectStruct);

    const count = await this.projectRepository.countOwnedProjectsByUserId(userId);
    if (count >= MAX_PROJECT_COUNT) throw new BadRequestError('최대 5개까지 생성 가능합니다.');

    //구글 캘린더 생성 및 연동 코드
    let googleCalendarId: string | null | undefined = null;
    try {
      const googleRes = await calendar.calendars.insert({
        requestBody: {
          summary: `[Project] ${dto.name.trim()}`,
          description: dto.description?.trim() || '프로젝트 공용 캘린더',
          timeZone: 'Asia/Seoul',
        },
      });
      googleCalendarId = googleRes.data.id;
    } catch (error) {
      // 캘린더 생성 실패 시 로그는 남기되, 프로젝트 생성 자체를 막을지는 정책에 따라 결정
      console.error('Google Calendar Creation Failed:', error);
      // throw new InternalServerError('구글 캘린더 생성에 실패했습니다.'); // 실패 시 중단하고 싶다면 주석 해제
    }

    //

    const newProject = await this.projectRepository.createProject(
      userId,
      dto.name.trim(),
      dto.description.trim(),
      googleCalendarId,
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

    if (Object.keys(dto).length === 0) {
      throw new BadRequestError('잘못된 데이터 형식');
    }

    const project = await this.projectRepository.findProjectById(projectId);

    if (!project) throw new NotFoundError();
    if (project.ownerId !== userId) throw new ForbiddenError('프로젝트 관리자가 아닙니다');

    const updateData = {
      name: dto.name?.trim(),
      description: dto.description?.trim(),
    };

    await this.projectRepository.updateProject(projectId, updateData);

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
