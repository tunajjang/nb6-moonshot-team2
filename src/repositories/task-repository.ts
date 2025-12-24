import { prisma } from '../lib/prisma';
import { CreateTaskInput, UpdateTaskInput, TaskParams } from '../superstructs/task-struct';

export const taskRepository = {
  create(data: CreateTaskInput) {
    return prisma.task.create({ data });
  },
  findList({ page, limit, status, assigneeId, order, orderBy, keyword }: TaskParams) {
    return prisma.task.findMany({});
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
  findTaskDebug(id: number) {
    return prisma.task.findUnique({ where: { id } });
  },
};
