import { z } from 'zod';
import { TipoProducto } from '@prisma/client';
import DOMPurify from 'isomorphic-dompurify';

// Schema para comparación
export const comparacionSchema = z.object({
  tipoProducto: z.nativeEnum(TipoProducto),
  montoSolicitado: z.number()
    .min(500000, 'Monto mínimo: $500,000')
    .max(200000000, 'Monto máximo: $200,000,000'),
  plazoMeses: z.number()
    .int('El plazo debe ser un número entero')
    .min(6, 'Plazo mínimo: 6 meses')
    .max(120, 'Plazo máximo: 120 meses'),
  ingresos: z.number()
    .min(1000000, 'Ingresos mínimos: $1,000,000')
    .max(1000000000, 'Ingresos máximos: $1,000,000,000'),
  edad: z.number()
    .int('La edad debe ser un número entero')
    .min(18, 'Edad mínima: 18 años')
    .max(80, 'Edad máxima: 80 años'),
  tipoEmpleo: z.enum(['dependiente', 'independiente', 'pensionado']),
});

// Schema para compra de cartera (extiende comparación)
export const compraCarteraSchema = comparacionSchema.extend({
  tipoProducto: z.literal(TipoProducto.COMPRA_CARTERA),
  deudaActual: z.number()
    .min(1000000, 'Deuda mínima: $1,000,000')
    .max(500000000, 'Deuda máxima: $500,000,000'),
  cuotaActual: z.number()
    .min(100000, 'Cuota mínima: $100,000')
    .max(50000000, 'Cuota máxima: $50,000,000'),
  tasaActual: z.number()
    .min(0.1, 'Tasa mínima: 0.1%')
    .max(10, 'Tasa máxima: 10%'),
});

// Schema para tracking de evento
export const eventoTrackingSchema = z.object({
  tipoEvento: z.string().min(1).max(100),
  categoria: z.string().min(1).max(100),
  accion: z.string().min(1).max(100),
  metadata: z.record(z.any()),
  url: z.string().url().optional().or(z.literal('')),
  utmSource: z.string().optional(),
  utmMedium: z.string().optional(),
  utmCampaign: z.string().optional(),
});

// Schema para tracking de clic
export const clicTrackingSchema = z.object({
  productoId: z.string().uuid(),
  posicion: z.number().int().min(1).max(100),
  montoSolicitado: z.number().positive(),
  plazoMeses: z.number().int().positive(),
  tipoProducto: z.nativeEnum(TipoProducto),
});

// Funciones de validación
export function validateComparacion(data: unknown) {
  return comparacionSchema.parse(data);
}

export function validateCompraCartera(data: unknown) {
  return compraCarteraSchema.parse(data);
}

export function validateEventoTracking(data: unknown) {
  return eventoTrackingSchema.parse(data);
}

export function validateClicTracking(data: unknown) {
  return clicTrackingSchema.parse(data);
}

// Sanitización de strings
export function sanitizeString(input: string): string {
  return DOMPurify.sanitize(input, {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [],
  }).trim();
}

// Validar que un monto esté en el rango de un producto
export function validarMontoEnRango(
  monto: number,
  montoMinimo: number,
  montoMaximo: number
): boolean {
  return monto >= montoMinimo && monto <= montoMaximo;
}

// Validar que un plazo esté en el rango de un producto
export function validarPlazoEnRango(
  plazo: number,
  plazoMinimo: number,
  plazoMaximo: number
): boolean {
  return plazo >= plazoMinimo && plazo <= plazoMaximo;
}

// Validar edad
export function validarEdad(
  edad: number,
  edadMinima: number,
  edadMaxima: number
): boolean {
  return edad >= edadMinima && edad <= edadMaxima;
}

// Validar ingresos mínimos
export function validarIngresos(
  ingresos: number,
  ingresoMinimo: number
): boolean {
  return ingresos >= ingresoMinimo;
}
