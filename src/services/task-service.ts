import { ProjectMember, User } from '@prisma/client';
import { CreateTaskInput, UpdateTaskInput } from '../superstructs/task-struct';
import { projectMemberRepository, taskRepository } from '../repositories/task-repository';
import { PaginationParams } from '../types/pagination';

export const taskService = {
  async createTask(
    data: CreateTaskInput,
    user: User | null | undefined,
    projectMember: ProjectMember,
  ) {
    if (!user) {
      throw console.error('Unauthorized');
    }

    if (user.id != projectMember.userId) {
      throw console.error('Unauthorized');
    }

    return taskRepository.create({
      ...data,
      assigneeId: user.id,
    });
  },

  async updateTask(data: UpdateTaskInput, id: number, user: User | null | undefined) {
    if (!user) {
      throw console.error('Unauthorized');
    }

    return taskRepository.update(id, data);
  },

  async getTask(id: number, user: User | null | undefined) {
    if (!user) {
      throw console.error('Unauthorized');
    }
    return taskRepository.findById(id);
  },

  async getTaskList(params: PaginationParams, user: User | null | undefined) {
    if (!user) {
      throw console.error('Unauthorized');
    }
    return taskRepository.findList(params);
  },

  async deleteTask(id: number, user: User | null | undefined) {
    if (!user) {
      throw console.error('Unauthorized');
    }
    return taskRepository.delete(id);
  },

  async getTaskDebug(id: number) {
    return taskRepository.findTaskDebug(id);
  },
};

//이하는 projectMember를 찾는 임시 코드.
//차후에 merge할떄 project 폴더내에 있는 member코드를 활용할 예정
export const projectMemberService = {
  async getProjectMember(projectId: number, userId: number) {
    return projectMemberRepository.findByProject(projectId, userId);
  },
};
