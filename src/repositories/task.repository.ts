import { prisma } from '@lib';
import { TaskStatus, Task } from '@prisma/client';
import { PaginationParams } from '../types/taskPagination';

export const taskRepository = {
  create(data: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>) {
    return prisma.task.create({ data });
  },

  findList({ page, limit, status, assigneeId, order, orderBy, keyword }: PaginationParams) {
    const where = {
      title: keyword ? { contains: keyword } : undefined,
      userId: assigneeId ? { equals: assigneeId } : undefined,
      status: status ? TaskStatus[status] : undefined,
    };

    const orderByMap = {
      created_at: 'createdAt',
      name: 'name',
      end_date: 'endDate',
    } as const;

    return prisma.task.findMany({
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { [orderByMap[orderBy]]: order },
      where,
    });
  },
  findById(id: number) {
    return prisma.task.findUnique({
      where: { id },
      include: {
        attachments: true,
      },
    });
  },
  update(id: number, data: Partial<Task>) {
    return prisma.task.update({ where: { id }, data });
  },
  delete(id: number) {
    return prisma.task.update({
      where: { id: id },
      data: {
        deletedAt: new Date(),
      },
    });
  },
};

//이하는 projectMember를 찾는 임시 코드.
//차후에 merge할떄 project 폴더내에 있는 member코드를 활용할 예정
export const projectMemberRepository = {
  findByProject(projectId: number, userId: number) {
    return prisma.projectMember.findUnique({
      where: {
        projectId_userId: {
          projectId,
          userId,
        },
      },
    });
  },
};
