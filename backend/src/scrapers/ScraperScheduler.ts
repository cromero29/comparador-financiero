import cron from 'node-cron';
import { ScraperOrchestrator } from './ScraperOrchestrator';
import { logger } from '../config/logger';
import { env } from '../config/env';

export class ScraperScheduler {
  private orchestrator: ScraperOrchestrator;
  private task?: cron.ScheduledTask;

  constructor() {
    this.orchestrator = new ScraperOrchestrator();
  }

  /**
   * Iniciar scheduler
   */
  start() {
    if (!env.SCRAPING_ENABLED) {
      logger.info('⏸️  Scraping deshabilitado (SCRAPING_ENABLED=false)');
      return;
    }

    const schedule = env.SCRAPING_SCHEDULE; // "0 3 * * *" = Diario a las 3 AM

    logger.info(`⏰ Scheduler de scraping iniciado: ${schedule}`);

    this.task = cron.schedule(schedule, async () => {
      logger.info('🔔 Ejecutando scraping programado...');
      
      try {
        const resultado = await this.orchestrator.scrapeAll();
        
        if (resultado.exitoso) {
          logger.info('✅ Scraping programado completado exitosamente');
        } else {
          logger.warn(`⚠️  Scraping completado con ${resultado.errores.length} errores`);
        }
      } catch (error) {
        logger.error('❌ Error en scraping programado:', error);
      }
    });

    logger.info('✅ Scheduler activo');
  }

  /**
   * Detener scheduler
   */
  stop() {
    if (this.task) {
      this.task.stop();
      logger.info('🛑 Scheduler de scraping detenido');
    }
  }

  /**
   * Ejecutar scraping manualmente (on-demand)
   */
  async executeNow() {
    logger.info('▶️  Ejecutando scraping manual...');
    return this.orchestrator.scrapeAll();
  }

  /**
   * Obtener estadísticas
   */
  async getStats(dias: number = 30) {
    return this.orchestrator.getEstadisticas(dias);
  }
}
