import { Router } from 'express';
import { comparacionRoutes } from './comparacion.routes';
import { trackingRoutes } from './tracking.routes';
import { productoRoutes } from './producto.routes';
import { scraperRoutes } from './scraper.routes';
import { healthRoutes } from './health.routes';
import reportesRoutes from './reportes.routes';
import sesionRoutes from './sesion.routes';
import busquedaRoutes from './busqueda.routes';
import clicRoutes from './clic.routes';
import eventoRoutes from './evento.routes';

const router = Router();

// Rutas de la API
router.use('/comparacion', comparacionRoutes);
router.use('/tracking', trackingRoutes);
router.use('/productos', productoRoutes);
router.use('/scraper', scraperRoutes);
router.use('/health', healthRoutes);
router.use('/reportes', reportesRoutes);

// Rutas de tracking detallado
router.use('/sesion', sesionRoutes);
router.use('/busqueda', busquedaRoutes);
router.use('/clic', clicRoutes);
router.use('/evento', eventoRoutes);

export { router as apiRoutes };
