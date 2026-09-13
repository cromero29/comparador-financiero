import { Router, Request, Response } from 'express';
import { testConnection } from '../config/database';
import { asyncHandler } from '../middleware/errorHandler';

const router = Router();

// GET /api/v1/health - Health check general
router.get('/', asyncHandler(async (req: Request, res: Response) => {
  const dbConnected = await testConnection();
  
  const health = {
    status: dbConnected ? 'healthy' : 'unhealthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV,
    database: dbConnected ? 'connected' : 'disconnected',
  };
  
  const statusCode = dbConnected ? 200 : 503;
  res.status(statusCode).json(health);
}));

export { router as healthRoutes };
