import { Router } from 'express';
import { ReportesController } from '../controllers/ReportesController';
import { asyncHandler } from '../middleware/errorHandler';

const router = Router();
const reportesController = new ReportesController();

/**
 * GET /api/v1/reportes/resumen
 * Resumen general de actividad
 * Query params: ?dias=30 (últimos N días)
 */
router.get(
  '/resumen',
  asyncHandler(reportesController.getResumenGeneral.bind(reportesController))
);

/**
 * GET /api/v1/reportes/busquedas-detalle
 * Detalle de todas las búsquedas
 * Query params: ?dias=30&limite=100
 */
router.get(
  '/busquedas-detalle',
  asyncHandler(reportesController.getBusquedasDetalle.bind(reportesController))
);

/**
 * GET /api/v1/reportes/clics-por-entidad
 * Clics agrupados por entidad financiera
 * Query params: ?dias=30
 */
router.get(
  '/clics-por-entidad',
  asyncHandler(reportesController.getClicsPorEntidad.bind(reportesController))
);

/**
 * GET /api/v1/reportes/funnel-conversion
 * Funnel desde sesión hasta clic
 * Query params: ?dias=30
 */
router.get(
  '/funnel-conversion',
  asyncHandler(reportesController.getFunnelConversion.bind(reportesController))
);

/**
 * GET /api/v1/reportes/segmentacion
 * Segmentación por edad e ingresos
 * Query params: ?dias=30
 */
router.get(
  '/segmentacion',
  asyncHandler(reportesController.getSegmentacion.bind(reportesController))
);

export default router;
