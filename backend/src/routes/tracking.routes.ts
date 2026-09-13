import { Router } from 'express';
import { TrackingController } from '../controllers/TrackingController';

const router = Router();
const controller = new TrackingController();

// POST /api/v1/tracking/evento - Registrar evento
router.post('/evento', controller.trackEvento);

// POST /api/v1/tracking/clic - Registrar clic (CPC)
router.post('/clic', controller.trackClic);

// GET /api/v1/tracking/metricas/conversion - Métricas de conversión
router.get('/metricas/conversion', controller.getMetricasConversion);

// GET /api/v1/tracking/metricas/cpc - Métricas CPC
router.get('/metricas/cpc', controller.getMetricasCPC);

// GET /api/v1/tracking/top-productos - Top productos
router.get('/top-productos', controller.getTopProductos);

export { router as trackingRoutes };
