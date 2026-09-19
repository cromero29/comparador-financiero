import { Request, Response } from 'express';
import { ZodError } from 'zod';
import { prisma } from '@config/database';
import { logger } from '@config/logger';
import { registrarClicSchema } from '@utils/validators';

export class ClicController {
  /**
   * POST /api/v1/clic/registrar
   * Registrar un clic en "Solicitar ahora"
   */
  async registrarClic(req: Request, res: Response) {
    try {
      const {
        sesionId,
        busquedaId,
        productoId,
        entidadId,
        entidadNombre,
        entidadTipo,
        posicion,
        paginaResultados,
        montoSolicitado,
        plazoMeses,
        tipoProducto,
        tasaOfrecida,
        cuotaOfrecida,
        edad,
        ingresos,
        tipoEmpleo,
        urlDestino,
        redireccionExitosa
      } = registrarClicSchema.parse(req.body);

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

      // Crear clic
      const clic = await prisma.clicTracking.create({
        data: {
          sesionId,
          busquedaId,
          productoId,
          entidadId,
          entidadNombre,
          entidadTipo,
          posicion,
          paginaResultados,
          montoSolicitado,
          plazoMeses,
          tipoProducto,
          tasaOfrecida,
          cuotaOfrecida,
          edad,
          ingresos,
          tipoEmpleo,
          urlDestino,
          redireccionExitosa
        }
      });

      // Si hay busquedaId, actualizar que generó clic
      if (busquedaId) {
        await prisma.busqueda.update({
          where: { id: busquedaId },
          data: {
            generoClic: true,
            clicsGenerados: { increment: 1 }
          }
        });
      }

      logger.info(`Clic registrado: ${clic.id}`, {
        sesionId,
        entidad: entidadNombre,
        producto: productoId,
        posicion
      });

      res.status(201).json({
        success: true,
        clicId: clic.id
      });
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          success: false,
          error: 'Datos de clic inválidos'
        });
      }
      logger.error('Error al registrar clic:', error);
      res.status(500).json({
        success: false,
        error: 'Error al registrar clic'
      });
    }
  }
}
