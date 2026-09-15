import { Request, Response } from 'express';
import { prisma } from '@config/database';
import { logger } from '@config/logger';

export class BusquedaController {
  /**
   * POST /api/v1/busqueda/registrar
   * Registrar una nueva búsqueda
   */
  async registrarBusqueda(req: Request, res: Response) {
    try {
      const {
        sesionId,
        tipoProducto,
        montoSolicitado,
        plazoMeses,
        ingresos,
        edad,
        tipoEmpleo,
        deudaActual,
        cuotaActual,
        tasaActual,
        ofertasEncontradas,
        mejorTasa,
        mejorCuota,
        entidad1Id,
        entidad2Id,
        entidad3Id
      } = req.body;

      // Validar que la sesión existe
      const sesion = await prisma.sesion.findUnique({
        where: { id: sesionId }
      });

      if (!sesion) {
        return res.status(404).json({
          success: false,
          error: 'Sesión no encontrada'
        });
      }

      // Crear búsqueda
      const busqueda = await prisma.busqueda.create({
        data: {
          sesionId,
          tipoProducto,
          montoSolicitado,
          plazoMeses,
          ingresos,
          edad,
          tipoEmpleo,
          deudaActual,
          cuotaActual,
          tasaActual,
          ofertasEncontradas,
          mejorTasa,
          mejorCuota,
          entidad1Id,
          entidad2Id,
          entidad3Id
        }
      });

      logger.info(`Búsqueda registrada: ${busqueda.id}`, {
        sesionId,
        tipoProducto,
        monto: montoSolicitado,
        plazo: plazoMeses
      });

      res.status(201).json({
        success: true,
        busquedaId: busqueda.id
      });
    } catch (error) {
      logger.error('Error al registrar búsqueda:', error);
      res.status(500).json({
        success: false,
        error: 'Error al registrar búsqueda'
      });
    }
  }

  /**
   * POST /api/v1/busqueda/engagement
   * Actualizar engagement de una búsqueda
   */
  async actualizarEngagement(req: Request, res: Response) {
    try {
      const {
        busquedaId,
        tiempoEnResultados,
        ofertasExpandidas,
        generoClic,
        clicsGenerados
      } = req.body;

      // Actualizar búsqueda
      const busqueda = await prisma.busqueda.update({
        where: { id: busquedaId },
        data: {
          tiempoEnResultados,
          ofertasExpandidas,
          generoClic,
          clicsGenerados
        }
      });

      logger.info(`Engagement actualizado: ${busquedaId}`, {
        tiempo: tiempoEnResultados,
        generoClic
      });

      res.json({
        success: true,
        busquedaId: busqueda.id
      });
    } catch (error) {
      logger.error('Error al actualizar engagement:', error);
      res.status(500).json({
        success: false,
        error: 'Error al actualizar engagement'
      });
    }
  }
}
