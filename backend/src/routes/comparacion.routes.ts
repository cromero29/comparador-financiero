import { Router } from 'express';
import { ComparacionController } from '../controllers/ComparacionController';
import { comparacionLimiter } from '../middleware/security';

const router = Router();
const controller = new ComparacionController();

// POST /api/v1/comparacion - Comparar ofertas
router.post('/', comparacionLimiter, controller.comparar);

// GET /api/v1/comparacion/health - Health check
router.get('/health', controller.health);

export { router as comparacionRoutes };
