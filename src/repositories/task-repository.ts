import { prisma } from '../lib/prisma';
import { CreateTaskInput, UpdateTaskInput, TaskParams } from '../superstructs/task-superstruct';

export const taskRepository = {
  create(data: CreateTaskInput) {
    return prisma.task.create({ data });
  },
  findList(params: TaskParams) {
    return prisma.task.findMany({
      skip,
      take,
      orderBy,
      where,
    });
  },
  findById(id: number) {
    return prisma.task.findUnique({ where: { id } });
  },
  update(id: number, data: UpdateTaskInput) {
    return prisma.task.update({ where: { id }, data });
  },
  delete(id: number) {
    return prisma.task.delete({ where: { id } });
  },
};
