import { prisma } from '@lib';
import { Prisma, TaskStatus, Task } from '@prisma/client';
import { PaginationParams } from '@types';

export const taskRepository = {
  create(
    data: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'> & {
      attachments?: string[];
    } & { tags?: string[] },
  ) {
    const { attachments, tags, ...restData } = data;
    return prisma.task.create({
      data: {
        ...restData,
        // 1. 첨부파일 처리
        ...(attachments && {
          attachments: {
            create: attachments.map((file: string) => ({
              url: `/uploads/${file}`,
              title: file,
              fileName: file,
            })),
          },
        }),
        // 2. 태그 처리
        ...(tags && {
          taskTags: {
            create: tags.map((tagName: string) => ({
              tag: {
                connectOrCreate: { where: { name: tagName }, create: { name: tagName } },
              },
            })),
          },
        }),
      } as Prisma.TaskUncheckedCreateInput,
    });
  },

  findList(
    projectId: number,
    { page, limit, status, assigneeId, order, orderBy, keyword }: PaginationParams,
  ) {
    const where = {
      projectId,
      deletedAt: null,
      title: keyword ? { contains: keyword } : undefined,
      assigneeId: assigneeId ? { equals: assigneeId } : undefined,
      status: status ? TaskStatus[status] : undefined,
    };

    const orderByMap = {
      created_at: 'createdAt',
      name: 'title',
      end_date: 'endYear',
    } as const;

    return prisma.task.findMany({
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { [orderByMap[orderBy]]: order },
      where,
    });
  },

  findById(taskId: number) {
    return prisma.task.findFirst({
      where: {
        id: taskId,
        deletedAt: null,
      },
    });
  },

  findByIdWithAuth(taskId: number, userId: number) {
    return prisma.task.findFirst({
      where: {
        id: taskId,
        deletedAt: null,
        project: {
          projectMembers: {
            some: {
              userId,
            },
          },
        },
      },
      include: {
        attachments: true,
        taskTags: {
          include: {
            tag: true,
          },
        },
        project: { select: { id: true } },
      },
    });
  },
  update(
    id: number,
    data: Partial<Task> & {
      attachments?: string[];
    } & { tags?: string[] },
  ) {
    const { attachments, tags, ...restData } = data;
    return prisma.task.update({
      where: { id },
      data: {
        ...restData,
        // 1. 첨부파일 업데이트 - 배열을 초기화 후 다시 넣는 식
        ...(attachments && {
          attachments: {
            //배열 먼저 초기화
            deleteMany: {},
            //이후 다시 생성
            create: attachments.map((file: string) => ({
              url: `/uploads/${file}`,
              title: file,
              fileName: file,
            })),
          },
        }),
        // 2. 태그 업데이트 - 배열을 초기화 후 다시 넣는 식
        ...(tags && {
          taskTags: {
            //배열 먼저 초기화
            deleteMany: {},
            //이후 다시 생성
            create: tags.map((tagName: string) => ({
              tag: {
                connectOrCreate: { where: { name: tagName }, create: { name: tagName } },
              },
            })),
          },
        }),
      } as Prisma.TaskUncheckedCreateInput,
    });
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
