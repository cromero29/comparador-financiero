# Algoritmos de Comparación y Simulación
## Plataforma de Comparación Financiera

**Proyecto:** Comparador de Productos Financieros  
**Versión:** 1.0  
**Fecha:** Septiembre 2026  

---

## 1. VISIÓN GENERAL

Este documento especifica los algoritmos críticos que determinan:
1. **Elegibilidad:** ¿El usuario califica para un producto?
2. **Cálculo:** ¿Cuánto pagará mensualmente y en total?
3. **Ranking:** ¿Cuál es la mejor opción para el usuario?
4. **Simulación:** ¿Qué pasa si cambia monto o plazo?
5. **Ahorro:** ¿Cuánto ahorra vs su situación actual?

---

## 2. ALGORITMO DE ELEGIBILIDAD

### 2.1 Propósito
Determinar si un usuario cumple los requisitos para solicitar un producto específico.

### 2.2 Inputs
```typescript
interface ElegibilityInput {
  // Usuario
  ingresos: number;              // COP mensuales
  edad?: number;                 // Años
  tipoEmpleo: 'dependiente' | 'independiente' | 'pensionado';
  scoreCredito?: number;         // 0-999 (opcional en MVP)
  tieneReportes?: boolean;       // Centrales de riesgo
  
  // Crédito solicitado
  monto: number;                 // COP
  plazo: number;                 // Meses
  
  // Producto
  producto: Producto;
}
```

### 2.3 Reglas de Elegibilidad

```typescript
function esElegible(input: ElegibilityInput): ElegibilityResult {
  const errores: string[] = [];
  const advertencias: string[] = [];
  
  // 1. Verificar monto
  if (input.monto < input.producto.montoMinimo) {
    errores.push(
      `Monto mínimo: ${formatCurrency(input.producto.montoMinimo)}`
    );
  }
  
  if (input.monto > input.producto.montoMaximo) {
    errores.push(
      `Monto máximo: ${formatCurrency(input.producto.montoMaximo)}`
    );
  }
  
  // 2. Verificar plazo
  if (input.plazo < input.producto.plazoMinimo) {
    errores.push(`Plazo mínimo: ${input.producto.plazoMinimo} meses`);
  }
  
  if (input.plazo > input.producto.plazoMaximo) {
    errores.push(`Plazo máximo: ${input.producto.plazoMaximo} meses`);
  }
  
  // 3. Verificar ingresos
  if (input.ingresos < input.producto.ingresoMinimo) {
    errores.push(
      `Ingreso mínimo requerido: ${formatCurrency(input.producto.ingresoMinimo)}`
    );
  }
  
  // 4. Verificar edad (si disponible)
  if (input.edad) {
    if (input.edad < input.producto.edadMinima) {
      errores.push(`Edad mínima: ${input.producto.edadMinima} años`);
    }
    
    if (input.edad > input.producto.edadMaxima) {
      errores.push(`Edad máxima: ${input.producto.edadMaxima} años`);
    }
  }
  
  // 5. Verificar tipo de empleo
  if (!input.producto.tiposEmpleoPermitidos.includes(input.tipoEmpleo)) {
    errores.push(
      `Tipo de empleo no permitido. Permitidos: ${input.producto.tiposEmpleoPermitidos.join(', ')}`
    );
  }
  
  // 6. Verificar score crediticio (si está disponible)
  if (input.scoreCredito && input.producto.scoreMinimo) {
    if (input.scoreCredito < input.producto.scoreMinimo) {
      errores.push(
        `Score crediticio mínimo requerido: ${input.producto.scoreMinimo}`
      );
    }
  }
  
  // 7. Verificar reportes en centrales
  if (input.tieneReportes && input.producto.prohibeReportes) {
    errores.push('Este producto no acepta personas con reportes en centrales de riesgo');
  }
  
  // 8. Capacidad de pago (regla de oro: cuota <= 40% ingresos)
  const cuotaEstimada = calcularCuotaMensual({
    capital: input.monto,
    tasaMensual: input.producto.tasaMensual,
    plazo: input.plazo
  });
  
  const relacionCuotaIngreso = (cuotaEstimada / input.ingresos) * 100;
  
  if (relacionCuotaIngreso > 50) {
    errores.push(
      `La cuota estimada (${formatCurrency(cuotaEstimada)}) supera el 50% de tus ingresos. ` +
      `Se recomienda que no supere el 40%.`
    );
  } else if (relacionCuotaIngreso > 40) {
    advertencias.push(
      `La cuota estimada representa el ${relacionCuotaIngreso.toFixed(1)}% de tus ingresos. ` +
      `Se recomienda no superar el 40%.`
    );
  }
  
  // 9. Producto activo y disponible
  if (!input.producto.activo || !input.producto.disponible) {
    errores.push('Este producto no está disponible actualmente');
  }
  
  return {
    elegible: errores.length === 0,
    errores,
    advertencias,
    relacionCuotaIngreso,
    cuotaEstimada
  };
}

interface ElegibilityResult {
  elegible: boolean;
  errores: string[];
  advertencias: string[];
  relacionCuotaIngreso: number;    // %
  cuotaEstimada: number;            // COP
}
```

### 2.4 Ejemplos

**Ejemplo 1: Usuario Elegible**
```typescript
Input:
- Monto: $30.000.000
- Plazo: 36 meses
- Ingresos: $5.000.000
- Tipo empleo: dependiente

Producto:
- Monto: $1M - $50M
- Plazo: 12-60 meses
- Ingreso mínimo: $2M
- Tasa: 1.5% MV

Result:
✅ Elegible
- Cuota estimada: $1.042.000 (20.8% de ingresos)
- Sin advertencias
```

**Ejemplo 2: Usuario No Elegible - Ingresos Insuficientes**
```typescript
Input:
- Monto: $30.000.000
- Plazo: 36 meses
- Ingresos: $2.000.000
- Tipo empleo: dependiente

Result:
❌ No elegible
- Error: La cuota estimada ($1.042.000) supera el 50% de tus ingresos (52.1%)
```

---

## 3. ALGORITMO DE CÁLCULO FINANCIERO

### 3.1 Cálculo de Cuota Mensual (Sistema Francés - Cuota Fija)

**Fórmula:**
```
        P × i × (1 + i)^n
CM = ─────────────────────
        (1 + i)^n - 1

Donde:
CM = Cuota Mensual
P  = Principal (monto del crédito)
i  = Tasa de interés mensual (decimal)
n  = Número de cuotas (plazo en meses)
```

**Implementación:**
```typescript
interface CuotaInput {
  capital: number;        // Monto del crédito en COP
  tasaMensual: number;    // % mensual vencido (ej: 1.5 = 1.5%)
  plazo: number;          // Número de meses
}

function calcularCuotaMensual(input: CuotaInput): number {
  const P = input.capital;
  const i = input.tasaMensual / 100;  // Convertir a decimal
  const n = input.plazo;
  
  // Validaciones
  if (P <= 0 || i <= 0 || n <= 0) {
    throw new Error('Los valores deben ser positivos');
  }
  
  // Fórmula del sistema francés
  const numerador = P * i * Math.pow(1 + i, n);
  const denominador = Math.pow(1 + i, n) - 1;
  
  const cuota = numerador / denominador;
  
  // Redondear a 2 decimales
  return Math.round(cuota * 100) / 100;
}
```

**Ejemplos:**
```typescript
// Ejemplo 1
calcularCuotaMensual({
  capital: 30000000,
  tasaMensual: 1.5,
  plazo: 36
})
// Resultado: $1.042.224

// Ejemplo 2
calcularCuotaMensual({
  capital: 20000000,
  tasaMensual: 1.2,
  plazo: 48
})
// Resultado: $526.449

// Ejemplo 3
calcularCuotaMensual({
  capital: 50000000,
  tasaMensual: 1.8,
  plazo: 60
})
// Resultado: $1.289.431
```

### 3.2 Cálculo de Tasa Efectiva Anual (TEA)

**Fórmula:**
```
TEA = (1 + i)^12 - 1

Donde:
i = Tasa mensual vencida (decimal)
```

**Implementación:**
```typescript
function calcularTasaEfectivaAnual(tasaMensual: number): number {
  const i = tasaMensual / 100;
  const tea = (Math.pow(1 + i, 12) - 1) * 100;
  
  return Math.round(tea * 10000) / 10000; // 4 decimales
}

// Ejemplos
calcularTasaEfectivaAnual(1.5);  // 19.5618% EA
calcularTasaEfectivaAnual(1.2);  // 15.3866% EA
calcularTasaEfectivaAnual(1.0);  // 12.6825% EA
```

### 3.3 Conversión TEA a Tasa Mensual

**Fórmula:**
```
       12 ___________
i_mv = ⁿ√(1 + TEA) - 1

Donde:
TEA = Tasa efectiva anual (decimal)
```

**Implementación:**
```typescript
function convertirTEAaMensual(tea: number): number {
  const tasaDecimal = tea / 100;
  const tasaMensual = (Math.pow(1 + tasaDecimal, 1/12) - 1) * 100;
  
  return Math.round(tasaMensual * 10000) / 10000;
}

// Ejemplos
convertirTEAaMensual(19.5618);  // 1.5% MV
convertirTEAaMensual(15.3866);  // 1.2% MV
```

### 3.4 Cálculo de Costos Adicionales

```typescript
interface CostosAdicionalesInput {
  capital: number;
  plazo: number;
  saldoPendiente?: number;     // Para costos sobre saldo
  producto: Producto;
}

function calcularCostosAdicionales(input: CostosAdicionalesInput): CostosDetalle {
  const costos: CostosDetalle = {
    seguroVidaMensual: 0,
    seguroDesempleoMensual: 0,
    comisionDesembolso: 0,
    comisionEstudio: 0,
    otrosCostos: 0,
    totalMensual: 0,
    totalPeriodo: 0
  };
  
  // 1. Seguro de vida (sobre saldo pendiente, se promedia)
  if (input.producto.seguroVida > 0) {
    // Aproximación: promedio del saldo pendiente
    const saldoPromedio = input.capital / 2;
    costos.seguroVidaMensual = saldoPromedio * (input.producto.seguroVida / 100);
  }
  
  // 2. Seguro de desempleo (si aplica)
  if (input.producto.seguroDesempleo) {
    const saldoPromedio = input.capital / 2;
    costos.seguroDesempleoMensual = saldoPromedio * (input.producto.seguroDesempleo / 100);
  }
  
  // 3. Comisión de desembolso (única vez)
  if (input.producto.comisionDesembolso) {
    costos.comisionDesembolso = input.producto.comisionDesembolso;
  }
  
  // 4. Comisión de estudio (única vez)
  if (input.producto.comisionEstudio) {
    costos.comisionEstudio = input.producto.comisionEstudio;
  }
  
  // 5. Otros costos
  if (input.producto.otrosCostos) {
    costos.otrosCostos = input.producto.otrosCostos;
  }
  
  // Total mensual recurrente
  costos.totalMensual = 
    costos.seguroVidaMensual + 
    costos.seguroDesempleoMensual;
  
  // Total en todo el periodo
  costos.totalPeriodo = 
    (costos.totalMensual * input.plazo) +
    costos.comisionDesembolso +
    costos.comisionEstudio +
    costos.otrosCostos;
  
  return costos;
}

interface CostosDetalle {
  seguroVidaMensual: number;
  seguroDesempleoMensual: number;
  comisionDesembolso: number;
  comisionEstudio: number;
  otrosCostos: number;
  totalMensual: number;
  totalPeriodo: number;
}
```

### 3.5 Cálculo de Costo Total del Crédito

```typescript
interface CostoTotalInput {
  capital: number;
  cuotaMensual: number;
  plazo: number;
  producto: Producto;
}

function calcularCostoTotal(input: CostoTotalInput): CostoTotalResult {
  // 1. Total pagado en cuotas
  const totalCuotas = input.cuotaMensual * input.plazo;
  
  // 2. Costos adicionales
  const costosAdicionales = calcularCostosAdicionales({
    capital: input.capital,
    plazo: input.plazo,
    producto: input.producto
  });
  
  // 3. Costo total
  const costoTotal = totalCuotas + costosAdicionales.totalPeriodo;
  
  // 4. Intereses pagados
  const interesesPagados = costoTotal - input.capital;
  
  // 5. Cuota mensual total (incluyendo seguros)
  const cuotaMensualTotal = input.cuotaMensual + costosAdicionales.totalMensual;
  
  return {
    capital: input.capital,
    cuotaMensual: input.cuotaMensual,
    cuotaMensualTotal,
    totalCuotas,
    costosAdicionales: costosAdicionales.totalPeriodo,
    costoTotal,
    interesesPagados,
    desgloseCostos: costosAdicionales
  };
}

interface CostoTotalResult {
  capital: number;
  cuotaMensual: number;           // Sin seguros
  cuotaMensualTotal: number;      // Con seguros
  totalCuotas: number;
  costosAdicionales: number;
  costoTotal: number;
  interesesPagados: number;
  desgloseCostos: CostosDetalle;
}
```

**Ejemplo Completo:**
```typescript
const producto: Producto = {
  tasaMensual: 1.5,
  seguroVida: 0.054,
  comisionDesembolso: 50000,
  // ... otros campos
};

// 1. Calcular cuota
const cuota = calcularCuotaMensual({
  capital: 30000000,
  tasaMensual: 1.5,
  plazo: 36
});
// Resultado: $1.042.224

// 2. Calcular costo total
const costoTotal = calcularCostoTotal({
  capital: 30000000,
  cuotaMensual: cuota,
  plazo: 36,
  producto
});

// Resultado:
{
  capital: 30000000,
  cuotaMensual: 1042224,
  cuotaMensualTotal: 1050344,      // +$8.120 de seguros
  totalCuotas: 37520064,
  costosAdicionales: 342420,       // Seguros + comisiones
  costoTotal: 37862484,
  interesesPagados: 7862484,       // 26.2% del capital
  desgloseCostos: {
    seguroVidaMensual: 8120,
    comisionDesembolso: 50000,
    totalPeriodo: 342420
  }
}
```

---

## 4. ALGORITMO DE RANKING

### 4.1 Propósito
Ordenar las ofertas de mejor a peor según el beneficio para el usuario.

### 4.2 Sistema de Scoring Ponderado

```typescript
interface RankingFactores {
  costoTotal: number;        // 40% peso
  tasaMensual: number;       // 30% peso
  tiempoAprobacion: number;  // 20% peso
  requisitos: number;        // 10% peso
}

interface OfertaParaRanking {
  producto: Producto;
  cuotaMensual: number;
  costoTotal: number;
  cuotaMensualTotal: number;
}

function rankearOfertas(ofertas: OfertaParaRanking[]): OfertaRankeada[] {
  if (ofertas.length === 0) return [];
  
  // 1. Calcular valores min/max para normalización
  const costoMinimo = Math.min(...ofertas.map(o => o.costoTotal));
  const costoMaximo = Math.max(...ofertas.map(o => o.costoTotal));
  
  const tasaMinima = Math.min(...ofertas.map(o => o.producto.tasaMensual));
  const tasaMaxima = Math.max(...ofertas.map(o => o.producto.tasaMensual));
  
  // 2. Calcular score para cada oferta
  const ofertasConScore = ofertas.map(oferta => {
    // Score de costo (invertido: menor costo = mayor score)
    const scoreCosto = costoMaximo === costoMinimo ? 100 :
      100 - ((oferta.costoTotal - costoMinimo) / (costoMaximo - costoMinimo)) * 100;
    
    // Score de tasa (invertido: menor tasa = mayor score)
    const scoreTasa = tasaMaxima === tasaMinima ? 100 :
      100 - ((oferta.producto.tasaMensual - tasaMinima) / (tasaMaxima - tasaMinima)) * 100;
    
    // Score de tiempo de aprobación
    const scoreTiempo = calcularScoreTiempo(oferta.producto.tiempoAprobacion);
    
    // Score de requisitos (menos requisitos = mejor)
    const scoreRequisitos = calcularScoreRequisitos(oferta.producto);
    
    // Score total ponderado
    const scoreTotal = 
      (scoreCosto * 0.40) +
      (scoreTasa * 0.30) +
      (scoreTiempo * 0.20) +
      (scoreRequisitos * 0.10);
    
    return {
      ...oferta,
      scores: {
        costo: scoreCosto,
        tasa: scoreTasa,
        tiempo: scoreTiempo,
        requisitos: scoreRequisitos,
        total: scoreTotal
      }
    };
  });
  
  // 3. Ordenar por score total (descendente)
  const ofertasOrdenadas = ofertasConScore.sort((a, b) => 
    b.scores.total - a.scores.total
  );
  
  // 4. Asignar posición y badges
  return ofertasOrdenadas.map((oferta, index) => ({
    ...oferta,
    posicion: index + 1,
    badges: generarBadges(oferta, ofertasOrdenadas)
  }));
}

function calcularScoreTiempo(tiempoAprobacion: string): number {
  // Extraer número de horas/días
  const match = tiempoAprobacion.match(/(\d+)\s*(hora|día)/i);
  if (!match) return 50; // Default
  
  const cantidad = parseInt(match[1]);
  const unidad = match[2].toLowerCase();
  
  // Convertir todo a horas
  const horas = unidad === 'día' ? cantidad * 24 : cantidad;
  
  // Score: 2 horas = 100, 72 horas = 0, interpolación lineal
  if (horas <= 2) return 100;
  if (horas >= 72) return 0;
  
  return 100 - ((horas - 2) / 70) * 100;
}

function calcularScoreRequisitos(producto: Producto): number {
  // En MVP, usar heurística simple
  // Futuro: contar requisitos reales de la tabla RequisitoProducto
  
  let score = 100;
  
  // Penalizar si requiere documentos complejos
  if (producto.requiereFirmaFisica) score -= 20;
  if (!producto.procesoDigital) score -= 30;
  if (producto.scoreMinimo && producto.scoreMinimo > 600) score -= 10;
  if (producto.prohibeReportes) score -= 10;
  
  return Math.max(0, score);
}

function generarBadges(
  oferta: OfertaRankeada, 
  todasLasOfertas: OfertaRankeada[]
): string[] {
  const badges: string[] = [];
  
  // Mejor opción
  if (oferta.posicion === 1) {
    badges.push('Mejor Opción');
  }
  
  // Tasa más baja
  const tasaMasBaja = Math.min(...todasLasOfertas.map(o => o.producto.tasaMensual));
  if (oferta.producto.tasaMensual === tasaMasBaja) {
    badges.push('Tasa Más Baja');
  }
  
  // Cuota más baja
  const cuotaMasBaja = Math.min(...todasLasOfertas.map(o => o.cuotaMensualTotal));
  if (oferta.cuotaMensualTotal === cuotaMasBaja) {
    badges.push('Cuota Más Baja');
  }
  
  // Aprobación más rápida
  if (oferta.scores.tiempo >= 90) {
    badges.push('Aprobación Rápida');
  }
  
  // 100% digital
  if (oferta.producto.procesoDigital && !oferta.producto.requiereFirmaFisica) {
    badges.push('100% Digital');
  }
  
  // Patrocinado
  if (oferta.producto.patrocinado) {
    badges.push('Patrocinado');
  }
  
  return badges;
}

interface OfertaRankeada extends OfertaParaRanking {
  posicion: number;
  scores: {
    costo: number;
    tasa: number;
    tiempo: number;
    requisitos: number;
    total: number;
  };
  badges: string[];
}
```

### 4.3 Ejemplo de Ranking

**Input: 3 ofertas para crédito de $30M a 36 meses**

```typescript
Oferta A (Banco):
- Tasa: 1.5% MV
- Cuota: $1.042.000
- Costo total: $37.862.000
- Tiempo: 48 horas
- Digital: No (requiere firma física)

Oferta B (Fintech):
- Tasa: 1.2% MV
- Cuota: $986.000
- Costo total: $35.796.000
- Tiempo: 2 horas
- Digital: Sí

Oferta C (Cooperativa):
- Tasa: 1.8% MV
- Cuota: $1.098.000
- Costo total: $39.828.000
- Tiempo: 72 horas
- Digital: No

Ranking Result:

🥇 #1 - Oferta B (Fintech)
- Score: 92.5
  - Costo: 100 (mejor)
  - Tasa: 100 (mejor)
  - Tiempo: 100 (mejor)
  - Requisitos: 85
- Badges: ["Mejor Opción", "Tasa Más Baja", "Cuota Más Baja", "Aprobación Rápida", "100% Digital"]

🥈 #2 - Oferta A (Banco)
- Score: 66.8
  - Costo: 50.7
  - Tasa: 66.7
  - Tiempo: 65
  - Requisitos: 50
- Badges: []

🥉 #3 - Oferta C (Cooperativa)
- Score: 40.7
  - Costo: 0
  - Tasa: 0
  - Tiempo: 0
  - Requisitos: 50
- Badges: []
```

---

## 5. ALGORITMO DE COMPARACIÓN COMPLETA

### 5.1 Flujo Principal

```typescript
interface SolicitudComparacion {
  // Usuario
  ingresos: number;
  edad?: number;
  tipoEmpleo: 'dependiente' | 'independiente' | 'pensionado';
  scoreCredito?: number;
  tieneReportes?: boolean;
  
  // Crédito
  tipoProducto: 'libre-inversion' | 'compra-cartera';
  montoSolicitado: number;
  plazoMeses: number;
  
  // Compra de cartera
  montoTotalDeudas?: number;
  cuotaMensualActual?: number;
}

async function compararOfertas(
  solicitud: SolicitudComparacion
): Promise<ResultadoComparacion> {
  
  // 1. Obtener productos activos del tipo solicitado
  const productosDisponibles = await obtenerProductosActivos(solicitud.tipoProducto);
  
  // 2. Filtrar por elegibilidad
  const productosElegibles = productosDisponibles.filter(producto => {
    const elegibilidad = esElegible({
      ingresos: solicitud.ingresos,
      edad: solicitud.edad,
      tipoEmpleo: solicitud.tipoEmpleo,
      scoreCredito: solicitud.scoreCredito,
      tieneReportes: solicitud.tieneReportes,
      monto: solicitud.montoSolicitado,
      plazo: solicitud.plazoMeses,
      producto
    });
    
    return elegibilidad.elegible;
  });
  
  // 3. Calcular oferta completa para cada producto
  const ofertas: OfertaCompleta[] = productosElegibles.map(producto => {
    // Cuota base
    const cuotaMensual = calcularCuotaMensual({
      capital: solicitud.montoSolicitado,
      tasaMensual: producto.tasaMensual,
      plazo: solicitud.plazoMeses
    });
    
    // Costo total
    const costoTotal = calcularCostoTotal({
      capital: solicitud.montoSolicitado,
      cuotaMensual,
      plazo: solicitud.plazoMeses,
      producto
    });
    
    // Ahorro (solo para compra de cartera)
    let ahorro: AhorroDetalle | undefined;
    if (solicitud.tipoProducto === 'compra-cartera' && solicitud.cuotaMensualActual) {
      ahorro = calcularAhorro({
        cuotaActual: solicitud.cuotaMensualActual,
        cuotaNueva: costoTotal.cuotaMensualTotal,
        plazo: solicitud.plazoMeses,
        montoTotalDeudasActual: solicitud.montoTotalDeudas || solicitud.montoSolicitado
      });
    }
    
    return {
      producto,
      cuotaMensual,
      cuotaMensualTotal: costoTotal.cuotaMensualTotal,
      costoTotal: costoTotal.costoTotal,
      desgloseCostos: costoTotal,
      ahorro,
      relacionCuotaIngreso: (costoTotal.cuotaMensualTotal / solicitud.ingresos) * 100
    };
  });
  
  // 4. Rankear ofertas
  const ofertasRankeadas = rankearOfertas(ofertas);
  
  // 5. Generar resumen
  const resumen = generarResumen(ofertasRankeadas, solicitud);
  
  return {
    solicitud,
    ofertas: ofertasRankeadas,
    resumen,
    metadata: {
      totalProductosEvaluados: productosDisponibles.length,
      totalOfertasElegibles: ofertasRankeadas.length,
      fechaConsulta: new Date(),
      vigenciaHoras: 48
    }
  };
}

interface OfertaCompleta extends OfertaParaRanking {
  desgloseCostos: CostoTotalResult;
  ahorro?: AhorroDetalle;
  relacionCuotaIngreso: number;
}

interface ResultadoComparacion {
  solicitud: SolicitudComparacion;
  ofertas: OfertaRankeada[];
  resumen: ResumenComparacion;
  metadata: {
    totalProductosEvaluados: number;
    totalOfertasElegibles: number;
    fechaConsulta: Date;
    vigenciaHoras: number;
  };
}
```

---

## 6. ALGORITMO DE AHORRO (Compra de Cartera)

### 6.1 Propósito
Calcular cuánto ahorra el usuario al consolidar sus deudas.

```typescript
interface AhorroInput {
  cuotaActual: number;              // Cuota mensual actual total
  cuotaNueva: number;               // Cuota mensual del nuevo crédito
  plazo: number;                    // Plazo del nuevo crédito
  montoTotalDeudasActual: number;   // Monto total adeudado
}

function calcularAhorro(input: AhorroInput): AhorroDetalle {
  // 1. Ahorro mensual
  const ahorroMensual = input.cuotaActual - input.cuotaNueva;
  const ahorroPorcentual = (ahorroMensual / input.cuotaActual) * 100;
  
  // 2. Ahorro en el periodo
  const ahorroTotal = ahorroMensual * input.plazo;
  
  // 3. Validaciones
  if (ahorroMensual < 0) {
    return {
      haAhorro: false,
      ahorroMensual: 0,
      ahorroPorcentual: 0,
      ahorroTotal: 0,
      mensaje: 'La nueva cuota sería más alta que la actual. No se recomienda esta consolidación.'
    };
  }
  
  if (ahorroPorcentual < 5) {
    return {
      haAhorro: true,
      ahorroMensual,
      ahorroPorcentual,
      ahorroTotal,
      mensaje: 'El ahorro es menor al 5%. Evalúa si vale la pena consolidar.'
    };
  }
  
  return {
    haAhorro: true,
    ahorroMensual,
    ahorroPorcentual,
    ahorroTotal,
    mensaje: `Ahorrarás ${formatCurrency(ahorroMensual)} mensuales (${ahorroPorcentual.toFixed(1)}%)`
  };
}

interface AhorroDetalle {
  haAhorro: boolean;
  ahorroMensual: number;
  ahorroPorcentual: number;
  ahorroTotal: number;
  mensaje: string;
}
```

**Ejemplo:**
```typescript
const ahorro = calcularAhorro({
  cuotaActual: 1500000,        // Pagando actualmente
  cuotaNueva: 1050000,         // Pagaría con nueva oferta
  plazo: 48,
  montoTotalDeudasActual: 25000000
});

// Resultado:
{
  haAhorro: true,
  ahorroMensual: 450000,
  ahorroPorcentual: 30,
  ahorroTotal: 21600000,       // En 48 meses
  mensaje: "Ahorrarás $450.000 mensuales (30.0%)"
}
```

---

## 7. TABLA DE AMORTIZACIÓN

### 7.1 Generación de Tabla Completa

```typescript
interface FilaAmortizacion {
  cuota: number;                // Número de cuota
  saldoInicial: number;
  capital: number;              // Abono a capital
  interes: number;              // Intereses
  seguro: number;               // Seguros
  cuotaTotal: number;
  saldoFinal: number;
}

function generarTablaAmortizacion(
  capital: number,
  tasaMensual: number,
  plazo: number,
  producto: Producto
): FilaAmortizacion[] {
  
  const tabla: FilaAmortizacion[] = [];
  const cuotaBase = calcularCuotaMensual({ capital, tasaMensual, plazo });
  const tasaDecimal = tasaMensual / 100;
  
  let saldo = capital;
  
  for (let mes = 1; mes <= plazo; mes++) {
    // Interés del mes
    const interes = saldo * tasaDecimal;
    
    // Abono a capital
    const abonoCapital = cuotaBase - interes;
    
    // Seguro de vida sobre saldo
    const seguro = saldo * (producto.seguroVida / 100);
    
    // Cuota total
    const cuotaTotal = cuotaBase + seguro;
    
    // Nuevo saldo
    const nuevoSaldo = saldo - abonoCapital;
    
    tabla.push({
      cuota: mes,
      saldoInicial: Math.round(saldo * 100) / 100,
      capital: Math.round(abonoCapital * 100) / 100,
      interes: Math.round(interes * 100) / 100,
      seguro: Math.round(seguro * 100) / 100,
      cuotaTotal: Math.round(cuotaTotal * 100) / 100,
      saldoFinal: Math.round(nuevoSaldo * 100) / 100
    });
    
    saldo = nuevoSaldo;
  }
  
  return tabla;
}
```

**Ejemplo de salida (primeras 3 cuotas):**
```
Crédito: $30.000.000
Tasa: 1.5% MV
Plazo: 36 meses

Cuota | Saldo Inicial | Capital    | Interés    | Seguro   | Cuota Total | Saldo Final
------|---------------|------------|------------|----------|-------------|-------------
  1   | 30.000.000    | 592.224    | 450.000    | 16.200   | 1.058.424   | 29.407.776
  2   | 29.407.776    | 601.112    | 441.112    | 15.880   | 1.058.104   | 28.806.664
  3   | 28.806.664    | 610.133    | 432.091    | 15.556   | 1.057.780   | 28.196.531
...
 36   | 1.027.147     | 1.027.147  | 15.407     | 555      | 1.043.109   | 0
```

---

## 8. OPTIMIZACIONES Y CACHE

### 8.1 Cache de Productos Elegibles

```typescript
// Cachear productos por criterios comunes
const CACHE_TTL = 3600; // 1 hora

async function obtenerProductosElegiblesCache(
  monto: number,
  plazo: number,
  tipoProducto: string
): Promise<Producto[]> {
  
  const cacheKey = `productos:${tipoProducto}:${monto}:${plazo}`;
  
  // Intentar obtener de Redis
  const cached = await redis.get(cacheKey);
  if (cached) {
    return JSON.parse(cached);
  }
  
  // Si no está en cache, consultar DB
  const productos = await prisma.producto.findMany({
    where: {
      tipo: tipoProducto,
      activo: true,
      disponible: true,
      montoMinimo: { lte: monto },
      montoMaximo: { gte: monto },
      plazoMinimo: { lte: plazo },
      plazoMaximo: { gte: plazo }
    },
    include: {
      entidad: true,
      costos: true
    },
    orderBy: {
      tasaMensual: 'asc'
    }
  });
  
  // Guardar en cache
  await redis.setex(cacheKey, CACHE_TTL, JSON.stringify(productos));
  
  return productos;
}
```

### 8.2 Precálculos en Background

```typescript
// Job que precalcula ofertas para montos y plazos comunes
async function precalcularOfertasComunes() {
  const montosComunes = [
    5000000, 10000000, 15000000, 20000000, 
    25000000, 30000000, 50000000
  ];
  
  const plazosComunes = [12, 24, 36, 48, 60];
  
  for (const monto of montosComunes) {
    for (const plazo of plazosComunes) {
      for (const tipo of ['libre-inversion', 'compra-cartera']) {
        try {
          const resultado = await compararOfertas({
            ingresos: monto * 0.3, // Estimación
            tipoEmpleo: 'dependiente',
            tipoProducto: tipo as any,
            montoSolicitado: monto,
            plazoMeses: plazo
          });
          
          // Cachear resultado
          const key = `ofertas-precalc:${tipo}:${monto}:${plazo}`;
          await redis.setex(key, 7200, JSON.stringify(resultado));
          
        } catch (error) {
          console.error(`Error precalculando ${tipo} ${monto} ${plazo}:`, error);
        }
      }
    }
  }
}

// Ejecutar cada 2 horas
cron.schedule('0 */2 * * *', precalcularOfertasComunes);
```

---

## 9. VALIDACIONES Y LÍMITES

### 9.1 Límites del Sistema

```typescript
const LIMITES = {
  // Crédito
  MONTO_MINIMO: 1000000,           // $1M COP
  MONTO_MAXIMO: 100000000,         // $100M COP
  PLAZO_MINIMO: 6,                 // meses
  PLAZO_MAXIMO: 84,                // meses (7 años)
  
  // Tasas
  TASA_MV_MINIMA: 0.5,             // 0.5% MV
  TASA_MV_MAXIMA: 5.0,             // 5% MV (usura)
  TASA_EA_MAXIMA: 79.5,            // 79.5% EA
  
  // Ingresos
  INGRESO_MINIMO: 1000000,         // $1M COP (SMLV aprox)
  
  // Capacidad de pago
  RELACION_CUOTA_INGRESO_MAX: 50,  // 50% máximo
  RELACION_CUOTA_INGRESO_REC: 40,  // 40% recomendado
  
  // Resultados
  MAX_OFERTAS_RETORNAR: 10,
  MIN_OFERTAS_MOSTRAR: 3
};

function validarSolicitud(solicitud: SolicitudComparacion): ValidationResult {
  const errores: string[] = [];
  
  if (solicitud.montoSolicitado < LIMITES.MONTO_MINIMO) {
    errores.push(`El monto mínimo es ${formatCurrency(LIMITES.MONTO_MINIMO)}`);
  }
  
  if (solicitud.montoSolicitado > LIMITES.MONTO_MAXIMO) {
    errores.push(`El monto máximo es ${formatCurrency(LIMITES.MONTO_MAXIMO)}`);
  }
  
  if (solicitud.plazoMeses < LIMITES.PLAZO_MINIMO) {
    errores.push(`El plazo mínimo es ${LIMITES.PLAZO_MINIMO} meses`);
  }
  
  if (solicitud.plazoMeses > LIMITES.PLAZO_MAXIMO) {
    errores.push(`El plazo máximo es ${LIMITES.PLAZO_MAXIMO} meses`);
  }
  
  if (solicitud.ingresos < LIMITES.INGRESO_MINIMO) {
    errores.push(`Los ingresos mínimos son ${formatCurrency(LIMITES.INGRESO_MINIMO)}`);
  }
  
  return {
    valido: errores.length === 0,
    errores
  };
}
```

---

## 10. CASOS DE USO Y EJEMPLOS

### 10.1 Caso 1: Crédito de Libre Inversión

```typescript
const solicitud: SolicitudComparacion = {
  ingresos: 5000000,
  edad: 35,
  tipoEmpleo: 'dependiente',
  tipoProducto: 'libre-inversion',
  montoSolicitado: 30000000,
  plazoMeses: 36
};

const resultado = await compararOfertas(solicitud);

// Output esperado:
{
  ofertas: [
    {
      posicion: 1,
      producto: { nombre: "Crédito Digital", entidad: "Fintech Rápida" },
      cuotaMensual: 986000,
      cuotaMensualTotal: 994120,
      costoTotal: 35796000,
      relacionCuotaIngreso: 19.9,
      badges: ["Mejor Opción", "Tasa Más Baja", "100% Digital"],
      scores: { total: 92.5 }
    },
    // ... más ofertas
  ],
  resumen: {
    mejorOferta: "Fintech Rápida - Crédito Digital",
    ahorroVsMasCara: 2032000,
    rangoTasas: "1.2% - 1.8% MV",
    tiempoPromedioAprobacion: "24 horas"
  }
}
```

### 10.2 Caso 2: Compra de Cartera

```typescript
const solicitud: SolicitudComparacion = {
  ingresos: 4000000,
  tipoEmpleo: 'dependiente',
  tipoProducto: 'compra-cartera',
  montoSolicitado: 25000000,
  plazoMeses: 48,
  montoTotalDeudas: 25000000,
  cuotaMensualActual: 1500000  // Paga actualmente
};

const resultado = await compararOfertas(solicitud);

// Output esperado:
{
  ofertas: [
    {
      posicion: 1,
      cuotaMensualTotal: 1050000,
      ahorro: {
        haAhorro: true,
        ahorroMensual: 450000,
        ahorroPorcentual: 30,
        ahorroTotal: 21600000,
        mensaje: "Ahorrarás $450.000 mensuales (30%)"
      },
      badges: ["Mejor Opción", "Mayor Ahorro"]
    }
  ],
  resumen: {
    ahorroPromedio: 425000,
    mejorAhorro: 450000
  }
}
```

---

## 11. MÉTRICAS Y MONITOREO

### 11.1 Métricas del Algoritmo

```typescript
interface MetricasAlgoritmo {
  // Performance
  tiempoPromedioComparacion: number;    // ms
  tiempoMaximoComparacion: number;      // ms
  
  // Resultados
  promedioOfertasElegibles: number;
  tasaCeroOfertas: number;              // %
  
  // Ranking
  correlacionScoreTasaConversion: number;
  
  // Cache
  hitRateCache: number;                 // %
}

// Tracking
function trackComparacion(
  solicitud: SolicitudComparacion,
  resultado: ResultadoComparacion,
  tiempoMs: number
) {
  analytics.track('comparacion_realizada', {
    tipoProducto: solicitud.tipoProducto,
    monto: solicitud.montoSolicitado,
    plazo: solicitud.plazoMeses,
    ofertasEncontradas: resultado.ofertas.length,
    tiempoMs,
    mejorTasa: resultado.ofertas[0]?.producto.tasaMensual
  });
}
```

---

## 12. PRÓXIMOS PASOS

✅ **Completado:** Algoritmos de comparación y simulación  
📋 **Siguiente:** Definición de APIs y contratos de servicios

**Documento creado por:** Sistema SDD  
**Próximo documento:** 05-apis-contratos.md
