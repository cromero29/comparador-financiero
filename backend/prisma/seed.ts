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
      logo: 'https://logodownload.org/wp-content/uploads/2020/04/bancolombia-logo.png',
      activa: true
    }
  });

  const davivienda = await prisma.entidadFinanciera.create({
    data: {
      codigo: 'DAVIVIENDA',
      nombre: 'Banco Davivienda',
      tipo: TipoEntidad.BANCO,
      sitioWeb: 'https://www.davivienda.com',
      logo: 'https://seeklogo.com/images/D/davivienda-logo-D57FA39C5F-seeklogo.com.png',
      activa: true
    }
  });

  const bbva = await prisma.entidadFinanciera.create({
    data: {
      codigo: 'BBVA',
      nombre: 'BBVA Colombia',
      tipo: TipoEntidad.BANCO,
      sitioWeb: 'https://www.bbva.com.co',
      logo: 'https://seeklogo.com/images/B/bbva-logo-1B965961B2-seeklogo.com.png',
      activa: true
    }
  });

  const bancoBogota = await prisma.entidadFinanciera.create({
    data: {
      codigo: 'BANCO_BOGOTA',
      nombre: 'Banco de Bogotá',
      tipo: TipoEntidad.BANCO,
      sitioWeb: 'https://www.bancodebogota.com',
      logo: 'https://seeklogo.com/images/B/banco-de-bogota-logo-F03788B3F1-seeklogo.com.png',
      activa: true
    }
  });

  const rappipay = await prisma.entidadFinanciera.create({
    data: {
      codigo: 'RAPPIPAY',
      nombre: 'RappiPay',
      tipo: TipoEntidad.FINTECH,
      sitioWeb: 'https://www.rappipay.com',
      logo: 'https://seeklogo.com/images/R/rappi-logo-29899BA206-seeklogo.com.png',
      activa: true
    }
  });

  const addi = await prisma.entidadFinanciera.create({
    data: {
      codigo: 'ADDI',
      nombre: 'Addi',
      tipo: TipoEntidad.FINTECH,
      sitioWeb: 'https://www.addi.com',
      logo: 'https://media.licdn.com/dms/image/v2/C4E0BAQH8wH9FnYGxvA/company-logo_200_200/company-logo_200_200/0/1630572688357/addi_logo?e=2147483647&v=beta&t=HN1XN6vBcVB8Ksx9rPFJzI5_Bj1fKQZ_xLqKq5qr7kU',
      activa: true
    }
  });

  const lineru = await prisma.entidadFinanciera.create({
    data: {
      codigo: 'LINERU',
      nombre: 'Lineru',
      tipo: TipoEntidad.FINTECH,
      sitioWeb: 'https://www.lineru.com',
      logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT5YZqN8vQ0Yl8KHnZCY6rKJv5xYZ6sXZ6qrw&s',
      activa: true
    }
  });

  const coofinep = await prisma.entidadFinanciera.create({
    data: {
      codigo: 'COOFINEP',
      nombre: 'Coofinep',
      tipo: TipoEntidad.COOPERATIVA,
      sitioWeb: 'https://www.coofinep.com.co',
      logo: 'https://www.coofinep.com.co/wp-content/uploads/2023/01/logo-coofinep-2023.png',
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
      plazoMaximoMeses: 60,
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
      plazoMaximoMeses: 60,
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
      urlInformacion: 'https://www.davivienda.com/wps/portal/personas/productos-personas/creditos/credito-libre-inversion',
      urlSolicitud: 'https://www.davivienda.com/wps/portal/personas/nuevo',
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
      urlInformacion: 'https://www.rappipay.com/co',
      urlSolicitud: 'https://www.rappipay.com/co',
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
      plazoMaximoMeses: 60,
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
      urlSolicitud: 'https://www.bancolombia.com/personas/creditos/compra-cartera',
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
      plazoMaximoMeses: 60,
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
      urlInformacion: 'https://www.davivienda.com/wps/portal/personas/productos-personas/creditos/compra-cartera',
      urlSolicitud: 'https://www.davivienda.com/wps/portal/personas/nuevo',
      activo: true,
      verificado: false
    }
  });

  console.log(`✅ ${5} productos de ejemplo creados`);

  // BBVA - Libre Inversión
  await prisma.producto.create({
    data: {
      entidadId: bbva.id,
      nombre: 'Préstamo Personal BBVA',
      tipo: TipoProducto.LIBRE_INVERSION,
      descripcion: 'Crédito personal con aprobación rápida',
      tasaNominalMensual: 1.75,
      tasaNominalAnual: 21.0,
      tasaEfectivaAnual: 23.14,
      montoMinimo: 1000000,
      montoMaximo: 90000000,
      plazoMinimoMeses: 12,
      plazoMaximoMeses: 60,
      costoEstudio: 45000,
      costoAdministracion: 0.5,
      seguroVida: 0.13,
      seguroDesempleo: 0.04,
      edadMinima: 18,
      edadMaxima: 70,
      ingresoMinimo: 1900000,
      requiereCuentaNomina: false,
      aceptaIndependientes: true,
      aceptaPensionados: true,
      urlInformacion: 'https://www.bbva.com.co/personas/productos/prestamos/prestamo-personal.html',
      urlSolicitud: 'https://www.bbva.com.co/personas/productos/prestamos/prestamo-personal.html',
      activo: true,
      verificado: false
    }
  });

  // Banco de Bogotá - Libre Inversión
  await prisma.producto.create({
    data: {
      entidadId: bancoBogota.id,
      nombre: 'Crédito Personal',
      tipo: TipoProducto.LIBRE_INVERSION,
      descripcion: 'Préstamo con cuotas flexibles',
      tasaNominalMensual: 1.85,
      tasaNominalAnual: 22.2,
      tasaEfectivaAnual: 24.64,
      montoMinimo: 1000000,
      montoMaximo: 85000000,
      plazoMinimoMeses: 6,
      plazoMaximoMeses: 60,
      costoEstudio: 55000,
      costoAdministracion: 0.55,
      seguroVida: 0.14,
      seguroDesempleo: 0.06,
      edadMinima: 18,
      edadMaxima: 72,
      ingresoMinimo: 2000000,
      requiereCuentaNomina: false,
      aceptaIndependientes: true,
      aceptaPensionados: true,
      urlInformacion: 'https://www.bancodebogota.com/wps/portal/banco-de-bogota/bogota/productos/para-ti/creditos/credito-consumo',
      urlSolicitud: 'https://www.bancodebogota.com/wps/portal/banco-de-bogota/bogota/productos/para-ti/creditos/credito-consumo',
      activo: true,
      verificado: false
    }
  });

  // Addi - Libre Inversión (Fintech)
  await prisma.producto.create({
    data: {
      entidadId: addi.id,
      nombre: 'Crédito Addi',
      tipo: TipoProducto.LIBRE_INVERSION,
      descripcion: 'Crédito digital sin papeleos',
      tasaNominalMensual: 1.4,
      tasaNominalAnual: 16.8,
      tasaEfectivaAnual: 18.19,
      montoMinimo: 300000,
      montoMaximo: 10000000,
      plazoMinimoMeses: 3,
      plazoMaximoMeses: 24,
      costoEstudio: 0,
      costoAdministracion: 0,
      seguroVida: 0.08,
      seguroDesempleo: 0,
      edadMinima: 18,
      edadMaxima: 65,
      ingresoMinimo: 1200000,
      requiereCuentaNomina: false,
      aceptaIndependientes: true,
      aceptaPensionados: false,
      urlInformacion: 'https://www.addi.com/co',
      urlSolicitud: 'https://www.addi.com/co',
      activo: true,
      verificado: false
    }
  });

  // Lineru - Libre Inversión (Fintech)
  await prisma.producto.create({
    data: {
      entidadId: lineru.id,
      nombre: 'Préstamo Express',
      tipo: TipoProducto.LIBRE_INVERSION,
      descripcion: 'Préstamo 100% online en minutos',
      tasaNominalMensual: 1.45,
      tasaNominalAnual: 17.4,
      tasaEfectivaAnual: 18.84,
      montoMinimo: 500000,
      montoMaximo: 8000000,
      plazoMinimoMeses: 6,
      plazoMaximoMeses: 18,
      costoEstudio: 0,
      costoAdministracion: 0,
      seguroVida: 0.09,
      seguroDesempleo: 0,
      edadMinima: 21,
      edadMaxima: 60,
      ingresoMinimo: 1500000,
      requiereCuentaNomina: false,
      aceptaIndependientes: true,
      aceptaPensionados: false,
      urlInformacion: 'https://www.lineru.co',
      urlSolicitud: 'https://www.lineru.co',
      activo: true,
      verificado: false
    }
  });

  // Coofinep - Libre Inversión (Cooperativa)
  await prisma.producto.create({
    data: {
      entidadId: coofinep.id,
      nombre: 'Crédito Libre Destinación',
      tipo: TipoProducto.LIBRE_INVERSION,
      descripcion: 'Crédito para asociados y no asociados',
      tasaNominalMensual: 1.65,
      tasaNominalAnual: 19.8,
      tasaEfectivaAnual: 21.68,
      montoMinimo: 1000000,
      montoMaximo: 50000000,
      plazoMinimoMeses: 12,
      plazoMaximoMeses: 60,
      costoEstudio: 35000,
      costoAdministracion: 0.4,
      seguroVida: 0.11,
      seguroDesempleo: 0,
      edadMinima: 18,
      edadMaxima: 68,
      ingresoMinimo: 1700000,
      requiereCuentaNomina: false,
      aceptaIndependientes: true,
      aceptaPensionados: true,
      urlInformacion: 'https://www.coofinep.com.co/creditos',
      urlSolicitud: 'https://www.coofinep.com.co/creditos',
      activo: true,
      verificado: false
    }
  });

  // BBVA - Compra de Cartera
  await prisma.producto.create({
    data: {
      entidadId: bbva.id,
      nombre: 'Consolidación de Deudas BBVA',
      tipo: TipoProducto.COMPRA_CARTERA,
      descripcion: 'Unifica todas tus deudas en una sola',
      tasaNominalMensual: 1.65,
      tasaNominalAnual: 19.8,
      tasaEfectivaAnual: 21.68,
      montoMinimo: 3000000,
      montoMaximo: 130000000,
      plazoMinimoMeses: 12,
      plazoMaximoMeses: 60,
      costoEstudio: 55000,
      costoAdministracion: 0.45,
      seguroVida: 0.13,
      seguroDesempleo: 0.04,
      edadMinima: 18,
      edadMaxima: 70,
      ingresoMinimo: 2400000,
      requiereCuentaNomina: false,
      aceptaIndependientes: true,
      aceptaPensionados: true,
      urlInformacion: 'https://www.bbva.com.co/personas/productos/prestamos/consolidacion-deudas.html',
      urlSolicitud: 'https://www.bbva.com.co/personas/productos/prestamos/consolidacion-deudas.html',
      activo: true,
      verificado: false
    }
  });

  // Banco de Bogotá - Compra de Cartera
  await prisma.producto.create({
    data: {
      entidadId: bancoBogota.id,
      nombre: 'Refinanciación de Deudas',
      tipo: TipoProducto.COMPRA_CARTERA,
      descripcion: 'Reduce tu carga financiera mensual',
      tasaNominalMensual: 1.70,
      tasaNominalAnual: 20.4,
      tasaEfectivaAnual: 22.48,
      montoMinimo: 2500000,
      montoMaximo: 110000000,
      plazoMinimoMeses: 12,
      plazoMaximoMeses: 60,
      costoEstudio: 60000,
      costoAdministracion: 0.50,
      seguroVida: 0.14,
      seguroDesempleo: 0.06,
      edadMinima: 18,
      edadMaxima: 72,
      ingresoMinimo: 2300000,
      requiereCuentaNomina: false,
      aceptaIndependientes: true,
      aceptaPensionados: true,
      urlInformacion: 'https://www.bancodebogota.com/wps/portal/banco-de-bogota/bogota/productos/para-ti/creditos/credito-consumo',
      urlSolicitud: 'https://www.bancodebogota.com/wps/portal/banco-de-bogota/bogota/productos/para-ti/creditos/credito-consumo',
      activo: true,
      verificado: false
    }
  });

  console.log(`✅ ${12} productos totales creados (5 iniciales + 7 adicionales)`);

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
  console.log(`   - ${12} Productos (8 Libre Inversión + 4 Compra Cartera)`);
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
