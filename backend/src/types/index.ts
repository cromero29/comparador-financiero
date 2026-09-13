import { TipoProducto } from '@prisma/client';

// ============================================
// REQUEST TYPES
// ============================================

export interface ComparacionRequest {
  tipoProducto: TipoProducto;
  montoSolicitado: number;
  plazoMeses: number;
  ingresos: number;
  edad: number;
  tipoEmpleo: 'dependiente' | 'independiente' | 'pensionado';
}

export interface CompraCarteraRequest extends ComparacionRequest {
  tipoProducto: TipoProducto.COMPRA_CARTERA;
  deudaActual: number;
  cuotaActual: number;
  tasaActual: number;
}

// ============================================
// RESPONSE TYPES
// ============================================

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: ApiError;
  metadata?: ResponseMetadata;
}

export interface ApiError {
  code: string;
  message: string;
  details?: any;
}

export interface ResponseMetadata {
  timestamp: string;
  requestId?: string;
  pagination?: PaginationMetadata;
}

export interface PaginationMetadata {
  page: number;
  pageSize: number;
  totalPages: number;
  totalItems: number;
}

// ============================================
// COMPARACIÓN TYPES
// ============================================

export interface OfertaComparada {
  id: string;
  entidad: {
    id: string;
    nombre: string;
    logo: string | null;
    tipo: string;
  };
  producto: {
    id: string;
    nombre: string;
    tipo: TipoProducto;
  };
  condiciones: {
    tasaNominalMensual: number;
    tasaNominalAnual: number;
    tasaEfectivaAnual: number;
    plazoMeses: number;
  };
  cuota: {
    mensual: number;
    seguroVida: number;
    seguroDesempleo: number;
    total: number;
  };
  costos: {
    estudio: number;
    administracion: number;
    seguros: number;
    total: number;
  };
  totales: {
    aPagar: number;
    intereses: number;
    costoTotal: number;
  };
  ranking: {
    posicion: number;
    puntaje: number;
    razonamiento: string;
  };
  elegibilidad: {
    cumple: boolean;
    razones: string[];
  };
  ahorroCompraCartera?: {
    ahorroCuota: number;
    ahorroTotal: number;
    porcentajeAhorro: number;
  };
  urlSolicitud: string;
}

export interface ResultadoComparacion {
  ofertas: OfertaComparada[];
  resumen: {
    totalOfertas: number;
    mejorTasa: number;
    peorTasa: number;
    promedioTasa: number;
    mejorCuota: number;
  };
  parametrosBusqueda: ComparacionRequest;
  fechaConsulta: Date;
}

// ============================================
// SCRAPING TYPES
// ============================================

export interface ScraperResult {
  exitoso: boolean;
  productosEncontrados: number;
  productos?: ProductoScrapeado[];
  error?: string;
  duracionMs: number;
}

export interface ProductoScrapeado {
  nombre: string;
  tasaNominalMensual?: number;
  tasaNominalAnual?: number;
  tasaEfectivaAnual?: number;
  montoMinimo?: number;
  montoMaximo?: number;
  plazoMinimoMeses?: number;
  plazoMaximoMeses?: number;
  costoEstudio?: number;
  ingresoMinimo?: number;
  metadata?: Record<string, any>;
}

// ============================================
// TRACKING TYPES
// ============================================

export interface EventoTrackingData {
  tipoEvento: string;
  categoria: string;
  accion: string;
  metadata: Record<string, any>;
  url: string;
  dispositivo: string;
  navegador: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
}

export interface ClicTrackingData {
  productoId: string;
  posicion: number;
  montoSolicitado: number;
  plazoMeses: number;
  tipoProducto: TipoProducto;
}

// ============================================
// UTILITY TYPES
// ============================================

export type Nullable<T> = T | null;

export type Optional<T> = T | undefined;

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};
