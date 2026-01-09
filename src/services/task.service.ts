import { Project, Task, TaskStatus } from '@prisma/client';
import { PaginationParams, GetTaskListArgs } from '@types';
import { ForbiddenError, NotFoundError, UnauthorizedError } from '@lib';
import { taskRepository } from '@repositories';
import { MemberService } from '@services';

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

    type CreateTaskDbData = CreateTaskData & {
      projectId: number;
      assigneeId: number;
    };

    const createData: CreateTaskDbData = {
      ...data,
      assigneeId,
      projectId: projectId,
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
      throw new NotFoundError('존재하지 않는 Task번호입니다.');
    }

    if (!taskFindByIdWithAuth) {
      throw new ForbiddenError('프로젝트 멤버가 아닙니다');
    }

    // 담당자 변경 시 프로젝트 멤버인지 확인
    if (data.assigneeId !== undefined) {
      const memberService = new MemberService();
      await memberService.validateAssignee(taskFindById.projectId, data.assigneeId);
    }

    return taskRepository.update(id, data);
  },

  async getTask(id: number, user: AuthUser | null | undefined) {
    if (!user) {
      throw new UnauthorizedError('로그인이 필요합니다.');
    }
    //const taskFindById = await taskRepository.findById(id);
    const taskFindByIdWithAuth = await taskRepository.findByIdWithAuth(id, user.id);

    // if (!taskFindById) {
    //   throw new NotFoundError('존재하지 않는 Task번호입니다.');
    // }

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

    // const taskList = await taskRepository.findList(projectId, params);
    // if (!taskList) {
    //   throw new NotFoundError('Task 목록이 존재하지 않습니다');
    // }
    const { tasks, total } = await taskRepository.findList(projectId, params);

    const formattedTasks = tasks.map((task) => ({
      id: task.id,
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
    const taskFindByIdWithAuth = await taskRepository.findByIdWithAuth(id, user.id);

    if (!taskFindById) {
      throw new NotFoundError('존재하지 않는 Task번호입니다.');
    }

    if (!taskFindByIdWithAuth) {
      throw new ForbiddenError('프로젝트 멤버가 아닙니다');
    }

    return taskRepository.delete(id);
  },
};
