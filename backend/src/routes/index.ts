import { Router } from 'express';
import { comparacionRoutes } from './comparacion.routes';
import { trackingRoutes } from './tracking.routes';
import { productoRoutes } from './producto.routes';
import { scraperRoutes } from './scraper.routes';
import { healthRoutes } from './health.routes';

const router = Router();

// Rutas de la API
router.use('/comparacion', comparacionRoutes);
router.use('/tracking', trackingRoutes);
router.use('/productos', productoRoutes);
router.use('/scraper', scraperRoutes);
router.use('/health', healthRoutes);

export { router as apiRoutes };
