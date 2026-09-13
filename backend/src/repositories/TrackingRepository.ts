import { prisma } from '../config/database';
import { EventoTrackingData, ClicTrackingData } from '../types';

export class TrackingRepository {
  // Crear evento de tracking
  async createEvento(sessionId: string, data: EventoTrackingData) {
    return prisma.eventoTracking.create({
      data: {
        sessionId,
        tipoEvento: data.tipoEvento,
        categoria: data.categoria,
        accion: data.accion,
        metadata: data.metadata,
        url: data.url,
        dispositivo: data.dispositivo,
        navegador: data.navegador,
        utmSource: data.utmSource,
        utmMedium: data.utmMedium,
        utmCampaign: data.utmCampaign,
      },
    });
  }

  // Crear evento de clic (para monetización CPC)
  async createClic(sessionId: string, data: ClicTrackingData) {
    return prisma.clicTracking.create({
      data: {
        sessionId,
        productoId: data.productoId,
        entidadId: '', // Se llena desde el servicio
        posicion: data.posicion,
        montoSolicitado: data.montoSolicitado,
        plazoMeses: data.plazoMeses,
        tipoProducto: data.tipoProducto,
        costoClic: 0, // Por ahora $0, después se configura por producto
        redireccionExitosa: true,
        urlDestino: '', // Se llena desde el servicio
      },
    });
  }

  // Obtener eventos por sesión
  async getEventosBySession(sessionId: string) {
    return prisma.eventoTracking.findMany({
      where: { sessionId },
      orderBy: { fecha: 'desc' },
    });
  }

  // Obtener clics por producto
  async getClicsByProducto(productoId: string, fechaInicio?: Date, fechaFin?: Date) {
    return prisma.clicTracking.findMany({
      where: {
        productoId,
        ...(fechaInicio && fechaFin && {
          fecha: {
            gte: fechaInicio,
            lte: fechaFin,
          },
        }),
      },
      orderBy: { fecha: 'desc' },
    });
  }

  // Obtener clics por entidad
  async getClicsByEntidad(entidadId: string, fechaInicio?: Date, fechaFin?: Date) {
    return prisma.clicTracking.findMany({
      where: {
        entidadId,
        ...(fechaInicio && fechaFin && {
          fecha: {
            gte: fechaInicio,
            lte: fechaFin,
          },
        }),
      },
      orderBy: { fecha: 'desc' },
    });
  }

  // Contar eventos por tipo
  async countEventosByTipo(tipoEvento: string, fechaInicio?: Date, fechaFin?: Date) {
    return prisma.eventoTracking.count({
      where: {
        tipoEvento,
        ...(fechaInicio && fechaFin && {
          fecha: {
            gte: fechaInicio,
            lte: fechaFin,
          },
        }),
      },
    });
  }

  // Contar clics totales
  async countClics(fechaInicio?: Date, fechaFin?: Date) {
    return prisma.clicTracking.count({
      where: {
        ...(fechaInicio && fechaFin && {
          fecha: {
            gte: fechaInicio,
            lte: fechaFin,
          },
        }),
      },
    });
  }

  // Calcular ingresos CPC
  async calcularIngresosCPC(fechaInicio?: Date, fechaFin?: Date) {
    const result = await prisma.clicTracking.aggregate({
      where: {
        ...(fechaInicio && fechaFin && {
          fecha: {
            gte: fechaInicio,
            lte: fechaFin,
          },
        }),
      },
      _sum: {
        costoClic: true,
      },
      _count: {
        id: true,
      },
    });

    return {
      totalClics: result._count.id,
      ingresoTotal: result._sum.costoClic || 0,
      clicPromedio: result._count.id > 0 
        ? (result._sum.costoClic || 0) / result._count.id 
        : 0,
    };
  }

  // Obtener métricas de conversión
  async getMetricasConversion(fechaInicio: Date, fechaFin: Date) {
    // Contar eventos clave en el funnel
    const [
      visitantes,
      formulariosIniciados,
      formulariosCompletos,
      resultadosVistos,
      clicsRealizados,
    ] = await Promise.all([
      prisma.eventoTracking.groupBy({
        by: ['sessionId'],
        where: {
          tipoEvento: 'page_view',
          fecha: { gte: fechaInicio, lte: fechaFin },
        },
      }).then(r => r.length),
      
      this.countEventosByTipo('form_start', fechaInicio, fechaFin),
      this.countEventosByTipo('form_complete', fechaInicio, fechaFin),
      this.countEventosByTipo('results_view', fechaInicio, fechaFin),
      this.countClics(fechaInicio, fechaFin),
    ]);

    return {
      visitantes,
      formulariosIniciados,
      formulariosCompletos,
      resultadosVistos,
      clicsRealizados,
      tasas: {
        formulario: visitantes > 0 ? (formulariosCompletos / visitantes) * 100 : 0,
        clic: resultadosVistos > 0 ? (clicsRealizados / resultadosVistos) * 100 : 0,
        global: visitantes > 0 ? (clicsRealizados / visitantes) * 100 : 0,
      },
    };
  }

  // Top productos por clics
  async getTopProductosPorClics(limite: number = 10, fechaInicio?: Date, fechaFin?: Date) {
    const result = await prisma.clicTracking.groupBy({
      by: ['productoId'],
      where: {
        ...(fechaInicio && fechaFin && {
          fecha: {
            gte: fechaInicio,
            lte: fechaFin,
          },
        }),
      },
      _count: {
        id: true,
      },
      _sum: {
        costoClic: true,
      },
      orderBy: {
        _count: {
          id: 'desc',
        },
      },
      take: limite,
    });

    return result;
  }
}
