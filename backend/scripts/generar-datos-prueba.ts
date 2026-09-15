import { PrismaClient, TipoProducto, TipoEntidad } from '@prisma/client';

const prisma = new PrismaClient();

async function generarDatosPrueba() {
  console.log('🎲 Generando datos de prueba para reportes...\n');

  // Obtener entidades y productos
  const entidades = await prisma.entidadFinanciera.findMany({
    include: { productos: true }
  });

  if (entidades.length === 0) {
    console.error('❌ No hay entidades en la BD. Ejecuta el seed primero.');
    return;
  }

  // Crear 20 sesiones de prueba
  console.log('👥 Creando sesiones...');
  const sesiones = [];
  const dispositivos = ['desktop', 'mobile', 'tablet'];
  const navegadores = ['chrome', 'firefox', 'safari', 'edge'];
  const paises = ['Colombia', 'México', 'Argentina'];
  const ciudades = ['Bogotá', 'Medellín', 'Cali', 'Barranquilla'];

  for (let i = 0; i < 20; i++) {
    const sesion = await prisma.sesion.create({
      data: {
        fingerprint: `fp_${Math.random().toString(36).substr(2, 9)}`,
        ipAddress: `192.168.1.${Math.floor(Math.random() * 255)}`,
        dispositivo: dispositivos[Math.floor(Math.random() * dispositivos.length)],
        navegador: navegadores[Math.floor(Math.random() * navegadores.length)],
        pais: paises[Math.floor(Math.random() * paises.length)],
        ciudad: ciudades[Math.floor(Math.random() * ciudades.length)],
        utmSource: i % 3 === 0 ? 'google' : i % 3 === 1 ? 'facebook' : null,
        utmMedium: i % 3 === 0 ? 'cpc' : i % 3 === 1 ? 'social' : null,
        inicioSesion: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000) // Últimos 7 días
      }
    });
    sesiones.push(sesion);
  }
  console.log(`✅ ${sesiones.length} sesiones creadas\n`);

  // Crear búsquedas (70% de las sesiones hacen búsqueda)
  console.log('🔍 Creando búsquedas...');
  const busquedas = [];
  const tiposEmpleo = ['dependiente', 'independiente', 'pensionado'];
  
  for (let i = 0; i < Math.floor(sesiones.length * 0.7); i++) {
    const sesion = sesiones[i];
    const monto = [5000000, 10000000, 15000000, 20000000, 30000000][Math.floor(Math.random() * 5)];
    const plazo = [12, 24, 36, 48, 60][Math.floor(Math.random() * 5)];
    const edad = 25 + Math.floor(Math.random() * 40);
    const ingresos = [2000000, 3500000, 5000000, 8000000, 12000000][Math.floor(Math.random() * 5)];

    // Simular productos encontrados
    const productosDisponibles = entidades
      .flatMap(e => e.productos)
      .filter(p => 
        Number(p.montoMinimo) <= monto && 
        Number(p.montoMaximo) >= monto &&
        p.plazoMinimoMeses <= plazo &&
        p.plazoMaximoMeses >= plazo
      );

    if (productosDisponibles.length === 0) continue;

    // Top 3 entidades
    const top3 = productosDisponibles.slice(0, 3);

    const busqueda = await prisma.busqueda.create({
      data: {
        sesionId: sesion.id,
        tipoProducto: TipoProducto.LIBRE_INVERSION,
        montoSolicitado: monto,
        plazoMeses: plazo,
        edad,
        ingresos,
        tipoEmpleo: tiposEmpleo[Math.floor(Math.random() * tiposEmpleo.length)],
        ofertasEncontradas: productosDisponibles.length,
        mejorTasa: 18.19 + Math.random() * 10,
        mejorCuota: monto * 0.045,
        entidad1Id: top3[0]?.entidadId,
        entidad2Id: top3[1]?.entidadId,
        entidad3Id: top3[2]?.entidadId,
        ofertasExpandidas: Math.floor(Math.random() * 4),
        tiempoEnResultados: 30 + Math.floor(Math.random() * 120),
        generoClic: Math.random() > 0.4, // 60% genera clic
        clicsGenerados: Math.random() > 0.4 ? 1 : 0,
        fecha: new Date(sesion.inicioSesion.getTime() + 2 * 60 * 1000) // 2 min después
      }
    });
    busquedas.push(busqueda);
  }
  console.log(`✅ ${busquedas.length} búsquedas creadas\n`);

  // Crear clics (solo para búsquedas que generaron clic)
  console.log('🖱️  Creando clics...');
  let clicsCreados = 0;
  
  for (const busqueda of busquedas) {
    if (busqueda.generoClic && busqueda.clicsGenerados > 0) {
      // Obtener producto aleatorio
      const productosDisponibles = entidades
        .flatMap(e => e.productos)
        .filter(p => 
          Number(p.montoMinimo) <= Number(busqueda.montoSolicitado) && 
          Number(p.montoMaximo) >= Number(busqueda.montoSolicitado)
        );

      if (productosDisponibles.length === 0) continue;

      const productoClickeado = productosDisponibles[Math.floor(Math.random() * Math.min(5, productosDisponibles.length))];
      const entidad = entidades.find(e => e.id === productoClickeado.entidadId)!;

      await prisma.clicTracking.create({
        data: {
          sesionId: busqueda.sesionId,
          busquedaId: busqueda.id,
          productoId: productoClickeado.id,
          entidadId: entidad.id,
          entidadNombre: entidad.nombre,
          entidadTipo: entidad.tipo,
          posicion: Math.floor(Math.random() * 10) + 1,
          paginaResultados: Math.random() > 0.7 ? 2 : 1,
          montoSolicitado: busqueda.montoSolicitado,
          plazoMeses: busqueda.plazoMeses,
          tipoProducto: busqueda.tipoProducto,
          tasaOfrecida: Number(productoClickeado.tasaEfectivaAnual),
          cuotaOfrecida: Number(busqueda.montoSolicitado) * 0.045,
          edad: busqueda.edad,
          ingresos: busqueda.ingresos,
          tipoEmpleo: busqueda.tipoEmpleo,
          costoClic: 8000 + Math.random() * 7000, // Entre $8K y $15K
          redireccionExitosa: true,
          urlDestino: productoClickeado.urlSolicitud,
          fecha: new Date(busqueda.fecha.getTime() + 5 * 60 * 1000) // 5 min después
        }
      });
      clicsCreados++;
    }
  }
  console.log(`✅ ${clicsCreados} clics creados\n`);

  // Crear eventos
  console.log('📊 Creando eventos...');
  let eventosCreados = 0;
  const tiposEvento = ['form_start', 'form_complete', 'offer_view', 'offer_expand'];
  
  for (const busqueda of busquedas) {
    // 2-4 eventos por búsqueda
    const numEventos = 2 + Math.floor(Math.random() * 3);
    
    for (let i = 0; i < numEventos; i++) {
      await prisma.eventoTracking.create({
        data: {
          sesionId: busqueda.sesionId,
          tipoEvento: tiposEvento[Math.min(i, tiposEvento.length - 1)],
          categoria: 'busqueda',
          accion: i === 0 ? 'start' : i === 1 ? 'complete' : 'view',
          etiqueta: `busqueda_${busqueda.id}`,
          url: 'http://localhost:5173/resultados',
          pathname: '/resultados',
          fecha: new Date(busqueda.fecha.getTime() + i * 30 * 1000)
        }
      });
      eventosCreados++;
    }
  }
  console.log(`✅ ${eventosCreados} eventos creados\n`);

  console.log('✨ Datos de prueba generados exitosamente!\n');
  console.log('📈 Resumen:');
  console.log(`   - ${sesiones.length} sesiones`);
  console.log(`   - ${busquedas.length} búsquedas`);
  console.log(`   - ${clicsCreados} clics`);
  console.log(`   - ${eventosCreados} eventos`);
  console.log('\n🔗 Prueba los reportes en:');
  console.log('   GET http://localhost:4000/api/v1/reportes/resumen');
  console.log('   GET http://localhost:4000/api/v1/reportes/busquedas-detalle');
  console.log('   GET http://localhost:4000/api/v1/reportes/clics-por-entidad');
  console.log('   GET http://localhost:4000/api/v1/reportes/funnel-conversion');
  console.log('   GET http://localhost:4000/api/v1/reportes/segmentacion');
}

generarDatosPrueba()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
