import { Request, Response } from 'express';
import { ZodError } from 'zod';
import { prisma } from '@config/database';
import { logger } from '@config/logger';
import { iniciarSesionSchema } from '@utils/validators';

export class SesionController {
  /**
   * POST /api/v1/sesion/iniciar
   * Iniciar una nueva sesión de usuario
   */
  async iniciarSesion(req: Request, res: Response) {
    try {
      // Validar y sanear el input
      const {
        fingerprint,
        userAgent,
        dispositivo,
        navegador,
        sistemaOperativo,
        utmSource,
        utmMedium,
        utmCampaign,
        utmContent,
        utmTerm,
        referrer
      } = iniciarSesionSchema.parse(req.body);

      // Obtener IP del cliente (considerando proxies)
      const ipAddress = (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() 
        || req.socket.remoteAddress 
        || 'unknown';

      // Crear sesión
      const sesion = await prisma.sesion.create({
        data: {
          fingerprint,
          ipAddress,
          userAgent,
          dispositivo,
          navegador,
          sistemaOperativo,
          utmSource,
          utmMedium,
          utmCampaign,
          utmContent,
          utmTerm,
          referrer
        }
      });

      logger.info(`Sesión iniciada: ${sesion.id}`, {
        fingerprint,
        dispositivo,
        navegador,
        ip: ipAddress
      });

      res.status(201).json({
        success: true,
        sesionId: sesion.id
      });
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          success: false,
          error: 'Datos de sesión inválidos'
        });
      }
      logger.error('Error al iniciar sesión:', error);
      res.status(500).json({
        success: false,
        error: 'Error al iniciar sesión'
      });
    }
  }
}
