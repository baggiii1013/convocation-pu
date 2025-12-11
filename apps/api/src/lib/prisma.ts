import { PrismaClient } from '../../prisma/generated/client/index.js';

declare global {
  var prisma: PrismaClient | undefined;
}

// Connection pool configuration for high-traffic scenarios
// With 18 workers, each worker gets ~55 connections = 1000 total connections
export const prisma = global.prisma || new PrismaClient({
  datasources: {
    db: {
      url: `${Bun.env.DATABASE_URL}`
    }
  },
  log: Bun.env.NODE_ENV === 'development' 
    ? ['query', 'error', 'warn'] 
    : ['error'],
});

if (Bun.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}

export * from '../../prisma/generated/client/index.js';
export default prisma;
