import { PrismaClient } from '@prisma/client';
import { logger } from './logger';

// Singleton de Prisma Client
const prismaClientSingleton = () => {
  return new PrismaClient({
    log: [
      { level: 'query', emit: 'event' },
      { level: 'error', emit: 'stdout' },
      { level: 'warn', emit: 'stdout' },
    ],
  });
};

declare global {
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>;
}

const prisma = globalThis.prisma ?? prismaClientSingleton();

// Logging de queries (solo en desarrollo)
if (process.env.NODE_ENV === 'development') {
  prisma.$on('query', (e: any) => {
    logger.debug('Query:', {
      query: e.query,
      params: e.params,
      duration: `${e.duration}ms`,
    });
  });
}

if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = prisma;
}

// Función para verificar conexión
export async function testConnection(): Promise<boolean> {
  try {
    await prisma.$queryRaw`SELECT 1`;
    logger.info('✅ Conexión a base de datos exitosa');
    return true;
  } catch (error) {
    logger.error('❌ Error conectando a base de datos:', error);
    return false;
  }
}

// Función para desconectar (útil para tests y shutdown)
export async function disconnect(): Promise<void> {
  await prisma.$disconnect();
  logger.info('Base de datos desconectada');
}

export { prisma };
