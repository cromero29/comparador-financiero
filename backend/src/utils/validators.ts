import { z } from 'zod';
import { TipoProducto, TipoEntidad } from '@prisma/client';
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

// ============================================
// SCHEMAS DE TRACKING DETALLADO (endpoints nuevos)
// ============================================
// Límites de longitud para evitar payloads maliciosos y datos basura
// que contaminen los reportes de analytics.

const shortText = (max = 255) => z.string().trim().max(max).optional();
const uuidField = z.string().uuid();

// POST /sesion/iniciar
export const iniciarSesionSchema = z.object({
  fingerprint: z.string().trim().max(255).optional(),
  userAgent: z.string().trim().max(1000).optional(),
  dispositivo: z.enum(['desktop', 'mobile', 'tablet']).optional(),
  navegador: shortText(50),
  sistemaOperativo: shortText(50),
  utmSource: shortText(255),
  utmMedium: shortText(255),
  utmCampaign: shortText(255),
  utmContent: shortText(255),
  utmTerm: shortText(255),
  referrer: z.string().trim().max(2000).optional(),
});

// POST /busqueda/registrar
export const registrarBusquedaSchema = z.object({
  sesionId: uuidField,
  tipoProducto: z.nativeEnum(TipoProducto),
  montoSolicitado: z.number().positive().max(1_000_000_000),
  plazoMeses: z.number().int().min(1).max(600),
  ingresos: z.number().positive().max(10_000_000_000),
  edad: z.number().int().min(18).max(100),
  tipoEmpleo: z.enum(['dependiente', 'independiente', 'pensionado']),
  deudaActual: z.number().nonnegative().max(10_000_000_000).optional(),
  cuotaActual: z.number().nonnegative().max(1_000_000_000).optional(),
  tasaActual: z.number().nonnegative().max(100).optional(),
  ofertasEncontradas: z.number().int().min(0).max(1000),
  mejorTasa: z.number().nonnegative().max(1000),
  mejorCuota: z.number().nonnegative().max(1_000_000_000),
  entidad1Id: shortText(100),
  entidad2Id: shortText(100),
  entidad3Id: shortText(100),
});

// POST /busqueda/engagement
export const engagementSchema = z.object({
  busquedaId: uuidField,
  tiempoEnResultados: z.number().int().min(0).max(86400).optional(),
  ofertasExpandidas: z.number().int().min(0).max(1000).optional(),
  generoClic: z.boolean().optional(),
  clicsGenerados: z.number().int().min(0).max(1000).optional(),
});

// POST /clic/registrar
export const registrarClicSchema = z.object({
  sesionId: uuidField,
  busquedaId: uuidField.optional().nullable(),
  productoId: z.string().trim().max(100),
  entidadId: z.string().trim().max(100),
  entidadNombre: z.string().trim().max(255),
  entidadTipo: z.nativeEnum(TipoEntidad),
  posicion: z.number().int().min(1).max(1000),
  paginaResultados: z.number().int().min(1).max(1000),
  montoSolicitado: z.number().positive().max(1_000_000_000),
  plazoMeses: z.number().int().min(1).max(600),
  tipoProducto: z.nativeEnum(TipoProducto),
  tasaOfrecida: z.number().nonnegative().max(1000),
  cuotaOfrecida: z.number().nonnegative().max(1_000_000_000),
  edad: z.number().int().min(18).max(100),
  ingresos: z.number().positive().max(10_000_000_000),
  tipoEmpleo: z.string().trim().max(50),
  urlDestino: z.string().trim().max(2000).default(''),
  redireccionExitosa: z.boolean().default(true),
});

// POST /evento/registrar
export const registrarEventoSchema = z.object({
  sesionId: uuidField,
  tipoEvento: z.string().trim().min(1).max(100),
  categoria: z.string().trim().min(1).max(100),
  accion: z.string().trim().min(1).max(100),
  etiqueta: z.string().trim().max(255).optional(),
  // metadata limitado a 4KB serializado para evitar payloads abusivos
  metadata: z
    .record(z.any())
    .refine((obj) => JSON.stringify(obj).length <= 4096, {
      message: 'metadata excede el tamaño máximo permitido (4KB)',
    })
    .optional(),
  url: z.string().trim().max(2000).optional(),
  pathname: z.string().trim().max(500).optional(),
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
