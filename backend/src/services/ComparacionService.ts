import { TipoProducto } from '@prisma/client';
import { ProductoRepository } from '../repositories/ProductoRepository';
import { 
  ComparacionRequest, 
  CompraCarteraRequest, 
  ResultadoComparacion, 
  OfertaComparada 
} from '../types';
import {
  calcularCostoTotal,
  calcularTasaMensual,
  validarCapacidadPago,
  calcularAhorroCompraCartera,
  redondear,
} from '../utils/financial';
import {
  validarMontoEnRango,
  validarPlazoEnRango,
  validarEdad,
  validarIngresos,
} from '../utils/validators';
import { logger } from '../config/logger';

export class ComparacionService {
  private productoRepo: ProductoRepository;

  constructor() {
    this.productoRepo = new ProductoRepository();
  }

  /**
   * Comparar ofertas de crédito
   */
  async compararOfertas(params: ComparacionRequest): Promise<ResultadoComparacion> {
    const startTime = Date.now();
    
    logger.info('Iniciando comparación', {
      tipo: params.tipoProducto,
      monto: params.montoSolicitado,
      plazo: params.plazoMeses,
    });

    // 1. Obtener productos elegibles
    const productosElegibles = await this.productoRepo.findElegibles({
      tipo: params.tipoProducto,
      monto: params.montoSolicitado,
      plazo: params.plazoMeses,
      ingresos: params.ingresos,
      edad: params.edad,
      tipoEmpleo: params.tipoEmpleo,
    });

    logger.info(`Productos elegibles encontrados: ${productosElegibles.length}`);

    // 2. Evaluar cada producto
    const ofertas: OfertaComparada[] = [];

    for (const producto of productosElegibles) {
      // Validaciones detalladas
      const elegibilidad = this.evaluarElegibilidad(producto, params);
      
      if (!elegibilidad.cumple) {
        continue; // Saltar productos que no cumplen
      }

      // Calcular costos
      const tasaMensual = calcularTasaMensual(Number(producto.tasaNominalAnual) / 100);
      
      const costos = calcularCostoTotal(
        params.montoSolicitado,
        tasaMensual,
        params.plazoMeses,
        Number(producto.costoEstudio),
        Number(producto.costoAdministracion),
        Number(producto.seguroVida),
        Number(producto.seguroDesempleo)
      );

      // Validar capacidad de pago
      const capacidadPago = validarCapacidadPago(costos.cuotaTotal, params.ingresos);
      
      if (!capacidadPago.cumple) {
        elegibilidad.cumple = false;
        elegibilidad.razones.push(
          `La cuota (${capacidadPago.porcentajeUtilizado.toFixed(1)}%) excede tu capacidad de pago (máx 50% de ingresos)`
        );
        continue;
      }

      // Calcular ahorro si es compra de cartera
      let ahorroCompraCartera;
      if (params.tipoProducto === TipoProducto.COMPRA_CARTERA) {
        const compraCarteraParams = params as CompraCarteraRequest;
        const tasaActualMensual = compraCarteraParams.tasaActual / 100;
        
        ahorroCompraCartera = calcularAhorroCompraCartera(
          compraCarteraParams.deudaActual,
          compraCarteraParams.cuotaActual,
          tasaActualMensual,
          tasaMensual,
          params.plazoMeses
        );
      }

      // Crear oferta
      const oferta: OfertaComparada = {
        id: producto.id,
        entidad: {
          id: producto.entidad.id,
          codigo: producto.entidad.codigo,
          nombre: producto.entidad.nombre,
          logo: producto.entidad.logo,
          tipo: producto.entidad.tipo,
        },
        producto: {
          id: producto.id,
          nombre: producto.nombre,
          tipo: producto.tipo,
        },
        condiciones: {
          tasaNominalMensual: redondear(Number(producto.tasaNominalMensual)),
          tasaNominalAnual: redondear(Number(producto.tasaNominalAnual)),
          tasaEfectivaAnual: redondear(Number(producto.tasaEfectivaAnual)),
          plazoMeses: params.plazoMeses,
        },
        cuota: {
          mensual: redondear(costos.cuotaMensual),
          seguroVida: redondear(costos.seguroVidaMensual),
          seguroDesempleo: redondear(costos.seguroDesempleoMensual),
          total: redondear(costos.cuotaTotal),
        },
        costos: {
          estudio: redondear(Number(producto.costoEstudio)),
          administracion: redondear(costos.administracionMensual * params.plazoMeses),
          seguros: redondear(
            (costos.seguroVidaMensual + costos.seguroDesempleoMensual) * params.plazoMeses
          ),
          total: redondear(costos.totalCostos),
        },
        totales: {
          aPagar: redondear(costos.totalPagar),
          intereses: redondear(costos.totalIntereses),
          costoTotal: redondear(costos.totalPagar - params.montoSolicitado),
        },
        ranking: {
          posicion: 0, // Se calcula después
          puntaje: 0, // Se calcula después
          razonamiento: '',
        },
        elegibilidad,
        ahorroCompraCartera: ahorroCompraCartera ? {
          ahorroCuota: redondear(ahorroCompraCartera.ahorroCuota),
          ahorroTotal: redondear(ahorroCompraCartera.ahorroTotal),
          porcentajeAhorro: redondear(ahorroCompraCartera.porcentajeAhorro),
        } : undefined,
        urlSolicitud: producto.urlSolicitud,
      };

      ofertas.push(oferta);
    }

    // 3. Ranking de ofertas
    const ofertasRankeadas = this.rankearOfertas(ofertas);

    // 4. Resumen
    const resumen = this.generarResumen(ofertasRankeadas);

    const duration = Date.now() - startTime;
    logger.info(`Comparación completada en ${duration}ms`, {
      ofertas: ofertasRankeadas.length,
    });

    return {
      ofertas: ofertasRankeadas.slice(0, 10), // Top 10
      resumen,
      parametrosBusqueda: params,
      fechaConsulta: new Date(),
    };
  }

  /**
   * Evaluar elegibilidad de un producto
   */
  private evaluarElegibilidad(producto: any, params: ComparacionRequest) {
    const razones: string[] = [];
    let cumple = true;

    // Validar monto
    if (!validarMontoEnRango(
      params.montoSolicitado,
      Number(producto.montoMinimo),
      Number(producto.montoMaximo)
    )) {
      cumple = false;
      razones.push(
        `Monto fuera de rango (${producto.montoMinimo} - ${producto.montoMaximo})`
      );
    }

    // Validar plazo
    if (!validarPlazoEnRango(
      params.plazoMeses,
      producto.plazoMinimoMeses,
      producto.plazoMaximoMeses
    )) {
      cumple = false;
      razones.push(
        `Plazo fuera de rango (${producto.plazoMinimoMeses} - ${producto.plazoMaximoMeses} meses)`
      );
    }

    // Validar edad
    if (!validarEdad(params.edad, producto.edadMinima, producto.edadMaxima)) {
      cumple = false;
      razones.push(
        `Edad fuera de rango (${producto.edadMinima} - ${producto.edadMaxima} años)`
      );
    }

    // Validar ingresos
    if (!validarIngresos(params.ingresos, Number(producto.ingresoMinimo))) {
      cumple = false;
      razones.push(
        `Ingresos insuficientes (mínimo ${producto.ingresoMinimo})`
      );
    }

    // Validar tipo de empleo
    if (params.tipoEmpleo === 'independiente' && !producto.aceptaIndependientes) {
      cumple = false;
      razones.push('No acepta trabajadores independientes');
    }

    if (params.tipoEmpleo === 'pensionado' && !producto.aceptaPensionados) {
      cumple = false;
      razones.push('No acepta pensionados');
    }

    if (producto.requiereCuentaNomina) {
      razones.push('Requiere cuenta nómina');
    }

    return {
      cumple,
      razones: cumple ? ['Cumple todos los requisitos'] : razones,
    };
  }

  /**
   * Rankear ofertas usando algoritmo ponderado
   * Pesos: 40% costo total, 30% tasa, 20% tiempo aprobación, 10% requisitos
   */
  private rankearOfertas(ofertas: OfertaComparada[]): OfertaComparada[] {
    if (ofertas.length === 0) return [];

    // Encontrar valores min/max para normalización
    const costoTotalMax = Math.max(...ofertas.map(o => o.totales.costoTotal));
    const costoTotalMin = Math.min(...ofertas.map(o => o.totales.costoTotal));
    const tasaMax = Math.max(...ofertas.map(o => o.condiciones.tasaEfectivaAnual));
    const tasaMin = Math.min(...ofertas.map(o => o.condiciones.tasaEfectivaAnual));

    // Calcular puntaje para cada oferta
    ofertas.forEach(oferta => {
      // Normalizar costo (0-100, menor es mejor)
      const costoPuntaje = costoTotalMax > costoTotalMin
        ? 100 - ((oferta.totales.costoTotal - costoTotalMin) / (costoTotalMax - costoTotalMin)) * 100
        : 100;

      // Normalizar tasa (0-100, menor es mejor)
      const tasaPuntaje = tasaMax > tasaMin
        ? 100 - ((oferta.condiciones.tasaEfectivaAnual - tasaMin) / (tasaMax - tasaMin)) * 100
        : 100;

      // Tiempo de aprobación (simplificado: fintechs = 100, bancos = 70, cooperativas = 60)
      const tiempoPuntaje = 
        oferta.entidad.tipo === 'FINTECH' ? 100 :
        oferta.entidad.tipo === 'BANCO' ? 70 :
        60;

      // Requisitos (menos requisitos = mejor)
      const requisitosPuntaje = oferta.elegibilidad.razones.length === 1 ? 100 : 80;

      // Puntaje ponderado
      const puntaje = 
        (costoPuntaje * 0.40) +
        (tasaPuntaje * 0.30) +
        (tiempoPuntaje * 0.20) +
        (requisitosPuntaje * 0.10);

      oferta.ranking.puntaje = redondear(puntaje);
    });

    // Ordenar por puntaje (mayor a menor)
    ofertas.sort((a, b) => b.ranking.puntaje - a.ranking.puntaje);

    // Asignar posiciones y razonamiento
    ofertas.forEach((oferta, index) => {
      oferta.ranking.posicion = index + 1;
      
      if (index === 0) {
        oferta.ranking.razonamiento = 'Mejor opción por menor costo total y tasa competitiva';
      } else if (index === 1) {
        oferta.ranking.razonamiento = 'Segunda mejor opción, buena alternativa';
      } else {
        oferta.ranking.razonamiento = 'Opción competitiva';
      }
    });

    return ofertas;
  }

  /**
   * Generar resumen de la comparación
   */
  private generarResumen(ofertas: OfertaComparada[]) {
    if (ofertas.length === 0) {
      return {
        totalOfertas: 0,
        mejorTasa: 0,
        peorTasa: 0,
        promedioTasa: 0,
        mejorCuota: 0,
      };
    }

    const tasas = ofertas.map(o => o.condiciones.tasaEfectivaAnual);
    const cuotas = ofertas.map(o => o.cuota.total);

    return {
      totalOfertas: ofertas.length,
      mejorTasa: Math.min(...tasas),
      peorTasa: Math.max(...tasas),
      promedioTasa: redondear(tasas.reduce((sum, t) => sum + t, 0) / tasas.length),
      mejorCuota: Math.min(...cuotas),
    };
  }
}
