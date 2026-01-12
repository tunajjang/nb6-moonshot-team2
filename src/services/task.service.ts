import { Project, Task, TaskStatus } from '@prisma/client';
import { PaginationParams, GetTaskListArgs } from '@types';
import { ForbiddenError, NotFoundError, UnauthorizedError } from '@lib';
import { taskRepository } from '@repositories';
import { MemberService } from '@services';


import { JWT } from 'google-auth-library';
import { calendar as googleCalendar } from '@googleapis/calendar';
import { GoogleCalendarError } from '@/lib/errors/google.error';

// 1. 인증 객체 생성 (JWT 클래스 직접 사용)
const authClient = new JWT({
  email: process.env.GOOGLE_CLIENT_EMAIL,
  // .env의 \n 문자를 실제 줄바꿈으로 치환해줘야 인증 에러가 나지 않습니다.
  key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  scopes: ['https://www.googleapis.com/auth/calendar'],
});

// 2. 캘린더 인스턴스 생성
// google.calendar() 대신 임포트한 googleCalendar() 함수를 사용합니다.
const calendar = googleCalendar({ 
  version: 'v3', 
  auth: authClient 
});

type CreateTaskData = Omit<
  Task,
  'id' | 'createdAt' | 'updatedAt' | 'deletedAt' | 'projectId' | 'assigneeId'
> & { tags?: string[]; attachments?: string[]; assigneeId?: number };
type UpdateTaskData = Partial<CreateTaskData & { assigneeId?: number }>;

export const taskService = {
  async createTask(
    data: CreateTaskData,
    user: AuthUser | null | undefined,
    projectId: number,
  ): Promise<Task> {
    if (!user) {
      throw new UnauthorizedError('로그인이 필요합니다.');
    }

    const memberService = new MemberService();

    // 담당자 지정 시 프로젝트 멤버인지 확인
    const assigneeId = data.assigneeId ?? user.id;
    if (data.assigneeId) {
      await memberService.validateAssignee(projectId, assigneeId);
    }

    const statusMap: Record<string, 'PENDING' | 'IN_PROGRESS' | 'DONE'> = {
      todo: 'PENDING',
      in_progress: 'IN_PROGRESS',
      done: 'DONE',
    };

    const backendMappingStatus = statusMap[data.status];

    type CreateTaskDbData = CreateTaskData & {
      projectId: number;
      assigneeId: number;
    };

    const createData: CreateTaskDbData = {
      ...data,
      assigneeId,
      projectId: projectId,
      status: backendMappingStatus,
    };

    return taskRepository.create(createData);
  },

  async updateTask(
    data: UpdateTaskData,
    id: number,
    user: AuthUser | null | undefined,
  ): Promise<Task> {
    if (!user) {
      throw new UnauthorizedError('로그인이 필요합니다.');
    }

    const taskFindById = await taskRepository.findById(id);
    const taskFindByIdWithAuth = await taskRepository.findByIdWithAuth(id, user.id);

    if (!taskFindById) {
      throw new NotFoundError('');
    }

    if (!taskFindByIdWithAuth) {
      throw new ForbiddenError('프로젝트 멤버가 아닙니다');
    }

    // 담당자 변경 시 프로젝트 멤버인지 확인
    if (data.assigneeId !== undefined) {
      const memberService = new MemberService();
      await memberService.validateAssignee(taskFindById.projectId, data.assigneeId);
    }

    const updateStatusMap: Record<string, any> = {
      todo: 'PENDING',
      in_progress: 'IN_PROGRESS',
      done: 'DONE',
    };
    const dbData = { ...data };
    if (data.status && updateStatusMap[data.status]) {
      dbData.status = updateStatusMap[data.status];
    }

    return taskRepository.update(id, dbData);
  },

  async getTask(id: number, user: AuthUser | null | undefined) {
    if (!user) {
      throw new UnauthorizedError('로그인이 필요합니다.');
    }
    const taskFindById = await taskRepository.findById(id);
    if (!taskFindById) {
      throw new NotFoundError('');
    }
    const taskFindByIdWithAuth = await taskRepository.findByIdWithAuth(id, user.id);

    if (!taskFindByIdWithAuth) {
      throw new ForbiddenError('프로젝트 멤버가 아닙니다');
    }

    const formattedTask = {
      id: taskFindByIdWithAuth.id,
      projectId: taskFindByIdWithAuth.projectId,
      title: taskFindByIdWithAuth.title,
      startYear: taskFindByIdWithAuth.startYear,
      startMonth: taskFindByIdWithAuth.startMonth,
      startDay: taskFindByIdWithAuth.startDay,
      endYear: taskFindByIdWithAuth.endYear,
      endMonth: taskFindByIdWithAuth.endMonth,
      endDay: taskFindByIdWithAuth.endDay,
      status:
        taskFindByIdWithAuth.status === 'PENDING'
          ? 'todo'
          : taskFindByIdWithAuth.status.toLocaleLowerCase(),

      assignee: taskFindByIdWithAuth.assignee
        ? {
            id: taskFindByIdWithAuth.assignee.id,
            name: taskFindByIdWithAuth.assignee.name,
            email: taskFindByIdWithAuth.assignee.email,
            profileImage: taskFindByIdWithAuth.assignee.profileImage,
          }
        : null,
      tags: taskFindByIdWithAuth.taskTags.map((tt) => ({
        id: tt.tag.id,
        name: tt.tag.name,
      })),
      attachments: taskFindByIdWithAuth.attachments.map((a) => a.url),

      createdAt: taskFindByIdWithAuth.createdAt,
      updatedAt: taskFindByIdWithAuth.updatedAt,
    };

    return formattedTask;
  },

  async getTaskList(
    projectId: Project['id'],
    args: GetTaskListArgs,
    user: AuthUser | null | undefined,
  ) {
    if (!user) {
      throw new UnauthorizedError('로그인이 필요합니다.');
    }

    let status: TaskStatus | undefined;
    if (args.status === 'todo') status = TaskStatus.PENDING;
    else if (args.status === 'in_progress') status = TaskStatus.IN_PROGRESS;
    else if (args.status === 'done') status = TaskStatus.DONE;

    const params: PaginationParams = {
      page: args.page,
      limit: args.limit,
      status,
      assigneeId: args.assignee,
      keyword: args.keyword,
      order: args.order,
      orderBy: args.order_by as PaginationParams['orderBy'],
    };

    const taskList = await taskRepository.findList(projectId, params);
    if (!taskList) {
      throw new NotFoundError('');
    }
    const { tasks, total } = await taskRepository.findList(projectId, params);

    const formattedTasks = tasks.map((task) => ({
      projectId: task.projectId,
      title: task.title,
      startYear: task.startYear,
      startMonth: task.startMonth,
      startDay: task.startDay,
      endYear: task.endYear,
      endMonth: task.endMonth,
      endDay: task.endDay,
      status: task.status === 'PENDING' ? 'todo' : task.status.toLocaleLowerCase(),

      assignee: task.assignee
        ? {
            id: task.assignee.id,
            name: task.assignee.name,
            email: task.assignee.email,
            profileImage: task.assignee.profileImage,
          }
        : null,
      tags: task.taskTags.map((tt) => ({
        id: tt.tag.id,
        name: tt.tag.name,
      })),
      attachments: task.attachments.map((a) => a.url),

      createdAt: task.createdAt,
      updatedAt: task.updatedAt,
    }));

    return {
      data: formattedTasks,
      total: total,
    };
  },

  async deleteTask(id: number, user: AuthUser | null | undefined) {
    if (!user) {
      throw new UnauthorizedError('로그인이 필요합니다.');
    }

    const taskFindById = await taskRepository.findById(id);
    if (!taskFindById) {
      throw new NotFoundError('');
    }
    const taskFindByIdWithAuth = await taskRepository.findByIdWithAuth(id, user.id);

    if (!taskFindByIdWithAuth) {
      throw new ForbiddenError('프로젝트 멤버가 아닙니다');
    }

    return taskRepository.delete(id);
  },

  //구글 캘린더 연동
  //task 담당자의 계정 email이 gmail일 시 구글에서 담당자의 계정에 task가 캘린더에 반영되도록 만듬

  async assignTaskToUser(taskId: number, assigneeId: number) {
    const task = await taskRepository.findByIdWithAuth(taskId, assigneeId);
    if (!task) {
      throw new NotFoundError('');
    }

    const assigneeEmail = task.assignee.email;

    if (assigneeEmail.endsWith('@gmail.com')) {
      try {
        const startDate = `${task.startYear}-${String(task.startMonth).padStart(2, '0')}-${String(
          task.startDay,
        ).padStart(2, '0')}`;
        //구글 날짜 규칙에 따라 끝나는 날에는 +1을 해줘야 원하는 식으로 나타남
        const endDay = task.endDay + 1;
        const endDate = `${task.endYear}-${String(task.endMonth).padStart(2, '0')}-${String(
          endDay,
        ).padStart(2, '0')}`;

        //구글 캘린더 API 호출
        await calendar.events.insert({
          calendarId: 'primary',
          sendUpdates: 'all',
          requestBody: {
            summary: `[할 일] ${task.title}`,
            start: {
              date: startDate,
            },
            end: {
              date: endDate,
            },
            //attendees: [{ email: assigneeEmail }],
          },
        });
      } catch (err: any) {
        console.error('Google API Detail: ', err.response?.data || err.message);
        throw new GoogleCalendarError();
      }
    }
  },
};
