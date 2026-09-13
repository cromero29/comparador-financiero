import express, { Application } from 'express';
import cookieParser from 'cookie-parser';
import { env } from './config/env';
import { logger } from './config/logger';
import { testConnection } from './config/database';
import { securityHeaders, corsOptions, generalLimiter } from './middleware/security';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import { requestLogger, responseMetadata } from './middleware/logging';
import { apiRoutes } from './routes';

// Crear aplicación Express
const app: Application = express();

// ============================================
// MIDDLEWARE GLOBAL
// ============================================

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Cookie parsing
app.use(cookieParser());

// Security headers
app.use(securityHeaders);

// CORS
app.use(corsOptions);

// Rate limiting
app.use('/api/', generalLimiter);

// Request logging
app.use(requestLogger);

// Response metadata helper
app.use(responseMetadata);

// ============================================
// RUTAS
// ============================================

// API v1
app.use('/api/v1', apiRoutes);

// Ruta raíz
app.get('/', (req, res) => {
  res.json({
    name: 'Comparador Financiero API',
    version: '1.0.0',
    status: 'running',
    docs: '/api/v1/health',
  });
});

// ============================================
// ERROR HANDLING
// ============================================

// 404 handler
app.use(notFoundHandler);

// Error handler global
app.use(errorHandler);

// ============================================
// SERVER STARTUP
// ============================================

async function startServer() {
  try {
    // Test database connection
    logger.info('Verificando conexión a base de datos...');
    const dbConnected = await testConnection();
    
    if (!dbConnected) {
      throw new Error('No se pudo conectar a la base de datos');
    }

    // Start server
    const PORT = env.PORT || 4000;
    
    app.listen(PORT, () => {
      logger.info('='.repeat(50));
      logger.info(`🚀 Servidor iniciado correctamente`);
      logger.info(`📡 Puerto: ${PORT}`);
      logger.info(`🌍 Entorno: ${env.NODE_ENV}`);
      logger.info(`📚 API: http://localhost:${PORT}/api/v1`);
      logger.info(`❤️  Health: http://localhost:${PORT}/api/v1/health`);
      logger.info('='.repeat(50));
    });

  } catch (error) {
    logger.error('❌ Error al iniciar servidor:', error);
    process.exit(1);
  }
}

// Iniciar servidor
startServer();

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM recibido. Cerrando servidor...');
  process.exit(0);
});

process.on('SIGINT', () => {
  logger.info('SIGINT recibido. Cerrando servidor...');
  process.exit(0);
});

export { app };
