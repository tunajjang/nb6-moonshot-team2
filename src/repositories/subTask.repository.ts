import { SubTask } from '@prisma/client';
import { prisma } from '@lib';

export const subTaskRepository = {
  create(data: Omit<SubTask, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>) {
    return prisma.subTask.create({ data });
  },

  findList(taskId: number) {
    return prisma.subTask.findMany({
      where: {
        taskId: taskId,
        deletedAt: null,
      },
    });
  },

  findById(subTaskId: number) {
    return prisma.subTask.findFirst({
      where: { id: subTaskId, deletedAt: null },
    });
  },

  findByIdWithAuth(subTaskId: number, userId: number) {
    return prisma.subTask.findFirst({
      where: {
        id: subTaskId,
        deletedAt: null,
        task: {
          project: {
            projectMembers: {
              some: {
                userId,
              },
            },
          },
        },
      },
      include: {
        task: {
          select: {
            project: { select: { id: true } },
          },
        },
      },
    });
  },

  update(data: Partial<SubTask>, id: number) {
    return prisma.subTask.update({
      where: { id },
      data,
    });
  },

  delete(id: number) {
    return prisma.subTask.update({ where: { id: id }, data: { deletedAt: new Date() } });
  },
};
