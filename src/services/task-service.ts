import { User } from '@prisma/client';
import { CreateTaskInput, TaskParams, UpdateTaskInput } from '../superstructs/task-struct';
import { taskRepository } from '../repositories/task-repository';

export const taskService = {
  async createTask(data: CreateTaskInput, user: User | null | undefined) {
    if (!user) {
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
