import { prisma } from '../lib/prisma';
import { CreateSubTaskInput, UpdateSubTaskInput } from '../superstructs/subtask.struct';

export const subTaskRepository = {
  create(data: CreateSubTaskInput) {
    return prisma.subTask.create({ data });
  },

  findList(taskId: number) {
    return prisma.subTask.findMany({
      where: {
        taskId: taskId,
      },
    });
  },

  findById(id: number) {
    return prisma.subTask.findUnique({
      where: { id },
    });
  },
  update(data: UpdateSubTaskInput, id: number) {
    return prisma.subTask.update({
      where: { id },
      data,
    });
  },
  delete(id: number) {
    return prisma.subTask.delete({ where: { id } });
  },
};
