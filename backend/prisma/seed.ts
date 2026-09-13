import { PrismaClient, TipoEntidad, TipoProducto, EstrategiaScrap } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed de base de datos...');

  // Limpiar datos existentes (solo en desarrollo)
  if (process.env.NODE_ENV === 'development') {
    console.log('🗑️  Limpiando datos existentes...');
    await prisma.clicTracking.deleteMany();
    await prisma.eventoTracking.deleteMany();
    await prisma.scrapingLog.deleteMany();
    await prisma.scraperConfig.deleteMany();
    await prisma.producto.deleteMany();
    await prisma.entidadFinanciera.deleteMany();
  }

  // ============================================
  // ENTIDADES FINANCIERAS
  // ============================================
  
  console.log('🏦 Creando entidades financieras...');

  const bancolombia = await prisma.entidadFinanciera.create({
    data: {
      codigo: 'BANCOLOMBIA',
      nombre: 'Bancolombia',
      tipo: TipoEntidad.BANCO,
      sitioWeb: 'https://www.bancolombia.com',
      logo: 'https://www.bancolombia.com/logo.png',
      activa: true
    }
  });

  const davivienda = await prisma.entidadFinanciera.create({
    data: {
      codigo: 'DAVIVIENDA',
      nombre: 'Banco Davivienda',
      tipo: TipoEntidad.BANCO,
      sitioWeb: 'https://www.davivienda.com',
      logo: 'https://www.davivienda.com/logo.png',
      activa: true
    }
  });

  const bbva = await prisma.entidadFinanciera.create({
    data: {
      codigo: 'BBVA',
      nombre: 'BBVA Colombia',
      tipo: TipoEntidad.BANCO,
      sitioWeb: 'https://www.bbva.com.co',
      logo: 'https://www.bbva.com.co/logo.png',
      activa: true
    }
  });

  const bancoBogota = await prisma.entidadFinanciera.create({
    data: {
      codigo: 'BANCO_BOGOTA',
      nombre: 'Banco de Bogotá',
      tipo: TipoEntidad.BANCO,
      sitioWeb: 'https://www.bancodebogota.com',
      logo: 'https://www.bancodebogota.com/logo.png',
      activa: true
    }
  });

  const rappipay = await prisma.entidadFinanciera.create({
    data: {
      codigo: 'RAPPIPAY',
      nombre: 'RappiPay',
      tipo: TipoEntidad.FINTECH,
      sitioWeb: 'https://www.rappipay.com',
      logo: 'https://www.rappipay.com/logo.png',
      activa: true
    }
  });

  const addi = await prisma.entidadFinanciera.create({
    data: {
      codigo: 'ADDI',
      nombre: 'Addi',
      tipo: TipoEntidad.FINTECH,
      sitioWeb: 'https://www.addi.com',
      logo: 'https://www.addi.com/logo.png',
      activa: true
    }
  });

  const lineru = await prisma.entidadFinanciera.create({
    data: {
      codigo: 'LINERU',
      nombre: 'Lineru',
      tipo: TipoEntidad.FINTECH,
      sitioWeb: 'https://www.lineru.com',
      logo: 'https://www.lineru.com/logo.png',
      activa: true
    }
  });

  const coofinep = await prisma.entidadFinanciera.create({
    data: {
      codigo: 'COOFINEP',
      nombre: 'Coofinep',
      tipo: TipoEntidad.COOPERATIVA,
      sitioWeb: 'https://www.coofinep.com.co',
      logo: 'https://www.coofinep.com.co/logo.png',
      activa: true
    }
  });

  console.log(`✅ ${8} entidades creadas`);

  // ============================================
  // PRODUCTOS DE EJEMPLO (seed inicial)
  // ============================================
  
  console.log('💳 Creando productos de ejemplo...');

  // Bancolombia - Libre Inversión
  await prisma.producto.create({
    data: {
      entidadId: bancolombia.id,
      nombre: 'Crédito de Libre Inversión',
      tipo: TipoProducto.LIBRE_INVERSION,
      descripcion: 'Préstamo personal para cualquier propósito',
      tasaNominalMensual: 1.8,
      tasaNominalAnual: 21.6,
      tasaEfectivaAnual: 23.87,
      montoMinimo: 1000000,
      montoMaximo: 100000000,
      plazoMinimoMeses: 12,
      plazoMaximoMeses: 84,
      costoEstudio: 50000,
      costoAdministracion: 0.5,
      seguroVida: 0.12,
      seguroDesempleo: 0,
      edadMinima: 18,
      edadMaxima: 70,
      ingresoMinimo: 2000000,
      requiereCuentaNomina: false,
      aceptaIndependientes: true,
      aceptaPensionados: true,
      urlInformacion: 'https://www.bancolombia.com/personas/creditos/credito-libre-inversion',
      urlSolicitud: 'https://www.bancolombia.com/personas/creditos/credito-libre-inversion/solicitud',
      activo: true,
      verificado: false
    }
  });

  // Davivienda - Libre Inversión
  await prisma.producto.create({
    data: {
      entidadId: davivienda.id,
      nombre: 'Crédito Fácil',
      tipo: TipoProducto.LIBRE_INVERSION,
      descripcion: 'Préstamo rápido y fácil',
      tasaNominalMensual: 1.9,
      tasaNominalAnual: 22.8,
      tasaEfectivaAnual: 25.36,
      montoMinimo: 1000000,
      montoMaximo: 80000000,
      plazoMinimoMeses: 6,
      plazoMaximoMeses: 72,
      costoEstudio: 40000,
      costoAdministracion: 0.6,
      seguroVida: 0.15,
      seguroDesempleo: 0.05,
      edadMinima: 18,
      edadMaxima: 75,
      ingresoMinimo: 1800000,
      requiereCuentaNomina: false,
      aceptaIndependientes: true,
      aceptaPensionados: true,
      urlInformacion: 'https://www.davivienda.com/personas/credito/libre-inversion',
      urlSolicitud: 'https://www.davivienda.com/personas/credito/libre-inversion/solicitar',
      activo: true,
      verificado: false
    }
  });

  // RappiPay - Libre Inversión (Fintech - mejores tasas)
  await prisma.producto.create({
    data: {
      entidadId: rappipay.id,
      nombre: 'Préstamo Personal RappiPay',
      tipo: TipoProducto.LIBRE_INVERSION,
      descripcion: 'Préstamo 100% digital en minutos',
      tasaNominalMensual: 1.5,
      tasaNominalAnual: 18.0,
      tasaEfectivaAnual: 19.56,
      montoMinimo: 500000,
      montoMaximo: 15000000,
      plazoMinimoMeses: 6,
      plazoMaximoMeses: 36,
      costoEstudio: 0,
      costoAdministracion: 0,
      seguroVida: 0.10,
      seguroDesempleo: 0,
      edadMinima: 18,
      edadMaxima: 65,
      ingresoMinimo: 1500000,
      requiereCuentaNomina: false,
      aceptaIndependientes: true,
      aceptaPensionados: false,
      urlInformacion: 'https://www.rappipay.com/prestamos',
      urlSolicitud: 'https://www.rappipay.com/prestamos/solicitar',
      activo: true,
      verificado: false
    }
  });

  // Bancolombia - Compra de Cartera
  await prisma.producto.create({
    data: {
      entidadId: bancolombia.id,
      nombre: 'Compra de Cartera',
      tipo: TipoProducto.COMPRA_CARTERA,
      descripcion: 'Unifica tus deudas en una sola cuota',
      tasaNominalMensual: 1.6,
      tasaNominalAnual: 19.2,
      tasaEfectivaAnual: 21.03,
      montoMinimo: 3000000,
      montoMaximo: 150000000,
      plazoMinimoMeses: 12,
      plazoMaximoMeses: 96,
      costoEstudio: 60000,
      costoAdministracion: 0.4,
      seguroVida: 0.12,
      seguroDesempleo: 0,
      edadMinima: 18,
      edadMaxima: 70,
      ingresoMinimo: 2500000,
      requiereCuentaNomina: false,
      aceptaIndependientes: true,
      aceptaPensionados: true,
      urlInformacion: 'https://www.bancolombia.com/personas/creditos/compra-cartera',
      urlSolicitud: 'https://www.bancolombia.com/personas/creditos/compra-cartera/solicitud',
      activo: true,
      verificado: false
    }
  });

  // Davivienda - Compra de Cartera
  await prisma.producto.create({
    data: {
      entidadId: davivienda.id,
      nombre: 'Unificación de Deudas',
      tipo: TipoProducto.COMPRA_CARTERA,
      descripcion: 'Reduce tus cuotas mensuales',
      tasaNominalMensual: 1.7,
      tasaNominalAnual: 20.4,
      tasaEfectivaAnual: 22.48,
      montoMinimo: 2500000,
      montoMaximo: 120000000,
      plazoMinimoMeses: 12,
      plazoMaximoMeses: 84,
      costoEstudio: 50000,
      costoAdministracion: 0.5,
      seguroVida: 0.15,
      seguroDesempleo: 0.05,
      edadMinima: 18,
      edadMaxima: 75,
      ingresoMinimo: 2200000,
      requiereCuentaNomina: false,
      aceptaIndependientes: true,
      aceptaPensionados: true,
      urlInformacion: 'https://www.davivienda.com/personas/credito/compra-cartera',
      urlSolicitud: 'https://www.davivienda.com/personas/credito/compra-cartera/solicitar',
      activo: true,
      verificado: false
    }
  });

  console.log(`✅ ${5} productos de ejemplo creados`);

  // ============================================
  // CONFIGURACIONES DE SCRAPING
  // ============================================
  
  console.log('🤖 Creando configuraciones de scraping...');

  // Bancolombia - Libre Inversión (Ejemplo con selectores)
  await prisma.scraperConfig.create({
    data: {
      entidadId: bancolombia.id,
      tipo: TipoProducto.LIBRE_INVERSION,
      url: 'https://www.bancolombia.com/personas/creditos/credito-libre-inversion',
      estrategia: EstrategiaScrap.DYNAMIC,
      selectores: {
        tasaMensual: '.tasa-mensual',
        tasaAnual: '.tasa-anual',
        montoMinimo: '.monto-minimo',
        montoMaximo: '.monto-maximo',
        plazoMinimo: '.plazo-minimo',
        plazoMaximo: '.plazo-maximo'
      },
      waitForSelector: '.tasa-mensual',
      timeout: 30000,
      activo: true
    }
  });

  // Davivienda - Libre Inversión
  await prisma.scraperConfig.create({
    data: {
      entidadId: davivienda.id,
      tipo: TipoProducto.LIBRE_INVERSION,
      url: 'https://www.davivienda.com/personas/credito/libre-inversion',
      estrategia: EstrategiaScrap.STATIC,
      selectores: {
        tasaMensual: '.rate-monthly',
        tasaAnual: '.rate-annual',
        montoMinimo: '.amount-min',
        montoMaximo: '.amount-max'
      },
      timeout: 20000,
      activo: true
    }
  });

  // RappiPay - Libre Inversión
  await prisma.scraperConfig.create({
    data: {
      entidadId: rappipay.id,
      tipo: TipoProducto.LIBRE_INVERSION,
      url: 'https://www.rappipay.com/prestamos',
      estrategia: EstrategiaScrap.DYNAMIC,
      selectores: {
        tasaMensual: '[data-testid="monthly-rate"]',
        montoMaximo: '[data-testid="max-amount"]'
      },
      waitForSelector: '[data-testid="monthly-rate"]',
      timeout: 25000,
      activo: true
    }
  });

  console.log(`✅ ${3} configuraciones de scraping creadas`);

  console.log('');
  console.log('✨ Seed completado exitosamente!');
  console.log('');
  console.log('📊 Resumen:');
  console.log(`   - ${8} Entidades financieras`);
  console.log(`   - ${5} Productos de ejemplo`);
  console.log(`   - ${3} Configuraciones de scraping`);
  console.log('');
}

main()
  .catch((e) => {
    console.error('❌ Error en seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
