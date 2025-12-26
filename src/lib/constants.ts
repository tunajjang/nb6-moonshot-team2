import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const PORT = process.env.PORT || 3000;

export { prisma, PORT };
