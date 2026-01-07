import { User } from '@prisma/client';
import { subTaskRepository } from '../repositories/subTask.repository';
import { ForbiddenError, NotFoundError, UnauthorizedError } from '@/lib';
import { SubTaskDto } from '@/types/subTask.dto';

type CreateSubTaskData = Omit<
  SubTaskDto,
  'id' | 'createdAt' | 'updatedAt' | 'deletedAt' | 'taskId'
>;
type UpdateSubTaskData = Partial<CreateSubTaskData>;

export const subTaskService = {
  async createSubTask(
    data: CreateSubTaskData,
    user: User | null | undefined,
    taskId: number,
  ): Promise<SubTaskDto> {
    if (!user) {
      throw new UnauthorizedError('로그인이 필요합니다.');
    }

    type CreateSubTaskDbData = CreateSubTaskData & {
      taskId: number;
    };

    const createData: CreateSubTaskDbData = {
      ...data,
      taskId: taskId,
    };

    return subTaskRepository.create(createData);
  },

  async getSubTaskList(taskId: number, user: User | null | undefined) {
    if (!user) {
      throw new UnauthorizedError('로그인이 필요합니다.');
    }
    const subTaskList = subTaskRepository.findList(taskId);
    return subTaskList;
  },

  async updateSubTask(
    data: UpdateSubTaskData,
    user: User | null | undefined,
    subTaskId: number,
  ): Promise<SubTaskDto> {
    if (!user) {
      throw new UnauthorizedError('로그인이 필요합니다.');
    }

    const subTaskFindById = await subTaskRepository.findById(subTaskId);
    const subTaskFindByIdWithAuth = await subTaskRepository.findByIdWithAuth(subTaskId, user.id);

    if (!subTaskFindById) {
      throw new NotFoundError('존재하지 않는 Task번호입니다.');
    }

    if (!subTaskFindByIdWithAuth) {
      throw new ForbiddenError('프로젝트 멤버가 아닙니다');
    }

    return subTaskRepository.update(data, subTaskId);
  },

  async deleteSubTask(subTaskId: number, user: User | null | undefined) {
    if (!user) {
      throw new UnauthorizedError('로그인이 필요합니다.');
    }

    const subTaskFindById = await subTaskRepository.findById(subTaskId);
    const subTaskFindByIdWithAuth = await subTaskRepository.findByIdWithAuth(subTaskId, user.id);

    if (!subTaskFindById) {
      throw new NotFoundError('존재하지 않는 Task번호입니다.');
    }

    if (!subTaskFindByIdWithAuth) {
      throw new ForbiddenError('프로젝트 멤버가 아닙니다');
    }

    return subTaskRepository.delete(subTaskId);
  },

  async getSubTask(subTaskId: number, user: User | null | undefined) {
    if (!user) {
      throw new UnauthorizedError('로그인이 필요합니다.');
    }
    const subTaskFindById = await subTaskRepository.findById(subTaskId);
    const subTaskFindByIdWithAuth = await subTaskRepository.findByIdWithAuth(subTaskId, user.id);

    if (!subTaskFindById) {
      throw new NotFoundError('존재하지 않는 Task번호입니다.');
    }

    if (!subTaskFindByIdWithAuth) {
      throw new ForbiddenError('프로젝트 멤버가 아닙니다');
    }

    return subTaskFindByIdWithAuth;
  },
};
