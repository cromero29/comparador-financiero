/**
 * Utilidades para cálculos financieros
 * Sistema de Amortización Francés (cuota fija)
 */

// Calcular cuota mensual usando sistema francés
export function calcularCuotaMensual(
  monto: number,
  tasaMensual: number, // Tasa mensual en decimal (ej: 0.015 para 1.5%)
  plazoMeses: number
): number {
  if (tasaMensual === 0) {
    return monto / plazoMeses;
  }

  const numerador = monto * tasaMensual * Math.pow(1 + tasaMensual, plazoMeses);
  const denominador = Math.pow(1 + tasaMensual, plazoMeses) - 1;
  
  return numerador / denominador;
}

// Calcular tasa efectiva anual (TEA) desde tasa nominal anual
export function calcularTEA(
  tasaNominalAnual: number, // En decimal (ej: 0.18 para 18%)
  periodosPorAnio: number = 12
): number {
  const tasaPeriodo = tasaNominalAnual / periodosPorAnio;
  return Math.pow(1 + tasaPeriodo, periodosPorAnio) - 1;
}

// Calcular tasa nominal mensual desde tasa nominal anual
export function calcularTasaMensual(tasaNominalAnual: number): number {
  return tasaNominalAnual / 12;
}

// Calcular costo total del crédito
export function calcularCostoTotal(
  monto: number,
  tasaMensual: number,
  plazoMeses: number,
  costoEstudio: number = 0,
  porcentajeAdministracion: number = 0, // % mensual
  porcentajeSeguroVida: number = 0, // % mensual
  porcentajeSeguroDesempleo: number = 0 // % mensual
): {
  cuotaMensual: number;
  seguroVidaMensual: number;
  seguroDesempleoMensual: number;
  administracionMensual: number;
  cuotaTotal: number;
  totalPagar: number;
  totalIntereses: number;
  totalCostos: number;
} {
  // Cuota base (solo capital + interés)
  const cuotaMensual = calcularCuotaMensual(monto, tasaMensual, plazoMeses);
  
  // Seguros calculados sobre el saldo (aproximación: sobre monto inicial)
  const seguroVidaMensual = (monto * porcentajeSeguroVida) / 100;
  const seguroDesempleoMensual = (monto * porcentajeSeguroDesempleo) / 100;
  
  // Administración sobre la cuota
  const administracionMensual = (cuotaMensual * porcentajeAdministracion) / 100;
  
  // Cuota total mensual
  const cuotaTotal = cuotaMensual + seguroVidaMensual + seguroDesempleoMensual + administracionMensual;
  
  // Total a pagar
  const totalPagar = (cuotaTotal * plazoMeses) + costoEstudio;
  
  // Total de intereses
  const totalIntereses = (cuotaMensual * plazoMeses) - monto;
  
  // Total de costos adicionales
  const totalCostos = (
    costoEstudio +
    (seguroVidaMensual * plazoMeses) +
    (seguroDesempleoMensual * plazoMeses) +
    (administracionMensual * plazoMeses)
  );
  
  return {
    cuotaMensual,
    seguroVidaMensual,
    seguroDesempleoMensual,
    administracionMensual,
    cuotaTotal,
    totalPagar,
    totalIntereses,
    totalCostos,
  };
}

// Calcular tabla de amortización (primeras 3 cuotas como preview)
export interface CuotaAmortizacion {
  numero: number;
  cuota: number;
  capital: number;
  interes: number;
  saldo: number;
}

export function calcularTablaAmortizacion(
  monto: number,
  tasaMensual: number,
  plazoMeses: number,
  limiteCuotas: number = 3 // Solo primeras N cuotas para preview
): CuotaAmortizacion[] {
  const cuotaMensual = calcularCuotaMensual(monto, tasaMensual, plazoMeses);
  const tabla: CuotaAmortizacion[] = [];
  
  let saldo = monto;
  
  for (let i = 1; i <= Math.min(limiteCuotas, plazoMeses); i++) {
    const interes = saldo * tasaMensual;
    const capital = cuotaMensual - interes;
    saldo = saldo - capital;
    
    tabla.push({
      numero: i,
      cuota: cuotaMensual,
      capital,
      interes,
      saldo: saldo > 0 ? saldo : 0,
    });
  }
  
  return tabla;
}

// Calcular ahorro en compra de cartera
export function calcularAhorroCompraCartera(
  deudaActual: number,
  cuotaActual: number,
  tasaActualMensual: number,
  nuevaTasaMensual: number,
  plazoMeses: number
): {
  nuevaCuota: number;
  ahorroCuota: number;
  totalActual: number;
  totalNuevo: number;
  ahorroTotal: number;
  porcentajeAhorro: number;
} {
  // Calcular plazo restante de la deuda actual (aproximación)
  const plazoActualRestante = Math.ceil(
    Math.log(cuotaActual / (cuotaActual - (deudaActual * tasaActualMensual))) /
    Math.log(1 + tasaActualMensual)
  );
  
  // Nueva cuota con la nueva tasa
  const nuevaCuota = calcularCuotaMensual(deudaActual, nuevaTasaMensual, plazoMeses);
  
  // Ahorro mensual
  const ahorroCuota = cuotaActual - nuevaCuota;
  
  // Total a pagar actual vs nuevo
  const totalActual = cuotaActual * plazoActualRestante;
  const totalNuevo = nuevaCuota * plazoMeses;
  const ahorroTotal = totalActual - totalNuevo;
  
  // Porcentaje de ahorro
  const porcentajeAhorro = (ahorroTotal / totalActual) * 100;
  
  return {
    nuevaCuota,
    ahorroCuota,
    totalActual,
    totalNuevo,
    ahorroTotal,
    porcentajeAhorro,
  };
}

// Validar capacidad de pago (40-50% de ingresos)
export function validarCapacidadPago(
  cuotaMensual: number,
  ingresos: number,
  porcentajeMaximo: number = 50
): {
  cumple: boolean;
  porcentajeUtilizado: number;
  cuotaMaxima: number;
} {
  const cuotaMaxima = (ingresos * porcentajeMaximo) / 100;
  const porcentajeUtilizado = (cuotaMensual / ingresos) * 100;
  const cumple = cuotaMensual <= cuotaMaxima;
  
  return {
    cumple,
    porcentajeUtilizado,
    cuotaMaxima,
  };
}

// Formatear número a moneda colombiana
export function formatearMoneda(valor: number): string {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(valor);
}

// Formatear porcentaje
export function formatearPorcentaje(valor: number, decimales: number = 2): string {
  return `${valor.toFixed(decimales)}%`;
}

// Redondear a 2 decimales
export function redondear(valor: number, decimales: number = 2): number {
  return Math.round(valor * Math.pow(10, decimales)) / Math.pow(10, decimales);
}
