import { prisma } from '../config/database';
import { ScraperEngine } from './ScraperEngine';
import { logger } from '../config/logger';
import { ProductoRepository } from '../repositories/ProductoRepository';
import { ScraperResult } from '../types';
import { TipoProducto } from '@prisma/client';

export class ScraperOrchestrator {
  private engine: ScraperEngine;
  private productoRepo: ProductoRepository;

  constructor() {
    this.engine = new ScraperEngine();
    this.productoRepo = new ProductoRepository();
  }

  /**
   * Ejecutar scraping para todas las entidades activas
   */
  async scrapeAll(): Promise<{
    exitoso: boolean;
    entidadesProcesadas: number;
    productosActualizados: number;
    errores: string[];
  }> {
    logger.info('🤖 Iniciando scraping masivo...');
    const startTime = Date.now();

    const errores: string[] = [];
    let entidadesProcesadas = 0;
    let productosActualizados = 0;

    try {
      // Obtener todas las configuraciones activas
      const configs = await prisma.scraperConfig.findMany({
        where: { activo: true },
        include: {
          entidad: true,
        },
      });

      logger.info(`📋 ${configs.length} configuraciones encontradas`);

      // Procesar cada configuración
      for (const config of configs) {
        try {
          logger.info(`🏦 Procesando: ${config.entidad.nombre} - ${config.tipo}`);

          const resultado = await this.scrapeEntidad(
            config.id,
            config.entidad.nombre
          );

          if (resultado.exitoso) {
            productosActualizados += resultado.productosActualizados;
          } else {
            errores.push(`${config.entidad.nombre}: ${resultado.error}`);
          }

          entidadesProcesadas++;

          // Delay entre requests (2-5 segundos)
          await this.delay(this.randomBetween(2000, 5000));

        } catch (error: any) {
          logger.error(`Error procesando ${config.entidad.nombre}:`, error);
          errores.push(`${config.entidad.nombre}: ${error.message}`);
        }
      }

      // Cerrar navegador
      await this.engine.close();

      const duracionMs = Date.now() - startTime;
      const duracionMin = (duracionMs / 1000 / 60).toFixed(2);

      logger.info('✅ Scraping masivo completado');
      logger.info(`📊 Resumen:`);
      logger.info(`   - Entidades procesadas: ${entidadesProcesadas}/${configs.length}`);
      logger.info(`   - Productos actualizados: ${productosActualizados}`);
      logger.info(`   - Errores: ${errores.length}`);
      logger.info(`   - Duración: ${duracionMin} minutos`);

      return {
        exitoso: errores.length === 0,
        entidadesProcesadas,
        productosActualizados,
        errores,
      };

    } catch (error: any) {
      logger.error('❌ Error en scraping masivo:', error);
      await this.engine.close();

      return {
        exitoso: false,
        entidadesProcesadas,
        productosActualizados,
        errores: [error.message],
      };
    }
  }

  /**
   * Ejecutar scraping para una entidad específica
   */
  async scrapeEntidad(
    scraperConfigId: string,
    nombreEntidad?: string
  ): Promise<{
    exitoso: boolean;
    productosActualizados: number;
    error?: string;
  }> {
    const startTime = Date.now();

    try {
      // Obtener configuración
      const config = await prisma.scraperConfig.findUnique({
        where: { id: scraperConfigId },
        include: {
          entidad: true,
        },
      });

      if (!config) {
        throw new Error('Configuración de scraper no encontrada');
      }

      const nombre = nombreEntidad || config.entidad.nombre;
      logger.info(`🔍 Scraping: ${nombre}`);

      // Ejecutar scraping
      const resultado = await this.engine.scrape({
        url: config.url,
        estrategia: config.estrategia,
        selectores: config.selectores as Record<string, string>,
        waitForSelector: config.waitForSelector || undefined,
        timeout: config.timeout,
      });

      // Registrar log
      await prisma.scrapingLog.create({
        data: {
          scraperConfigId: config.id,
          exitoso: resultado.exitoso,
          productosEncontrados: resultado.productosEncontrados,
          error: resultado.error,
          duracionMs: resultado.duracionMs,
        },
      });

      // Si fue exitoso, actualizar productos
      let productosActualizados = 0;
      if (resultado.exitoso && resultado.productos && resultado.productos.length > 0) {
        productosActualizados = await this.actualizarProductos(
          config.entidadId,
          config.tipo,
          resultado.productos[0]
        );
      }

      return {
        exitoso: resultado.exitoso,
        productosActualizados,
        error: resultado.error,
      };

    } catch (error: any) {
      const duracionMs = Date.now() - startTime;

      // Registrar error en log
      await prisma.scrapingLog.create({
        data: {
          scraperConfigId,
          exitoso: false,
          productosEncontrados: 0,
          error: error.message,
          duracionMs,
        },
      });

      return {
        exitoso: false,
        productosActualizados: 0,
        error: error.message,
      };
    }
  }

  /**
   * Actualizar productos con datos scrapeados
   */
  private async actualizarProductos(
    entidadId: string,
    tipo: TipoProducto,
    datosScrapedos: any
  ): Promise<number> {
    try {
      // Buscar producto existente
      const productoExistente = await prisma.producto.findFirst({
        where: {
          entidadId,
          tipo,
          activo: true,
        },
      });

      if (!productoExistente) {
        logger.warn(`No se encontró producto activo para actualizar`);
        return 0;
      }

      // Preparar datos para actualizar (solo los que vienen del scraping)
      const dataUpdate: any = {
        updatedAt: new Date(),
        verificado: true,
      };

      if (datosScrapedos.tasaNominalMensual !== undefined) {
        dataUpdate.tasaNominalMensual = datosScrapedos.tasaNominalMensual;
      }

      if (datosScrapedos.tasaNominalAnual !== undefined) {
        dataUpdate.tasaNominalAnual = datosScrapedos.tasaNominalAnual;
      }

      if (datosScrapedos.tasaEfectivaAnual !== undefined) {
        dataUpdate.tasaEfectivaAnual = datosScrapedos.tasaEfectivaAnual;
      }

      if (datosScrapedos.montoMinimo !== undefined) {
        dataUpdate.montoMinimo = datosScrapedos.montoMinimo;
      }

      if (datosScrapedos.montoMaximo !== undefined) {
        dataUpdate.montoMaximo = datosScrapedos.montoMaximo;
      }

      if (datosScrapedos.plazoMinimoMeses !== undefined) {
        dataUpdate.plazoMinimoMeses = datosScrapedos.plazoMinimoMeses;
      }

      if (datosScrapedos.plazoMaximoMeses !== undefined) {
        dataUpdate.plazoMaximoMeses = datosScrapedos.plazoMaximoMeses;
      }

      if (datosScrapedos.costoEstudio !== undefined) {
        dataUpdate.costoEstudio = datosScrapedos.costoEstudio;
      }

      if (datosScrapedos.ingresoMinimo !== undefined) {
        dataUpdate.ingresoMinimo = datosScrapedos.ingresoMinimo;
      }

      // Actualizar producto
      await prisma.producto.update({
        where: { id: productoExistente.id },
        data: dataUpdate,
      });

      logger.info(`✅ Producto actualizado: ${productoExistente.nombre}`);
      return 1;

    } catch (error: any) {
      logger.error('Error actualizando producto:', error);
      return 0;
    }
  }

  /**
   * Delay helper
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Random entre min y max
   */
  private randomBetween(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  /**
   * Obtener estadísticas de scraping
   */
  async getEstadisticas(dias: number = 30) {
    const fechaInicio = new Date();
    fechaInicio.setDate(fechaInicio.getDate() - dias);

    const logs = await prisma.scrapingLog.findMany({
      where: {
        fecha: { gte: fechaInicio },
      },
      include: {
        scraperConfig: {
          include: {
            entidad: true,
          },
        },
      },
      orderBy: { fecha: 'desc' },
    });

    const total = logs.length;
    const exitosos = logs.filter(l => l.exitoso).length;
    const fallidos = total - exitosos;
    const tasaExito = total > 0 ? (exitosos / total) * 100 : 0;

    const duracionPromedio = logs.length > 0
      ? logs.reduce((sum, l) => sum + l.duracionMs, 0) / logs.length
      : 0;

    // Agrupar por entidad
    const porEntidad = logs.reduce((acc, log) => {
      const nombre = log.scraperConfig.entidad.nombre;
      if (!acc[nombre]) {
        acc[nombre] = { total: 0, exitosos: 0, fallidos: 0 };
      }
      acc[nombre].total++;
      if (log.exitoso) {
        acc[nombre].exitosos++;
      } else {
        acc[nombre].fallidos++;
      }
      return acc;
    }, {} as Record<string, any>);

    return {
      periodo: `Últimos ${dias} días`,
      total,
      exitosos,
      fallidos,
      tasaExito: tasaExito.toFixed(2) + '%',
      duracionPromedio: `${(duracionPromedio / 1000).toFixed(2)}s`,
      porEntidad,
      ultimosLogs: logs.slice(0, 10).map(log => ({
        fecha: log.fecha,
        entidad: log.scraperConfig.entidad.nombre,
        exitoso: log.exitoso,
        productosEncontrados: log.productosEncontrados,
        error: log.error,
        duracion: `${(log.duracionMs / 1000).toFixed(2)}s`,
      })),
    };
  }
}
