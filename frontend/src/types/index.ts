// Tipos de productos
export enum TipoProducto {
  LIBRE_INVERSION = 'LIBRE_INVERSION',
  COMPRA_CARTERA = 'COMPRA_CARTERA',
}

export enum TipoEmpleo {
  DEPENDIENTE = 'dependiente',
  INDEPENDIENTE = 'independiente',
  PENSIONADO = 'pensionado',
}

export enum TipoEntidad {
  BANCO = 'BANCO',
  FINTECH = 'FINTECH',
  COOPERATIVA = 'COOPERATIVA',
  OTRA = 'OTRA',
}

// Formulario de comparación
export interface ComparacionFormData {
  tipoProducto: TipoProducto;
  montoSolicitado: number;
  plazoMeses: number;
  ingresos: number;
  edad: number;
  tipoEmpleo: TipoEmpleo;
  // Para compra de cartera
  deudaActual?: number;
  cuotaActual?: number;
  tasaActual?: number;
}

// Oferta comparada
export interface OfertaComparada {
  id: string;
  entidad: {
    id: string;
    nombre: string;
    logo: string | null;
    tipo: TipoEntidad;
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

// Resultado de comparación
export interface ResultadoComparacion {
  ofertas: OfertaComparada[];
  resumen: {
    totalOfertas: number;
    mejorTasa: number;
    peorTasa: number;
    promedioTasa: number;
    mejorCuota: number;
  };
  parametrosBusqueda: ComparacionFormData;
  fechaConsulta: string;
}

// API Response
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  metadata?: {
    timestamp: string;
  };
}
