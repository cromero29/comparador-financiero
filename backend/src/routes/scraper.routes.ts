import { Router } from 'express';
import { ScraperController } from '../controllers/ScraperController';
import { scrapingLimiter } from '../middleware/security';

const router = Router();
const controller = new ScraperController();

// POST /api/v1/scraper/execute - Ejecutar scraping completo
router.post('/execute', scrapingLimiter, controller.execute);

// POST /api/v1/scraper/execute/:scraperConfigId - Ejecutar scraping de una entidad
router.post('/execute/:scraperConfigId', scrapingLimiter, controller.executeOne);

// GET /api/v1/scraper/estadisticas - Estadísticas
router.get('/estadisticas', controller.getEstadisticas);

// GET /api/v1/scraper/status - Estado del scheduler
router.get('/status', controller.getStatus);

export { router as scraperRoutes };
