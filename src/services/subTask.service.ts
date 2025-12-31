import { ProjectMember, User } from '@prisma/client';
import { CreateSubTaskInput, UpdateSubTaskInput } from '../superstructs/subTask.struct';
import { subTaskRepository } from '../repositories/subTask.repository';

export const subTaskService = {
  async createSubTask(
    data: CreateSubTaskInput,
    user: User | null | undefined,
    projectMember: ProjectMember,
  ) {
    if (!user) {
      throw console.error('unauthorized');
    }

    if (user.id != projectMember.userId) {
      throw console.error('Unauthorized');
    }

    return subTaskRepository.create(data);
  },

  async updateSubTask(
    data: UpdateSubTaskInput,
    user: User | null | undefined,
    projectMember: ProjectMember,
    taskId: number,
  ) {
    if (!user) {
      throw console.error('unauthorized');
    }

    if (user.id != projectMember.userId) {
      throw console.error('Unauthorized');
    }

    return subTaskRepository.update(data, taskId);
  },

  async deleteSubTask(id: number, user: User | null | undefined, projectMember: ProjectMember) {
    if (!user) {
      throw console.error('unauthorized');
    }

    if (user.id != projectMember.userId) {
      throw console.error('Unauthorized');
    }

    return subTaskRepository.delete(id);
  },

  async getSubTaskList(
    taskId: number,
    user: User | null | undefined,
    projectMember: ProjectMember,
  ) {
    if (!user) {
      throw console.error('unauthorized');
    }

    if (user.id != projectMember.userId) {
      throw console.error('Unauthorized');
    }

    return subTaskRepository.findList(taskId);
  },

  async getSubTaskById(id: number, user: User | null | undefined, projectMember: ProjectMember) {
    if (!user) {
      throw console.error('unauthorized');
    }

    if (user.id != projectMember.userId) {
      throw console.error('Unauthorized');
    }

    return subTaskRepository.findById(id);
  },
};
