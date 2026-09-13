import { Request, Response } from 'express';
import { ProductoRepository } from '../repositories/ProductoRepository';
import { asyncHandler } from '../middleware/errorHandler';
import { TipoProducto } from '@prisma/client';

export class ProductoController {
  private productoRepo: ProductoRepository;

  constructor() {
    this.productoRepo = new ProductoRepository();
  }

  /**
   * GET /api/v1/productos
   * Obtener todos los productos activos
   */
  getAll = asyncHandler(async (req: Request, res: Response) => {
    const productos = await this.productoRepo.findAll();
    res.apiSuccess(productos);
  });

  /**
   * GET /api/v1/productos/:id
   * Obtener producto por ID
   */
  getById = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const producto = await this.productoRepo.findById(id);
    
    if (!producto) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Producto no encontrado',
        },
      });
    }
    
    res.apiSuccess(producto);
  });

  /**
   * GET /api/v1/productos/tipo/:tipo
   * Obtener productos por tipo
   */
  getByTipo = asyncHandler(async (req: Request, res: Response) => {
    const { tipo } = req.params;
    
    if (!Object.values(TipoProducto).includes(tipo as TipoProducto)) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_TYPE',
          message: 'Tipo de producto inválido',
        },
      });
    }
    
    const productos = await this.productoRepo.findByTipo(tipo as TipoProducto);
    res.apiSuccess(productos);
  });

  /**
   * GET /api/v1/productos/estadisticas
   * Obtener estadísticas de productos
   */
  getEstadisticas = asyncHandler(async (req: Request, res: Response) => {
    const estadisticas = await this.productoRepo.getEstadisticas();
    res.apiSuccess(estadisticas);
  });
}
