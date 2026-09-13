import { Request, Response } from 'express';
import { ComparacionService } from '../services/ComparacionService';
import { 
  validateComparacion, 
  validateCompraCartera 
} from '../utils/validators';
import { TipoProducto } from '@prisma/client';
import { asyncHandler } from '../middleware/errorHandler';
import { logger } from '../config/logger';

export class ComparacionController {
  private comparacionService: ComparacionService;

  constructor() {
    this.comparacionService = new ComparacionService();
  }

  /**
   * POST /api/v1/comparacion
   * Comparar ofertas de crédito
   */
  comparar = asyncHandler(async (req: Request, res: Response) => {
    logger.info('Request de comparación recibido', {
      body: req.body,
      ip: req.ip,
    });

    // Validar según tipo de producto
    const data = req.body.tipoProducto === TipoProducto.COMPRA_CARTERA
      ? validateCompraCartera(req.body)
      : validateComparacion(req.body);

    // Ejecutar comparación
    const resultado = await this.comparacionService.compararOfertas(data);

    res.apiSuccess({
      resultado,
      mensaje: resultado.ofertas.length > 0
        ? `Se encontraron ${resultado.ofertas.length} ofertas que cumplen tus requisitos`
        : 'No se encontraron ofertas que cumplan con tus requisitos',
    });
  });

  /**
   * GET /api/v1/comparacion/health
   * Health check
   */
  health = asyncHandler(async (req: Request, res: Response) => {
    res.apiSuccess({
      status: 'ok',
      timestamp: new Date().toISOString(),
      service: 'comparacion',
    });
  });
}
