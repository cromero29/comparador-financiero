import dotenv from 'dotenv';
import { z } from 'zod';

// Cargar variables de entorno
dotenv.config();

// Schema de validación
const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().transform(Number).default('4000'),
  
  DATABASE_URL: z.string().url(),
  
  JWT_SECRET: z.string().min(32),
  
  ALLOWED_ORIGINS: z.string().transform((val) => val.split(',')),
  
  SCRAPING_ENABLED: z.string().transform((val) => val === 'true').default('true'),
  SCRAPING_SCHEDULE: z.string().default('0 3 * * *'),
  SCRAPING_TIMEOUT: z.string().transform(Number).default('30000'),
  PUPPETEER_HEADLESS: z.string().transform((val) => val === 'true').default('true'),
  
  RATE_LIMIT_WINDOW_MS: z.string().transform(Number).default('900000'),
  RATE_LIMIT_MAX_REQUESTS: z.string().transform(Number).default('100'),
  
  LOG_LEVEL: z.string().default('info'),
  
  SENTRY_DSN: z.string().optional(),
});

// Validar y exportar
let env: z.infer<typeof envSchema>;

try {
  env = envSchema.parse(process.env);
} catch (error) {
  console.error('❌ Error en configuración de variables de entorno:');
  if (error instanceof z.ZodError) {
    console.error(error.errors);
  }
  process.exit(1);
}

export { env };
