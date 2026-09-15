import { PrismaClient } from '@prisma/client';
import { logger } from '../config/logger';

const prisma = new PrismaClient();

interface CrearSesionParams {
  fingerprint?: string;
  ipAddress?: string;
  userAgent?: string;
  pais?: string;
  ciudad?: string;
  dispositivo?: string;
  navegador?: string;
  sistemaOperativo?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmContent?: string;
  utmTerm?: string;
  referrer?: string;
}

export class SesionService {
  /**
   * Crear o recuperar sesión existente
   */
  async crearSesion(params: CrearSesionParams) {
    try {
      // Si existe fingerprint, buscar sesión reciente (últimas 24 horas)
      if (params.fingerprint) {
        const hace24Horas = new Date(Date.now() - 24 * 60 * 60 * 1000);
        
        const sesionExistente = await prisma.sesion.findFirst({
          where: {
            fingerprint: params.fingerprint,
            ultimaActividad: {
              gte: hace24Horas
            }
          },
          orderBy: {
            ultimaActividad: 'desc'
          }
        });

        if (sesionExistente) {
          // Actualizar última actividad
          return await prisma.sesion.update({
            where: { id: sesionExistente.id },
            data: { ultimaActividad: new Date() }
          });
        }
      }

      // Crear nueva sesión
      const sesion = await prisma.sesion.create({
        data: {
          fingerprint: params.fingerprint,
          ipAddress: params.ipAddress,
          userAgent: params.userAgent,
          pais: params.pais,
          ciudad: params.ciudad,
          dispositivo: params.dispositivo,
          navegador: params.navegador,
          sistemaOperativo: params.sistemaOperativo,
          utmSource: params.utmSource,
          utmMedium: params.utmMedium,
          utmCampaign: params.utmCampaign,
          utmContent: params.utmContent,
          utmTerm: params.utmTerm,
          referrer: params.referrer,
        }
      });

      logger.info('Nueva sesión creada', { sesionId: sesion.id });
      return sesion;
      
    } catch (error) {
      logger.error('Error al crear sesión', { error });
      throw error;
    }
  }

  /**
   * Actualizar última actividad de sesión
   */
  async actualizarActividad(sesionId: string) {
    try {
      return await prisma.sesion.update({
        where: { id: sesionId },
        data: { ultimaActividad: new Date() }
      });
    } catch (error) {
      logger.error('Error al actualizar sesión', { sesionId, error });
      throw error;
    }
  }

  /**
   * Obtener estadísticas de una sesión
   */
  async obtenerEstadisticas(sesionId: string) {
    try {
      const [sesion, busquedas, clics, eventos] = await Promise.all([
        prisma.sesion.findUnique({
          where: { id: sesionId }
        }),
        prisma.busqueda.count({
          where: { sesionId }
        }),
        prisma.clicTracking.count({
          where: { sesionId }
        }),
        prisma.eventoTracking.count({
          where: { sesionId }
        })
      ]);

      return {
        sesion,
        estadisticas: {
          busquedas,
          clics,
          eventos,
          duracionMinutos: sesion ? 
            Math.round((sesion.ultimaActividad.getTime() - sesion.inicioSesion.getTime()) / 60000) 
            : 0
        }
      };
    } catch (error) {
      logger.error('Error al obtener estadísticas de sesión', { sesionId, error });
      throw error;
    }
  }
}
