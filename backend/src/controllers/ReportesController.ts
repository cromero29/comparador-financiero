import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { logger } from '../config/logger';

const prisma = new PrismaClient();

export class ReportesController {
  /**
   * GET /api/v1/reportes/resumen
   * Resumen general de toda la actividad
   */
  async getResumenGeneral(req: Request, res: Response) {
    try {
      const { dias = 30 } = req.query;
      const fechaInicio = new Date();
      fechaInicio.setDate(fechaInicio.getDate() - Number(dias));

      // Contar registros
      const [
        totalSesiones,
        totalBusquedas,
        totalClics,
        totalEventos
      ] = await Promise.all([
        prisma.sesion.count({
          where: { inicioSesion: { gte: fechaInicio } }
        }),
        prisma.busqueda.count({
          where: { fecha: { gte: fechaInicio } }
        }),
        prisma.clicTracking.count({
          where: { fecha: { gte: fechaInicio } }
        }),
        prisma.eventoTracking.count({
          where: { fecha: { gte: fechaInicio } }
        })
      ]);

      // Estadísticas de búsquedas
      const busquedas = await prisma.busqueda.findMany({
        where: { fecha: { gte: fechaInicio } }
      });

      const busquedasConClics = busquedas.filter(b => b.generoClic).length;
      const tasaConversion = totalBusquedas > 0 
        ? ((busquedasConClics / totalBusquedas) * 100).toFixed(2)
        : 0;

      const montoPromedio = busquedas.length > 0
        ? (busquedas.reduce((sum, b) => sum + Number(b.montoSolicitado), 0) / busquedas.length).toFixed(0)
        : 0;

      const edadPromedio = busquedas.length > 0
        ? (busquedas.reduce((sum, b) => sum + b.edad, 0) / busquedas.length).toFixed(0)
        : 0;

      const ingresosPromedio = busquedas.length > 0
        ? (busquedas.reduce((sum, b) => sum + Number(b.ingresos), 0) / busquedas.length).toFixed(0)
        : 0;

      res.json({
        success: true,
        data: {
          periodo: {
            dias: Number(dias),
            desde: fechaInicio,
            hasta: new Date()
          },
          actividad: {
            sesiones: totalSesiones,
            busquedas: totalBusquedas,
            clics: totalClics,
            eventos: totalEventos
          },
          conversion: {
            busquedasConClics,
            tasaConversion: `${tasaConversion}%`,
            clicsPorBusqueda: totalBusquedas > 0 
              ? (totalClics / totalBusquedas).toFixed(2)
              : 0
          },
          promedios: {
            monto: `$${Number(montoPromedio).toLocaleString('es-CO')}`,
            edad: `${edadPromedio} años`,
            ingresos: `$${Number(ingresosPromedio).toLocaleString('es-CO')}`
          },
          tiposProducto: {
            libreInversion: busquedas.filter(b => b.tipoProducto === 'LIBRE_INVERSION').length,
            compraCartera: busquedas.filter(b => b.tipoProducto === 'COMPRA_CARTERA').length
          },
          tiposEmpleo: {
            dependiente: busquedas.filter(b => b.tipoEmpleo === 'dependiente').length,
            independiente: busquedas.filter(b => b.tipoEmpleo === 'independiente').length,
            pensionado: busquedas.filter(b => b.tipoEmpleo === 'pensionado').length
          }
        }
      });

    } catch (error) {
      logger.error('Error en resumen general', { error });
      res.status(500).json({
        success: false,
        error: 'Error al generar reporte'
      });
    }
  }

  /**
   * GET /api/v1/reportes/busquedas-detalle
   * Detalle de todas las búsquedas
   */
  async getBusquedasDetalle(req: Request, res: Response) {
    try {
      const { dias = 30, limite = 100 } = req.query;
      const fechaInicio = new Date();
      fechaInicio.setDate(fechaInicio.getDate() - Number(dias));

      const busquedas = await prisma.busqueda.findMany({
        where: { fecha: { gte: fechaInicio } },
        include: {
          sesion: {
            select: {
              dispositivo: true,
              navegador: true,
              pais: true,
              ciudad: true,
              utmSource: true,
              utmMedium: true,
              utmCampaign: true
            }
          }
        },
        orderBy: { fecha: 'desc' },
        take: Number(limite)
      });

      const busquedasFormateadas = busquedas.map(b => ({
        id: b.id,
        fecha: b.fecha,
        parametros: {
          tipoProducto: b.tipoProducto,
          monto: `$${Number(b.montoSolicitado).toLocaleString('es-CO')}`,
          plazo: `${b.plazoMeses} meses`,
          edad: `${b.edad} años`,
          ingresos: `$${Number(b.ingresos).toLocaleString('es-CO')}`,
          tipoEmpleo: b.tipoEmpleo
        },
        resultados: {
          ofertasEncontradas: b.ofertasEncontradas,
          mejorTasa: `${b.mejorTasa}%`,
          mejorCuota: `$${Number(b.mejorCuota).toLocaleString('es-CO')}`
        },
        engagement: {
          tiempoEnResultados: b.tiempoEnResultados ? `${b.tiempoEnResultados}s` : null,
          ofertasExpandidas: b.ofertasExpandidas
        },
        conversion: {
          generoClic: b.generoClic,
          clicsGenerados: b.clicsGenerados
        },
        contexto: {
          dispositivo: b.sesion?.dispositivo,
          navegador: b.sesion?.navegador,
          ubicacion: b.sesion?.ciudad ? `${b.sesion.ciudad}, ${b.sesion.pais}` : b.sesion?.pais,
          origen: b.sesion?.utmSource
        }
      }));

      res.json({
        success: true,
        data: {
          total: busquedasFormateadas.length,
          busquedas: busquedasFormateadas
        }
      });

    } catch (error) {
      logger.error('Error en búsquedas detalle', { error });
      res.status(500).json({
        success: false,
        error: 'Error al generar reporte'
      });
    }
  }

  /**
   * GET /api/v1/reportes/clics-por-entidad
   * Clics agrupados por entidad financiera
   */
  async getClicsPorEntidad(req: Request, res: Response) {
    try {
      const { dias = 30 } = req.query;
      const fechaInicio = new Date();
      fechaInicio.setDate(fechaInicio.getDate() - Number(dias));

      const clics = await prisma.clicTracking.findMany({
        where: { fecha: { gte: fechaInicio } },
        orderBy: { fecha: 'desc' }
      });

      // Agrupar por entidad
      const clicksPorEntidad: Record<string, any> = {};

      clics.forEach(clic => {
        if (!clicksPorEntidad[clic.entidadNombre]) {
          clicksPorEntidad[clic.entidadNombre] = {
            entidad: clic.entidadNombre,
            tipo: clic.entidadTipo,
            totalClics: 0,
            clicsPorPosicion: {} as Record<number, number>,
            tasaPromedio: 0,
            cuotaPromedio: 0,
            montoPromedio: 0,
            ingresosClientes: [] as number[],
            edadesClientes: [] as number[]
          };
        }

        const entidad = clicksPorEntidad[clic.entidadNombre];
        entidad.totalClics++;
        entidad.clicsPorPosicion[clic.posicion] = (entidad.clicsPorPosicion[clic.posicion] || 0) + 1;
        entidad.tasaPromedio += Number(clic.tasaOfrecida);
        entidad.cuotaPromedio += Number(clic.cuotaOfrecida);
        entidad.montoPromedio += Number(clic.montoSolicitado);
        entidad.ingresosClientes.push(Number(clic.ingresos));
        entidad.edadesClientes.push(clic.edad);
      });

      // Calcular promedios
      const resultado = Object.values(clicksPorEntidad).map(entidad => ({
        entidad: entidad.entidad,
        tipo: entidad.tipo,
        totalClics: entidad.totalClics,
        clicsPorPosicion: entidad.clicsPorPosicion,
        promedios: {
          tasa: `${(entidad.tasaPromedio / entidad.totalClics).toFixed(2)}%`,
          cuota: `$${Math.round(entidad.cuotaPromedio / entidad.totalClics).toLocaleString('es-CO')}`,
          monto: `$${Math.round(entidad.montoPromedio / entidad.totalClics).toLocaleString('es-CO')}`,
          ingresos: `$${Math.round(entidad.ingresosClientes.reduce((a: number, b: number) => a + b, 0) / entidad.totalClics).toLocaleString('es-CO')}`,
          edad: `${Math.round(entidad.edadesClientes.reduce((a: number, b: number) => a + b, 0) / entidad.totalClics)} años`
        },
        posicionMasClickeada: Object.entries(entidad.clicsPorPosicion)
          .sort(([, a], [, b]) => (b as number) - (a as number))[0]?.[0] || null
      })).sort((a, b) => b.totalClics - a.totalClics);

      res.json({
        success: true,
        data: {
          periodo: {
            dias: Number(dias),
            desde: fechaInicio,
            hasta: new Date()
          },
          totalClics: clics.length,
          entidades: resultado
        }
      });

    } catch (error) {
      logger.error('Error en clics por entidad', { error });
      res.status(500).json({
        success: false,
        error: 'Error al generar reporte'
      });
    }
  }

  /**
   * GET /api/v1/reportes/funnel-conversion
   * Funnel desde sesión hasta clic
   */
  async getFunnelConversion(req: Request, res: Response) {
    try {
      const { dias = 30 } = req.query;
      const fechaInicio = new Date();
      fechaInicio.setDate(fechaInicio.getDate() - Number(dias));

      const [
        sesionesTotales,
        busquedasRealizadas,
        busquedasConEngagement,
        sesionesConClics
      ] = await Promise.all([
        prisma.sesion.count({
          where: { inicioSesion: { gte: fechaInicio } }
        }),
        prisma.busqueda.count({
          where: { fecha: { gte: fechaInicio } }
        }),
        prisma.busqueda.count({
          where: { 
            fecha: { gte: fechaInicio },
            ofertasExpandidas: { gt: 0 }
          }
        }),
        prisma.sesion.count({
          where: {
            inicioSesion: { gte: fechaInicio },
            clics: { some: {} }
          }
        })
      ]);

      const porcentajeBusquedas = sesionesTotales > 0 
        ? ((busquedasRealizadas / sesionesTotales) * 100).toFixed(2)
        : 0;

      const porcentajeEngagement = busquedasRealizadas > 0
        ? ((busquedasConEngagement / busquedasRealizadas) * 100).toFixed(2)
        : 0;

      const porcentajeConversion = busquedasRealizadas > 0
        ? ((sesionesConClics / busquedasRealizadas) * 100).toFixed(2)
        : 0;

      res.json({
        success: true,
        data: {
          periodo: {
            dias: Number(dias),
            desde: fechaInicio,
            hasta: new Date()
          },
          funnel: [
            {
              etapa: '1. Sesiones iniciadas',
              cantidad: sesionesTotales,
              porcentaje: '100%',
              descripcion: 'Usuarios que visitaron la plataforma'
            },
            {
              etapa: '2. Búsquedas realizadas',
              cantidad: busquedasRealizadas,
              porcentaje: `${porcentajeBusquedas}%`,
              descripcion: 'Usuarios que completaron el formulario'
            },
            {
              etapa: '3. Con engagement',
              cantidad: busquedasConEngagement,
              porcentaje: `${porcentajeEngagement}%`,
              descripcion: 'Usuarios que expandieron ofertas'
            },
            {
              etapa: '4. Generaron clic',
              cantidad: sesionesConClics,
              porcentaje: `${porcentajeConversion}%`,
              descripcion: 'Usuarios que clickearon "Solicitar ahora"'
            }
          ],
          tasas: {
            sesionABusqueda: `${porcentajeBusquedas}%`,
            busquedaAEngagement: `${porcentajeEngagement}%`,
            busquedaAClic: `${porcentajeConversion}%`
          }
        }
      });

    } catch (error) {
      logger.error('Error en funnel conversión', { error });
      res.status(500).json({
        success: false,
        error: 'Error al generar reporte'
      });
    }
  }

  /**
   * GET /api/v1/reportes/segmentacion
   * Segmentación por edad e ingresos
   */
  async getSegmentacion(req: Request, res: Response) {
    try {
      const { dias = 30 } = req.query;
      const fechaInicio = new Date();
      fechaInicio.setDate(fechaInicio.getDate() - Number(dias));

      const busquedas = await prisma.busqueda.findMany({
        where: { fecha: { gte: fechaInicio } }
      });

      // Segmentar por edad
      const segmentosPorEdad: Record<string, any> = {
        '18-24': { busquedas: 0, conClics: 0 },
        '25-34': { busquedas: 0, conClics: 0 },
        '35-44': { busquedas: 0, conClics: 0 },
        '45-54': { busquedas: 0, conClics: 0 },
        '55+': { busquedas: 0, conClics: 0 }
      };

      busquedas.forEach(b => {
        let rango = '55+';
        if (b.edad < 25) rango = '18-24';
        else if (b.edad < 35) rango = '25-34';
        else if (b.edad < 45) rango = '35-44';
        else if (b.edad < 55) rango = '45-54';

        segmentosPorEdad[rango].busquedas++;
        if (b.generoClic) segmentosPorEdad[rango].conClics++;
      });

      // Calcular tasas de conversión
      const edadConTasas = Object.entries(segmentosPorEdad).map(([rango, datos]: [string, any]) => ({
        rangoEdad: rango,
        busquedas: datos.busquedas,
        clics: datos.conClics,
        tasaConversion: datos.busquedas > 0 
          ? `${((datos.conClics / datos.busquedas) * 100).toFixed(2)}%`
          : '0%'
      }));

      // Segmentar por ingresos
      const segmentosPorIngresos: Record<string, any> = {
        '< 2M': { busquedas: 0, conClics: 0 },
        '2M-5M': { busquedas: 0, conClics: 0 },
        '5M-10M': { busquedas: 0, conClics: 0 },
        '> 10M': { busquedas: 0, conClics: 0 }
      };

      busquedas.forEach(b => {
        const ingresos = Number(b.ingresos);
        let rango = '> 10M';
        if (ingresos < 2000000) rango = '< 2M';
        else if (ingresos < 5000000) rango = '2M-5M';
        else if (ingresos < 10000000) rango = '5M-10M';

        segmentosPorIngresos[rango].busquedas++;
        if (b.generoClic) segmentosPorIngresos[rango].conClics++;
      });

      const ingresosConTasas = Object.entries(segmentosPorIngresos).map(([rango, datos]: [string, any]) => ({
        rangoIngresos: rango,
        busquedas: datos.busquedas,
        clics: datos.conClics,
        tasaConversion: datos.busquedas > 0 
          ? `${((datos.conClics / datos.busquedas) * 100).toFixed(2)}%`
          : '0%'
      }));

      res.json({
        success: true,
        data: {
          periodo: {
            dias: Number(dias),
            desde: fechaInicio,
            hasta: new Date()
          },
          segmentacionEdad: edadConTasas,
          segmentacionIngresos: ingresosConTasas
        }
      });

    } catch (error) {
      logger.error('Error en segmentación', { error });
      res.status(500).json({
        success: false,
        error: 'Error al generar reporte'
      });
    }
  }
}
