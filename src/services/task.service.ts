import { User } from '@prisma/client';
import { TaskDto } from '@/types/task.dto';
import { PaginationParams } from '../types/taskPagination';
import { ForbiddenError, NotFoundError, UnauthorizedError } from '@/lib';
import { taskRepository } from '@/repositories';

type CreateTaskData = Omit<
  TaskDto,
  'id' | 'createdAt' | 'updatedAt' | 'deletedAt' | 'projectId' | 'assigneeId'
>;
type UpdateTaskData = Partial<CreateTaskData>;

export const taskService = {
  async createTask(
    data: CreateTaskData,
    user: User | null | undefined,
    projectId: number,
  ): Promise<TaskDto> {
    if (!user) {
      throw new UnauthorizedError('로그인이 필요합니다.');
    }

    type CreateTaskDbData = CreateTaskData & {
      projectId: number;
      assigneeId: number;
    };

    const createData: CreateTaskDbData = {
      ...data,
      assigneeId: user.id,
      projectId: projectId,
    };

    return taskRepository.create(createData);
  },

  async updateTask(
    data: UpdateTaskData,
    id: number,
    user: User | null | undefined,
  ): Promise<TaskDto> {
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

    return taskRepository.update(id, data);
  },

  async getTask(id: number, user: User | null | undefined) {
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
    return taskFindByIdWithAuth;
  },

  async getTaskList(projectId: number, params: PaginationParams, user: User | null | undefined) {
    if (!user) {
      throw new UnauthorizedError('로그인이 필요합니다.');
    }
    const taskList = taskRepository.findList(projectId, params);
    if (!taskList) {
      throw new NotFoundError('Task 목록이 존재하지 않습니다');
    }
    return taskList;
  },

  async deleteTask(id: number, user: User | null | undefined) {
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
