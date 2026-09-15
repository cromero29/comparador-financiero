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

  const cajaSocial = await prisma.entidadFinanciera.create({
    data: {
      codigo: 'CAJA_SOCIAL',
      nombre: 'Banco Caja Social',
      tipo: TipoEntidad.BANCO,
      sitioWeb: 'https://www.bancocajasocial.com',
      logo: 'https://seeklogo.com/images/B/banco-caja-social-logo-9C0B3E4F5E-seeklogo.com.png',
      activa: true
    }
  });

  const popular = await prisma.entidadFinanciera.create({
    data: {
      codigo: 'POPULAR',
      nombre: 'Banco Popular',
      tipo: TipoEntidad.BANCO,
      sitioWeb: 'https://www.bancopopular.com.co',
      logo: 'https://seeklogo.com/images/B/banco-popular-logo-F1E8E0C8F5-seeklogo.com.png',
      activa: true
    }
  });

  const itau = await prisma.entidadFinanciera.create({
    data: {
      codigo: 'ITAU',
      nombre: 'Itaú',
      tipo: TipoEntidad.BANCO,
      sitioWeb: 'https://www.itau.co',
      logo: 'https://seeklogo.com/images/I/itau-logo-D6F5B6F5E3-seeklogo.com.png',
      activa: true
    }
  });

  const bancoomeva = await prisma.entidadFinanciera.create({
    data: {
      codigo: 'BANCOOMEVA',
      nombre: 'Bancoomeva',
      tipo: TipoEntidad.BANCO,
      sitioWeb: 'https://www.bancoomeva.com.co',
      logo: 'https://seeklogo.com/images/B/bancoomeva-logo-F1E8E0C8F5-seeklogo.com.png',
      activa: true
    }
  });

  const occidente = await prisma.entidadFinanciera.create({
    data: {
      codigo: 'OCCIDENTE',
      nombre: 'Banco de Occidente',
      tipo: TipoEntidad.BANCO,
      sitioWeb: 'https://www.bancodeoccidente.com.co',
      logo: 'https://seeklogo.com/images/B/banco-de-occidente-logo-E3E8E0C8F5-seeklogo.com.png',
      activa: true
    }
  });

  const coomultrasan = await prisma.entidadFinanciera.create({
    data: {
      codigo: 'COOMULTRASAN',
      nombre: 'Coomultrasan',
      tipo: TipoEntidad.COOPERATIVA,
      sitioWeb: 'https://www.coomultrasan.com.co',
      logo: 'https://www.coomultrasan.com.co/wp-content/uploads/2020/01/logo-coomultrasan.png',
      activa: true
    }
  });

  console.log(`✅ ${14} entidades creadas`);

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
      urlInformacion: 'https://www.davivienda.com/solicitar-productos',
      urlSolicitud: 'https://www.davivienda.com/solicitar-productos',
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
      urlInformacion: 'https://www.bbva.com.co/personas/productos/prestamos.html',
      urlSolicitud: 'https://www.bbva.com.co/personas/productos/prestamos.html',
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
      urlInformacion: 'https://www.bancodebogota.com/personas/creditos',
      urlSolicitud: 'https://www.bancodebogota.com/personas/creditos',
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
      urlInformacion: 'https://www.bancodebogota.com/personas/creditos',
      urlSolicitud: 'https://www.bancodebogota.com/personas/creditos',
      activo: true,
      verificado: false
    }
  });

  // Banco Caja Social - Libre Inversión
  await prisma.producto.create({
    data: {
      entidadId: cajaSocial.id,
      nombre: 'Crédito de Libre Inversión Caja Social',
      tipo: TipoProducto.LIBRE_INVERSION,
      descripcion: 'Préstamo personal con tasas competitivas',
      tasaNominalMensual: 1.72,
      tasaNominalAnual: 20.64,
      tasaEfectivaAnual: 22.78,
      montoMinimo: 1000000,
      montoMaximo: 70000000,
      plazoMinimoMeses: 12,
      plazoMaximoMeses: 60,
      costoEstudio: 42000,
      costoAdministracion: 0.48,
      seguroVida: 0.12,
      seguroDesempleo: 0.04,
      edadMinima: 18,
      edadMaxima: 70,
      ingresoMinimo: 1800000,
      requiereCuentaNomina: false,
      aceptaIndependientes: true,
      aceptaPensionados: true,
      urlInformacion: 'https://www.bancocajasocial.com/credito-libre-inversion',
      urlSolicitud: 'https://www.bancocajasocial.com/solicitud',
      activo: true,
      verificado: false
    }
  });

  // Banco Popular - Libre Inversión
  await prisma.producto.create({
    data: {
      entidadId: popular.id,
      nombre: 'Crédito Personal Popular',
      tipo: TipoProducto.LIBRE_INVERSION,
      descripcion: 'Financiación flexible para tus proyectos',
      tasaNominalMensual: 1.88,
      tasaNominalAnual: 22.56,
      tasaEfectivaAnual: 25.09,
      montoMinimo: 1000000,
      montoMaximo: 75000000,
      plazoMinimoMeses: 6,
      plazoMaximoMeses: 60,
      costoEstudio: 48000,
      costoAdministracion: 0.52,
      seguroVida: 0.14,
      seguroDesempleo: 0.05,
      edadMinima: 18,
      edadMaxima: 68,
      ingresoMinimo: 1900000,
      requiereCuentaNomina: false,
      aceptaIndependientes: true,
      aceptaPensionados: true,
      urlInformacion: 'https://www.bancopopular.com.co/creditos/libre-inversion',
      urlSolicitud: 'https://www.bancopopular.com.co/solicitud',
      activo: true,
      verificado: false
    }
  });

  // Itaú - Libre Inversión
  await prisma.producto.create({
    data: {
      entidadId: itau.id,
      nombre: 'Crédito Personal Itaú',
      tipo: TipoProducto.LIBRE_INVERSION,
      descripcion: 'Préstamo simple y rápido',
      tasaNominalMensual: 1.68,
      tasaNominalAnual: 20.16,
      tasaEfectivaAnual: 22.15,
      montoMinimo: 1500000,
      montoMaximo: 95000000,
      plazoMinimoMeses: 12,
      plazoMaximoMeses: 60,
      costoEstudio: 50000,
      costoAdministracion: 0.45,
      seguroVida: 0.11,
      seguroDesempleo: 0.03,
      edadMinima: 18,
      edadMaxima: 72,
      ingresoMinimo: 2100000,
      requiereCuentaNomina: false,
      aceptaIndependientes: true,
      aceptaPensionados: true,
      urlInformacion: 'https://www.itau.co/creditos/libre-inversion',
      urlSolicitud: 'https://www.itau.co/solicitud',
      activo: true,
      verificado: false
    }
  });

  // Bancoomeva - Libre Inversión
  await prisma.producto.create({
    data: {
      entidadId: bancoomeva.id,
      nombre: 'Crédito de Consumo Bancoomeva',
      tipo: TipoProducto.LIBRE_INVERSION,
      descripcion: 'Financiación con beneficios para asociados',
      tasaNominalMensual: 1.78,
      tasaNominalAnual: 21.36,
      tasaEfectivaAnual: 23.51,
      montoMinimo: 1000000,
      montoMaximo: 60000000,
      plazoMinimoMeses: 6,
      plazoMaximoMeses: 60,
      costoEstudio: 38000,
      costoAdministracion: 0.42,
      seguroVida: 0.13,
      seguroDesempleo: 0.04,
      edadMinima: 18,
      edadMaxima: 68,
      ingresoMinimo: 1750000,
      requiereCuentaNomina: false,
      aceptaIndependientes: true,
      aceptaPensionados: true,
      urlInformacion: 'https://www.bancoomeva.com.co/creditos',
      urlSolicitud: 'https://www.bancoomeva.com.co/solicitud',
      activo: true,
      verificado: false
    }
  });

  // Banco de Occidente - Libre Inversión
  await prisma.producto.create({
    data: {
      entidadId: occidente.id,
      nombre: 'Crédito de Libre Inversión Occidente',
      tipo: TipoProducto.LIBRE_INVERSION,
      descripcion: 'Soluciones de crédito a tu medida',
      tasaNominalMensual: 1.82,
      tasaNominalAnual: 21.84,
      tasaEfectivaAnual: 24.12,
      montoMinimo: 1000000,
      montoMaximo: 80000000,
      plazoMinimoMeses: 12,
      plazoMaximoMeses: 60,
      costoEstudio: 46000,
      costoAdministracion: 0.50,
      seguroVida: 0.13,
      seguroDesempleo: 0.05,
      edadMinima: 18,
      edadMaxima: 70,
      ingresoMinimo: 2000000,
      requiereCuentaNomina: false,
      aceptaIndependientes: true,
      aceptaPensionados: true,
      urlInformacion: 'https://www.bancodeoccidente.com.co/creditos',
      urlSolicitud: 'https://www.bancodeoccidente.com.co/solicitud',
      activo: true,
      verificado: false
    }
  });

  // Coomultrasan - Libre Inversión
  await prisma.producto.create({
    data: {
      entidadId: coomultrasan.id,
      nombre: 'Crédito Ordinario',
      tipo: TipoProducto.LIBRE_INVERSION,
      descripcion: 'Crédito cooperativo con excelentes condiciones',
      tasaNominalMensual: 1.58,
      tasaNominalAnual: 18.96,
      tasaEfectivaAnual: 20.73,
      montoMinimo: 1000000,
      montoMaximo: 45000000,
      plazoMinimoMeses: 12,
      plazoMaximoMeses: 60,
      costoEstudio: 30000,
      costoAdministracion: 0.35,
      seguroVida: 0.10,
      seguroDesempleo: 0,
      edadMinima: 18,
      edadMaxima: 65,
      ingresoMinimo: 1600000,
      requiereCuentaNomina: false,
      aceptaIndependientes: true,
      aceptaPensionados: true,
      urlInformacion: 'https://www.coomultrasan.com.co/creditos',
      urlSolicitud: 'https://www.coomultrasan.com.co/solicitud',
      activo: true,
      verificado: false
    }
  });

  // Banco Caja Social - Compra de Cartera
  await prisma.producto.create({
    data: {
      entidadId: cajaSocial.id,
      nombre: 'Compra de Cartera Caja Social',
      tipo: TipoProducto.COMPRA_CARTERA,
      descripcion: 'Consolida tus deudas con mejores tasas',
      tasaNominalMensual: 1.68,
      tasaNominalAnual: 20.16,
      tasaEfectivaAnual: 22.15,
      montoMinimo: 2500000,
      montoMaximo: 100000000,
      plazoMinimoMeses: 12,
      plazoMaximoMeses: 60,
      costoEstudio: 52000,
      costoAdministracion: 0.48,
      seguroVida: 0.12,
      seguroDesempleo: 0.04,
      edadMinima: 18,
      edadMaxima: 70,
      ingresoMinimo: 2200000,
      requiereCuentaNomina: false,
      aceptaIndependientes: true,
      aceptaPensionados: true,
      urlInformacion: 'https://www.bancocajasocial.com/compra-cartera',
      urlSolicitud: 'https://www.bancocajasocial.com/solicitud',
      activo: true,
      verificado: false
    }
  });

  // Itaú - Compra de Cartera
  await prisma.producto.create({
    data: {
      entidadId: itau.id,
      nombre: 'Consolidación de Deudas Itaú',
      tipo: TipoProducto.COMPRA_CARTERA,
      descripcion: 'Una sola cuota, mejor control',
      tasaNominalMensual: 1.62,
      tasaNominalAnual: 19.44,
      tasaEfectivaAnual: 21.30,
      montoMinimo: 3000000,
      montoMaximo: 140000000,
      plazoMinimoMeses: 12,
      plazoMaximoMeses: 60,
      costoEstudio: 58000,
      costoAdministracion: 0.45,
      seguroVida: 0.11,
      seguroDesempleo: 0.03,
      edadMinima: 18,
      edadMaxima: 72,
      ingresoMinimo: 2500000,
      requiereCuentaNomina: false,
      aceptaIndependientes: true,
      aceptaPensionados: true,
      urlInformacion: 'https://www.itau.co/compra-cartera',
      urlSolicitud: 'https://www.itau.co/solicitud',
      activo: true,
      verificado: false
    }
  });

  console.log(`✅ ${20} productos totales creados (12 anteriores + 8 nuevos)`);

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
  console.log(`   - ${14} Entidades financieras`);
  console.log(`   - ${20} Productos (14 Libre Inversión + 6 Compra Cartera)`);
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
