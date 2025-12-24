import { User } from '@prisma/client';
import { CreateTaskInput, TaskParams } from '../superstructs/task-superstruct';
import { taskRepository } from '../repositories/task-repository';

export const taskService = {
  async createTask(data: CreateTaskInput, user: User | null) {
    if (!user) {
      throw console.error('Unauthorized');
    }

    return taskRepository.create({
      ...data,
      assigneeId: user.id,
    });
  },
  async getListTask(params: TaskParams) {
    const where = {
      title: params.keyword ? { contains: params.keyword } : undefined,
      status: params.status ? { equals: params.status } : undefined,
      assigneeId: params.assigneeId ? { equals: params.assigneeId } : undefined,
    };
  },

  async getTask(id: number, user: User | null) {
    if (!user) {
      throw console.error('Unauthorized');
    }
  },
};
