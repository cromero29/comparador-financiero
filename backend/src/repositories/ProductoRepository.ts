import { prisma } from '../config/database';
import { TipoProducto, Producto } from '@prisma/client';

export class ProductoRepository {
  // Obtener todos los productos activos
  async findAll() {
    return prisma.producto.findMany({
      where: { activo: true },
      include: {
        entidad: true,
      },
      orderBy: {
        tasaEfectivaAnual: 'asc',
      },
    });
  }

  // Obtener productos por tipo
  async findByTipo(tipo: TipoProducto) {
    return prisma.producto.findMany({
      where: {
        tipo,
        activo: true,
      },
      include: {
        entidad: {
          select: {
            id: true,
            nombre: true,
            codigo: true,
            tipo: true,
            logo: true,
          },
        },
      },
      orderBy: {
        tasaEfectivaAnual: 'asc',
      },
    });
  }

  // Buscar productos que cumplan criterios de elegibilidad
  async findElegibles(params: {
    tipo: TipoProducto;
    monto: number;
    plazo: number;
    ingresos: number;
    edad: number;
    tipoEmpleo: 'dependiente' | 'independiente' | 'pensionado';
  }) {
    const { tipo, monto, plazo, ingresos, edad, tipoEmpleo } = params;

    return prisma.producto.findMany({
      where: {
        tipo,
        activo: true,
        // Filtros de monto
        montoMinimo: { lte: monto },
        montoMaximo: { gte: monto },
        // Filtros de plazo
        plazoMinimoMeses: { lte: plazo },
        plazoMaximoMeses: { gte: plazo },
        // Filtros de edad
        edadMinima: { lte: edad },
        edadMaxima: { gte: edad },
        // Filtros de ingresos
        ingresoMinimo: { lte: ingresos },
        // Filtros por tipo de empleo
        ...(tipoEmpleo === 'independiente' && { aceptaIndependientes: true }),
        ...(tipoEmpleo === 'pensionado' && { aceptaPensionados: true }),
      },
      include: {
        entidad: {
          select: {
            id: true,
            nombre: true,
            codigo: true,
            tipo: true,
            logo: true,
          },
        },
      },
    });
  }

  // Obtener producto por ID
  async findById(id: string) {
    return prisma.producto.findUnique({
      where: { id },
      include: {
        entidad: true,
      },
    });
  }

  // Obtener producto por ID de entidad
  async findByEntidad(entidadId: string) {
    return prisma.producto.findMany({
      where: {
        entidadId,
        activo: true,
      },
      include: {
        entidad: true,
      },
    });
  }

  // Crear producto
  async create(data: Omit<Producto, 'id' | 'createdAt' | 'updatedAt'>) {
    return prisma.producto.create({
      data,
      include: {
        entidad: true,
      },
    });
  }

  // Actualizar producto
  async update(id: string, data: Partial<Producto>) {
    return prisma.producto.update({
      where: { id },
      data,
      include: {
        entidad: true,
      },
    });
  }

  // Marcar producto como verificado (después de scraping exitoso)
  async markAsVerified(id: string) {
    return prisma.producto.update({
      where: { id },
      data: {
        verificado: true,
        updatedAt: new Date(),
      },
    });
  }

  // Actualizar múltiples productos (bulk update)
  async updateMany(ids: string[], data: Partial<Producto>) {
    return prisma.producto.updateMany({
      where: {
        id: { in: ids },
      },
      data,
    });
  }

  // Eliminar producto (soft delete)
  async delete(id: string) {
    return prisma.producto.update({
      where: { id },
      data: {
        activo: false,
      },
    });
  }

  // Contar productos por tipo
  async countByTipo(tipo: TipoProducto) {
    return prisma.producto.count({
      where: {
        tipo,
        activo: true,
      },
    });
  }

  // Obtener estadísticas de productos
  async getEstadisticas() {
    const [total, libreInversion, compraCartera, verificados] = await Promise.all([
      prisma.producto.count({ where: { activo: true } }),
      prisma.producto.count({ where: { tipo: 'LIBRE_INVERSION', activo: true } }),
      prisma.producto.count({ where: { tipo: 'COMPRA_CARTERA', activo: true } }),
      prisma.producto.count({ where: { verificado: true, activo: true } }),
    ]);

    // Tasas promedio
    const tasasLibreInversion = await prisma.producto.aggregate({
      where: { tipo: 'LIBRE_INVERSION', activo: true },
      _avg: {
        tasaEfectivaAnual: true,
      },
    });

    const tasasCompraCartera = await prisma.producto.aggregate({
      where: { tipo: 'COMPRA_CARTERA', activo: true },
      _avg: {
        tasaEfectivaAnual: true,
      },
    });

    return {
      total,
      porTipo: {
        libreInversion,
        compraCartera,
      },
      verificados,
      tasasPromedio: {
        libreInversion: tasasLibreInversion._avg.tasaEfectivaAnual || 0,
        compraCartera: tasasCompraCartera._avg.tasaEfectivaAnual || 0,
      },
    };
  }
}
