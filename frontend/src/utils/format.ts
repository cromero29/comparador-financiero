/**
 * Utilidades para formateo de valores
 */

// Formatear moneda colombiana
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

// Formatear número con separadores de miles
export const formatNumber = (value: number): string => {
  return new Intl.NumberFormat('es-CO').format(value);
};

// Formatear porcentaje
export const formatPercentage = (value: number, decimals: number = 2): string => {
  return `${value.toFixed(decimals)}%`;
};

// Formatear plazo en meses
export const formatPlazo = (meses: number): string => {
  if (meses === 1) return '1 mes';
  if (meses < 12) return `${meses} meses`;
  
  const años = Math.floor(meses / 12);
  const mesesRestantes = meses % 12;
  
  if (mesesRestantes === 0) {
    return años === 1 ? '1 año' : `${años} años`;
  }
  
  const añosTexto = años === 1 ? '1 año' : `${años} años`;
  return `${añosTexto} y ${mesesRestantes} ${mesesRestantes === 1 ? 'mes' : 'meses'}`;
};

// Acortar números grandes
export const formatShortNumber = (value: number): string => {
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`;
  }
  if (value >= 1000) {
    return `${(value / 1000).toFixed(0)}K`;
  }
  return value.toString();
};

// Capitalizar primera letra
export const capitalize = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

// Truncar texto
export const truncate = (str: string, maxLength: number): string => {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength) + '...';
};

// Formatear fecha
export const formatDate = (date: string | Date): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('es-CO', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(d);
};

// Formatear fecha y hora
export const formatDateTime = (date: string | Date): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('es-CO', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(d);
};
