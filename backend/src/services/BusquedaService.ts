import { PrismaClient, TipoProducto } from '@prisma/client';
import { logger } from '../config/logger';

const prisma = new PrismaClient();

interface RegistrarBusquedaParams {
  sesionId: string;
  tipoProducto: TipoProducto;
  montoSolicitado: number;
  plazoMeses: number;
  ingresos: number;
  edad: number;
  tipoEmpleo: string;
  
  // Opcionales (compra cartera)
  deudaActual?: number;
  cuotaActual?: number;
  tasaActual?: number;
  
  // Resultados
  ofertasEncontradas: number;
  mejorTasa: number;
  mejorCuota: number;
  
  // Top 3 entidades mostradas
  entidad1Id?: string;
  entidad2Id?: string;
  entidad3Id?: string;
}

interface ActualizarEngagementParams {
  busquedaId: string;
  tiempoEnResultados?: number;
  ofertasExpandidas?: number;
  generoClic?: boolean;
  clicsGenerados?: number;
}

export class BusquedaService {
  /**
   * Registrar una búsqueda completa
   */
  async registrarBusqueda(params: RegistrarBusquedaParams) {
    try {
      const busqueda = await prisma.busqueda.create({
        data: {
          sesionId: params.sesionId,
          tipoProducto: params.tipoProducto,
          montoSolicitado: params.montoSolicitado,
          plazoMeses: params.plazoMeses,
          ingresos: params.ingresos,
          edad: params.edad,
          tipoEmpleo: params.tipoEmpleo,
          deudaActual: params.deudaActual,
          cuotaActual: params.cuotaActual,
          tasaActual: params.tasaActual,
          ofertasEncontradas: params.ofertasEncontradas,
          mejorTasa: params.mejorTasa,
          mejorCuota: params.mejorCuota,
          entidad1Id: params.entidad1Id,
          entidad2Id: params.entidad2Id,
          entidad3Id: params.entidad3Id,
        }
      });

      logger.info('Búsqueda registrada', {
        busquedaId: busqueda.id,
        sesionId: params.sesionId,
        ofertas: params.ofertasEncontradas
      });

      return busqueda;
      
    } catch (error) {
      logger.error('Error al registrar búsqueda', { error });
      throw error;
    }
  }

  /**
   * Actualizar métricas de engagement de la búsqueda
   */
  async actualizarEngagement(params: ActualizarEngagementParams) {
    try {
      const updateData: any = {};
      
      if (params.tiempoEnResultados !== undefined) {
        updateData.tiempoEnResultados = params.tiempoEnResultados;
      }
      
      if (params.ofertasExpandidas !== undefined) {
        updateData.ofertasExpandidas = params.ofertasExpandidas;
      }
      
      if (params.generoClic !== undefined) {
        updateData.generoClic = params.generoClic;
      }
      
      if (params.clicsGenerados !== undefined) {
        updateData.clicsGenerados = params.clicsGenerados;
      }

      return await prisma.busqueda.update({
        where: { id: params.busquedaId },
        data: updateData
      });
      
    } catch (error) {
      logger.error('Error al actualizar engagement', { 
        busquedaId: params.busquedaId, 
        error 
      });
      throw error;
    }
  }

  /**
   * Obtener búsquedas de una sesión
   */
  async obtenerBusquedasSesion(sesionId: string) {
    try {
      return await prisma.busqueda.findMany({
        where: { sesionId },
        orderBy: { fecha: 'desc' }
      });
    } catch (error) {
      logger.error('Error al obtener búsquedas', { sesionId, error });
      throw error;
    }
  }

  /**
   * Estadísticas de búsquedas por fecha
   */
  async obtenerEstadisticasPorFecha(fechaInicio: Date, fechaFin: Date) {
    try {
      const busquedas = await prisma.busqueda.findMany({
        where: {
          fecha: {
            gte: fechaInicio,
            lte: fechaFin
          }
        },
        include: {
          sesion: {
            select: {
              id: true,
              dispositivo: true,
              navegador: true,
              pais: true
            }
          }
        }
      });

      return {
        total: busquedas.length,
        conClics: busquedas.filter(b => b.generoClic).length,
        tasaConversion: busquedas.length > 0 
          ? (busquedas.filter(b => b.generoClic).length / busquedas.length) * 100 
          : 0,
        montoPromedio: busquedas.reduce((sum, b) => sum + Number(b.montoSolicitado), 0) / busquedas.length,
        edadPromedio: busquedas.reduce((sum, b) => sum + b.edad, 0) / busquedas.length,
        ingresosPromedio: busquedas.reduce((sum, b) => sum + Number(b.ingresos), 0) / busquedas.length,
        porTipoProducto: {
          libreInversion: busquedas.filter(b => b.tipoProducto === 'LIBRE_INVERSION').length,
          compraCartera: busquedas.filter(b => b.tipoProducto === 'COMPRA_CARTERA').length
        },
        porTipoEmpleo: {
          dependiente: busquedas.filter(b => b.tipoEmpleo === 'dependiente').length,
          independiente: busquedas.filter(b => b.tipoEmpleo === 'independiente').length,
          pensionado: busquedas.filter(b => b.tipoEmpleo === 'pensionado').length
        }
      };
    } catch (error) {
      logger.error('Error al obtener estadísticas', { error });
      throw error;
    }
  }
}
