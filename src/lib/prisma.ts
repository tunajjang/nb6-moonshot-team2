import { PrismaClient, TaskStatus } from '@prisma/client';

export const prisma = new PrismaClient();

export const taskStatus = TaskStatus;
