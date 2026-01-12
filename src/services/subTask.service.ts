import { SubTask, TaskStatus } from '@prisma/client';
import { subTaskRepository, taskRepository } from '@repositories';
import { ForbiddenError, NotFoundError, UnauthorizedError } from '@lib';

type CreateSubTaskData = Omit<
  SubTask,
  'id' | 'createdAt' | 'updatedAt' | 'deletedAt' | 'taskId' | 'status'
>;
type UpdateSubTaskData = Partial<CreateSubTaskData>;

export const subTaskService = {
  async createSubTask(
    data: CreateSubTaskData,
    user: AuthUser | null | undefined,
    taskId: number,
  ): Promise<SubTask> {
    if (!user) {
      throw new UnauthorizedError('로그인이 필요합니다.');
    }

    type CreateSubTaskDbData = CreateSubTaskData & {
      taskId: number;
      status: TaskStatus;
    };

    const parentTask = await taskRepository.findById(taskId);
    if (!parentTask) {
      throw new NotFoundError('부모 할일을 찾을 수 없습니다.');
    }

    const createData: CreateSubTaskDbData = {
      ...data,
      taskId: taskId,
      status: parentTask.status,
    };

    return subTaskRepository.create(createData);
  },

  async getSubTaskList(taskId: number, user: AuthUser | null | undefined) {
    if (!user) {
      throw new UnauthorizedError('로그인이 필요합니다.');
    }
    const { subTaskList, total } = await subTaskRepository.findList(taskId);

    const formetSubTaskList = (await subTaskList).map((subtask) => ({
      id: subtask.id,
      title: subtask.title,
      taskId: subtask.taskId,
      status: subtask.status === 'PENDING' ? 'todo' : subtask.status.toLocaleLowerCase(),
    }));
    return {
      data: formetSubTaskList,
      total: total,
    };
  },

  async updateSubTask(
    data: UpdateSubTaskData,
    user: AuthUser | null | undefined,
    subTaskId: number,
  ): Promise<SubTask> {
    if (!user) {
      throw new UnauthorizedError('로그인이 필요합니다.');
    }

    const subTaskFindById = await subTaskRepository.findById(subTaskId);
    if (!subTaskFindById) {
      throw new NotFoundError('');
    }

    const subTaskFindByIdWithAuth = await subTaskRepository.findByIdWithAuth(subTaskId, user.id);

    if (!subTaskFindByIdWithAuth) {
      throw new ForbiddenError('프로젝트 멤버가 아닙니다');
    }

    return subTaskRepository.update(data, subTaskId);
  },

  async deleteSubTask(subTaskId: number, user: AuthUser | null | undefined) {
    if (!user) {
      throw new UnauthorizedError('로그인이 필요합니다.');
    }

    const subTaskFindById = await subTaskRepository.findById(subTaskId);
    if (!subTaskFindById) {
      throw new NotFoundError('');
    }

    const subTaskFindByIdWithAuth = await subTaskRepository.findByIdWithAuth(subTaskId, user.id);

    if (!subTaskFindByIdWithAuth) {
      throw new ForbiddenError('프로젝트 멤버가 아닙니다');
    }

    return subTaskRepository.delete(subTaskId);
  },

  async getSubTask(subTaskId: number, user: AuthUser | null | undefined) {
    if (!user) {
      throw new UnauthorizedError('로그인이 필요합니다.');
    }

    const subTaskFindById = await subTaskRepository.findById(subTaskId);
    if (!subTaskFindById) {
      throw new NotFoundError('');
    }

    const subTaskFindByIdWithAuth = await subTaskRepository.findByIdWithAuth(subTaskId, user.id);

    if (!subTaskFindByIdWithAuth) {
      throw new ForbiddenError('프로젝트 멤버가 아닙니다');
    }

    const formattedSubTask = {
      id: subTaskFindByIdWithAuth.id,
      title: subTaskFindByIdWithAuth.title,
      taskId: subTaskFindByIdWithAuth.taskId,
      status:
        subTaskFindByIdWithAuth.status === 'PENDING'
          ? 'todo'
          : subTaskFindByIdWithAuth.status.toLocaleLowerCase(),
      createdAt: subTaskFindByIdWithAuth.createdAt,
      updatedAt: subTaskFindByIdWithAuth.updatedAt,
    };

    return formattedSubTask;
  },
};
