// API URL
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api/v1';

// Rangos de valores
export const RANGOS = {
  MONTO: {
    MIN: 500000,
    MAX: 200000000,
    STEP: 100000,
  },
  PLAZO: {
    MIN: 6,
    MAX: 60,
    STEP: 6,
  },
  INGRESOS: {
    MIN: 1000000,
    MAX: 100000000,
    STEP: 100000,
  },
  EDAD: {
    MIN: 18,
    MAX: 80,
  },
};

// Valores por defecto
export const DEFAULTS = {
  MONTO: 30000000,
  PLAZO: 36,
  INGRESOS: 5000000,
  EDAD: 35,
  TIPO_EMPLEO: 'dependiente',
};

// Textos
export const TEXTOS = {
  APP_NAME: 'Comparador Financiero',
  APP_DESCRIPTION: 'Compara créditos y encuentra la mejor opción para ti',
  
  TIPOS_PRODUCTO: {
    LIBRE_INVERSION: 'Crédito de Libre Inversión',
    COMPRA_CARTERA: 'Compra de Cartera',
  },
  
  TIPOS_EMPLEO: {
    dependiente: 'Empleado',
    independiente: 'Independiente',
    pensionado: 'Pensionado',
  },
  
  TIPOS_ENTIDAD: {
    BANCO: 'Banco',
    FINTECH: 'Fintech',
    COOPERATIVA: 'Cooperativa',
    OTRA: 'Otra',
  },
};

// Iconos de entidades (placeholders)
export const ENTIDAD_ICONS: Record<string, string> = {
  BANCOLOMBIA: '🏦',
  DAVIVIENDA: '🏦',
  BBVA: '🏦',
  BANCO_BOGOTA: '🏦',
  RAPPIPAY: '⚡',
  ADDI: '⚡',
  LINERU: '⚡',
  COOFINEP: '🤝',
};

// Colores por ranking
export const RANKING_COLORS = {
  1: 'bg-green-100 border-green-500 text-green-800',
  2: 'bg-blue-100 border-blue-500 text-blue-800',
  3: 'bg-yellow-100 border-yellow-500 text-yellow-800',
  default: 'bg-gray-100 border-gray-300 text-gray-700',
};

// Query keys para React Query
export const QUERY_KEYS = {
  COMPARACION: 'comparacion',
  PRODUCTOS: 'productos',
  ESTADISTICAS: 'estadisticas',
};
