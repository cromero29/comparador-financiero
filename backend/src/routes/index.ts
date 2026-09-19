import { Router } from 'express';
import { comparacionRoutes } from './comparacion.routes';
import { productoRoutes } from './producto.routes';
import { scraperRoutes } from './scraper.routes';
import { healthRoutes } from './health.routes';
import reportesRoutes from './reportes.routes';
import sesionRoutes from './sesion.routes';
import busquedaRoutes from './busqueda.routes';
import clicRoutes from './clic.routes';
import eventoRoutes from './evento.routes';
import { trackingLimiter } from '../middleware/security';

const router = Router();

// Rutas de la API
router.use('/comparacion', comparacionRoutes);
router.use('/productos', productoRoutes);
router.use('/scraper', scraperRoutes);
router.use('/health', healthRoutes);
router.use('/reportes', reportesRoutes);

// Rutas de tracking detallado (con rate limit específico anti-abuso)
router.use('/sesion', trackingLimiter, sesionRoutes);
router.use('/busqueda', trackingLimiter, busquedaRoutes);
router.use('/clic', trackingLimiter, clicRoutes);
router.use('/evento', trackingLimiter, eventoRoutes);

export { router as apiRoutes };
