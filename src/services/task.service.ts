import { ProjectMember, User } from '@prisma/client';
import { TaskDto } from '@/types/task.dto';
import { projectMemberRepository, taskRepository } from '../repositories/task.repository';
import { PaginationParams } from '../types/taskPagination';
import { NotFoundError, UnauthorizedError } from '@/lib';

type CreateTaskData = Omit<TaskDto, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>;
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

    const createData: CreateTaskData = {
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

    if (!taskFindById) {
      throw new NotFoundError();
    }

    return taskRepository.update(id, data);
  },

  async getTask(id: number, user: User | null | undefined) {
    if (!user) {
      throw new UnauthorizedError('로그인이 필요합니다.');
    }

    const taskFindById = await taskRepository.findById(id);

    if (!taskFindById) {
      throw new NotFoundError();
    }
    return taskFindById;
  },

  async getTaskList(params: PaginationParams, user: User | null | undefined) {
    if (!user) {
      throw new UnauthorizedError('로그인이 필요합니다.');
    }
    return taskRepository.findList(params);
  },

  async deleteTask(id: number, user: User | null | undefined) {
    if (!user) {
      throw new UnauthorizedError('로그인이 필요합니다.');
    }
    const taskFindById = await taskRepository.findById(id);

    if (!taskFindById) {
      throw new NotFoundError();
    }

    return taskRepository.delete(id);
  },
};

//이하는 projectMember를 찾는 임시 코드.
//차후에 merge할떄 project 폴더내에 있는 member코드를 활용할 예정
export const projectMemberService = {
  async getProjectMember(projectId: number, userId: number) {
    return projectMemberRepository.findByProject(projectId, userId);
  },
};
