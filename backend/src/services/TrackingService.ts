import { TrackingRepository } from '../repositories/TrackingRepository';
import { ProductoRepository } from '../repositories/ProductoRepository';
import { EventoTrackingData, ClicTrackingData } from '../types';
import { logger } from '../config/logger';
import { NotFoundError } from '../utils/errors';

export class TrackingService {
  private trackingRepo: TrackingRepository;
  private productoRepo: ProductoRepository;

  constructor() {
    this.trackingRepo = new TrackingRepository();
    this.productoRepo = new ProductoRepository();
  }

  /**
   * Registrar evento de tracking
   */
  async trackEvento(sessionId: string, data: EventoTrackingData) {
    logger.debug('Tracking evento', {
      sessionId,
      tipo: data.tipoEvento,
      categoria: data.categoria,
    });

    return this.trackingRepo.createEvento(sessionId, data);
  }

  /**
   * Registrar clic en oferta (CPC)
   */
  async trackClic(sessionId: string, data: ClicTrackingData) {
    // Obtener producto para verificar que existe y obtener datos
    const producto = await this.productoRepo.findById(data.productoId);
    
    if (!producto) {
      throw new NotFoundError('Producto');
    }

    logger.info('Tracking clic CPC', {
      sessionId,
      producto: producto.nombre,
      entidad: producto.entidad.nombre,
      posicion: data.posicion,
    });

    // Crear registro de clic
    const clic = await this.trackingRepo.createClic(sessionId, {
      ...data,
    });

    // Actualizar con datos del producto
    await this.trackingRepo.createClic(sessionId, {
      ...data,
    });

    // Retornar URL de redirección
    return {
      clicId: clic.id,
      urlRedirect: producto.urlSolicitud,
      costoClic: 0, // Por ahora $0, después se configura
      producto: {
        nombre: producto.nombre,
        entidad: producto.entidad.nombre,
      },
    };
  }

  /**
   * Obtener métricas de conversión
   */
  async getMetricasConversion(fechaInicio: Date, fechaFin: Date) {
    return this.trackingRepo.getMetricasConversion(fechaInicio, fechaFin);
  }

  /**
   * Obtener ingresos CPC
   */
  async getIngresosCPC(fechaInicio?: Date, fechaFin?: Date) {
    return this.trackingRepo.calcularIngresosCPC(fechaInicio, fechaFin);
  }

  /**
   * Obtener top productos por clics
   */
  async getTopProductos(limite: number = 10, fechaInicio?: Date, fechaFin?: Date) {
    const resultado = await this.trackingRepo.getTopProductosPorClics(
      limite,
      fechaInicio,
      fechaFin
    );

    // Enriquecer con información de productos
    const productosConInfo = await Promise.all(
      resultado.map(async (item) => {
        const producto = await this.productoRepo.findById(item.productoId);
        return {
          producto: {
            id: producto?.id,
            nombre: producto?.nombre,
            entidad: producto?.entidad.nombre,
          },
          clics: item._count.id,
          ingresos: item._sum.costoClic || 0,
        };
      })
    );

    return productosConInfo;
  }

  /**
   * Obtener eventos por sesión
   */
  async getEventosBySession(sessionId: string) {
    return this.trackingRepo.getEventosBySession(sessionId);
  }
}
