import { Request, Response } from 'express';
import { TrackingService } from '../services/TrackingService';
import { 
  validateEventoTracking, 
  validateClicTracking 
} from '../utils/validators';
import { asyncHandler } from '../middleware/errorHandler';
import { logger } from '../config/logger';
import crypto from 'crypto';

export class TrackingController {
  private trackingService: TrackingService;

  constructor() {
    this.trackingService = new TrackingService();
  }

  /**
   * POST /api/v1/tracking/evento
   * Registrar evento de tracking
   */
  trackEvento = asyncHandler(async (req: Request, res: Response) => {
    // Obtener o crear sessionId
    const sessionId = this.getOrCreateSessionId(req, res);

    // Validar datos
    const data = validateEventoTracking(req.body);

    // Agregar información del request
    const eventoData = {
      ...data,
      url: data.url || req.headers.referer || '',
      dispositivo: this.detectDevice(req.headers['user-agent'] || ''),
      navegador: this.detectBrowser(req.headers['user-agent'] || ''),
    };

    // Registrar evento
    await this.trackingService.trackEvento(sessionId, eventoData);

    res.apiSuccess({ success: true });
  });

  /**
   * POST /api/v1/tracking/clic
   * Registrar clic en oferta (CPC)
   */
  trackClic = asyncHandler(async (req: Request, res: Response) => {
    // Obtener sessionId
    const sessionId = this.getOrCreateSessionId(req, res);

    // Validar datos
    const data = validateClicTracking(req.body);

    // Registrar clic
    const resultado = await this.trackingService.trackClic(sessionId, data);

    logger.info('Clic registrado', {
      sessionId,
      producto: resultado.producto,
      costoClic: resultado.costoClic,
    });

    res.apiSuccess(resultado);
  });

  /**
   * GET /api/v1/tracking/metricas/conversion
   * Obtener métricas de conversión
   */
  getMetricasConversion = asyncHandler(async (req: Request, res: Response) => {
    const { fechaInicio, fechaFin } = req.query;

    const inicio = fechaInicio 
      ? new Date(fechaInicio as string) 
      : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000); // Últimos 30 días

    const fin = fechaFin 
      ? new Date(fechaFin as string) 
      : new Date();

    const metricas = await this.trackingService.getMetricasConversion(inicio, fin);

    res.apiSuccess(metricas);
  });

  /**
   * GET /api/v1/tracking/metricas/cpc
   * Obtener métricas CPC
   */
  getMetricasCPC = asyncHandler(async (req: Request, res: Response) => {
    const { fechaInicio, fechaFin } = req.query;

    const inicio = fechaInicio ? new Date(fechaInicio as string) : undefined;
    const fin = fechaFin ? new Date(fechaFin as string) : undefined;

    const metricas = await this.trackingService.getIngresosCPC(inicio, fin);

    res.apiSuccess(metricas);
  });

  /**
   * GET /api/v1/tracking/top-productos
   * Top productos por clics
   */
  getTopProductos = asyncHandler(async (req: Request, res: Response) => {
    const limite = req.query.limite ? parseInt(req.query.limite as string) : 10;
    const { fechaInicio, fechaFin } = req.query;

    const inicio = fechaInicio ? new Date(fechaInicio as string) : undefined;
    const fin = fechaFin ? new Date(fechaFin as string) : undefined;

    const topProductos = await this.trackingService.getTopProductos(limite, inicio, fin);

    res.apiSuccess(topProductos);
  });

  // ============================================
  // HELPERS
  // ============================================

  /**
   * Obtener o crear sessionId
   */
  private getOrCreateSessionId(req: Request, res: Response): string {
    let sessionId = req.cookies?.sessionId;

    if (!sessionId) {
      sessionId = `sess_${crypto.randomBytes(16).toString('hex')}`;
      
      // Guardar en cookie (7 días)
      res.cookie('sessionId', sessionId, {
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
      });
    }

    return sessionId;
  }

  /**
   * Detectar tipo de dispositivo
   */
  private detectDevice(userAgent: string): string {
    if (/mobile/i.test(userAgent)) return 'mobile';
    if (/tablet|ipad/i.test(userAgent)) return 'tablet';
    return 'desktop';
  }

  /**
   * Detectar navegador
   */
  private detectBrowser(userAgent: string): string {
    if (/chrome/i.test(userAgent)) return 'chrome';
    if (/firefox/i.test(userAgent)) return 'firefox';
    if (/safari/i.test(userAgent)) return 'safari';
    if (/edge/i.test(userAgent)) return 'edge';
    return 'unknown';
  }
}
