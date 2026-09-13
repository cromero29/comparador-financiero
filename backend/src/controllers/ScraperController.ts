import { Request, Response } from 'express';
import { ScraperScheduler } from '../scrapers/ScraperScheduler';
import { ScraperOrchestrator } from '../scrapers/ScraperOrchestrator';
import { asyncHandler } from '../middleware/errorHandler';
import { logger } from '../config/logger';

export class ScraperController {
  private scheduler: ScraperScheduler;
  private orchestrator: ScraperOrchestrator;

  constructor() {
    this.scheduler = new ScraperScheduler();
    this.orchestrator = new ScraperOrchestrator();
  }

  /**
   * POST /api/v1/scraper/execute
   * Ejecutar scraping manualmente
   */
  execute = asyncHandler(async (req: Request, res: Response) => {
    logger.info('Request de scraping manual recibido');

    // Ejecutar scraping
    const resultado = await this.scheduler.executeNow();

    res.apiSuccess({
      mensaje: resultado.exitoso 
        ? 'Scraping completado exitosamente' 
        : 'Scraping completado con errores',
      resultado,
    });
  });

  /**
   * POST /api/v1/scraper/execute/:scraperConfigId
   * Ejecutar scraping para una entidad específica
   */
  executeOne = asyncHandler(async (req: Request, res: Response) => {
    const { scraperConfigId } = req.params;

    logger.info(`Request de scraping para config: ${scraperConfigId}`);

    const resultado = await this.orchestrator.scrapeEntidad(scraperConfigId);

    res.apiSuccess({
      mensaje: resultado.exitoso 
        ? 'Scraping completado exitosamente' 
        : 'Scraping falló',
      resultado,
    });
  });

  /**
   * GET /api/v1/scraper/estadisticas
   * Obtener estadísticas de scraping
   */
  getEstadisticas = asyncHandler(async (req: Request, res: Response) => {
    const dias = req.query.dias ? parseInt(req.query.dias as string) : 30;

    const estadisticas = await this.scheduler.getStats(dias);

    res.apiSuccess(estadisticas);
  });

  /**
   * GET /api/v1/scraper/status
   * Estado del scheduler
   */
  getStatus = asyncHandler(async (req: Request, res: Response) => {
    res.apiSuccess({
      scheduler: {
        activo: process.env.SCRAPING_ENABLED === 'true',
        schedule: process.env.SCRAPING_SCHEDULE,
      },
      ultimaEjecucion: 'Implementar tracking de última ejecución',
    });
  });
}
