import { Request, Response } from 'express';
import { prisma } from '@config/database';
import { logger } from '@config/logger';

export class EventoController {
  /**
   * POST /api/v1/evento/registrar
   * Registrar un evento genérico
   */
  async registrarEvento(req: Request, res: Response) {
    try {
      const {
        sesionId,
        tipoEvento,
        categoria,
        accion,
        etiqueta,
        metadata,
        url,
        pathname
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

      // Crear evento
      const evento = await prisma.eventoTracking.create({
        data: {
          sesionId,
          tipoEvento,
          categoria,
          accion,
          etiqueta,
          metadata: metadata ? JSON.stringify(metadata) : undefined,
          url,
          pathname
        }
      });

      logger.info(`Evento registrado: ${evento.id}`, {
        sesionId,
        tipo: tipoEvento,
        categoria,
        accion
      });

      res.status(201).json({
        success: true,
        eventoId: evento.id
      });
    } catch (error) {
      logger.error('Error al registrar evento:', error);
      res.status(500).json({
        success: false,
        error: 'Error al registrar evento'
      });
    }
  }
}
