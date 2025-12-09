import { PrismaClient } from '../../prisma/generated/client/index.js';

declare global {
  var prisma: PrismaClient | undefined;
}

export const prisma = global.prisma || new PrismaClient();

if (Bun.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}

export * from '../../prisma/generated/client/index.js';
export default prisma;
