import { Request, Response } from 'express';
import { ZodError } from 'zod';
import { prisma } from '@config/database';
import { logger } from '@config/logger';
import { registrarBusquedaSchema, engagementSchema } from '@utils/validators';

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
      } = registrarBusquedaSchema.parse(req.body);

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
      if (error instanceof ZodError) {
        return res.status(400).json({
          success: false,
          error: 'Datos de búsqueda inválidos'
        });
      }
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
      } = engagementSchema.parse(req.body);

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
      if (error instanceof ZodError) {
        return res.status(400).json({
          success: false,
          error: 'Datos de engagement inválidos'
        });
      }
      logger.error('Error al actualizar engagement:', error);
      res.status(500).json({
        success: false,
        error: 'Error al actualizar engagement'
      });
    }
  }
}
