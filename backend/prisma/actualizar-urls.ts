import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Actualiza las URLs de solicitud de los productos por código de entidad.
 * Las URLs corresponden a las páginas reales de crédito de cada entidad.
 *
 * Ejecutar en la Console de Railway:
 *   npx tsx prisma/actualizar-urls.ts
 */

// URL real de solicitud/información por código de entidad
const URLS_POR_ENTIDAD: Record<string, string> = {
  BANCOLOMBIA: 'https://www.bancolombia.com/personas/creditos/libranza-libre-inversion',
  DAVIVIENDA: 'https://www.davivienda.com/personas/creditos/credito-de-consumo',
  BBVA: 'https://www.bbva.com.co/personas/productos/prestamos.html',
  BANCO_BOGOTA: 'https://www.bancodebogota.com/personas/creditos',
  RAPPIPAY: 'https://www.rappipay.co/rappiprestamo-comercios/',
  ADDI: 'https://co.addi.com/creditos',
  LINERU: 'https://www.lineru.com',
  COOFINEP: 'https://financierajuriscoop.com.co/personas/portafolio/creditos/credito-de-libre-inversion',
  CAJA_SOCIAL: 'https://www.bancocajasocial.com/creditos/',
  POPULAR: 'https://www.bancopopular.com.co/creditos/libre-inversion',
  ITAU: 'https://banco.itau.co/web/corporate/creditos/credito-rotativo',
  BANCOOMEVA: 'https://www.bancoomeva.com.co/publicaciones/163538/credito-de-libre-inversion/',
  OCCIDENTE: 'https://www.bancodeoccidente.com.co/creditos/prestamo-personal',
  COOMULTRASAN: 'https://www.coomultrasan.com.co/',
};

async function main() {
  console.log('🔗 Actualizando URLs de solicitud de productos...\n');

  // Traer todas las entidades para mapear id -> codigo
  const entidades = await prisma.entidadFinanciera.findMany({
    select: { id: true, codigo: true, nombre: true },
  });

  let actualizados = 0;
  let sinMapa = 0;

  for (const entidad of entidades) {
    const url = URLS_POR_ENTIDAD[entidad.codigo];

    if (!url) {
      console.log(`⚠️  Sin URL definida para: ${entidad.codigo} (${entidad.nombre})`);
      sinMapa++;
      continue;
    }

    // Actualizar todos los productos de esa entidad
    const resultado = await prisma.producto.updateMany({
      where: { entidadId: entidad.id },
      data: {
        urlSolicitud: url,
        urlInformacion: url,
      },
    });

    console.log(`✅ ${entidad.nombre}: ${resultado.count} producto(s) → ${url}`);
    actualizados += resultado.count;
  }

  console.log(`\n✨ Listo. ${actualizados} productos actualizados.`);
  if (sinMapa > 0) {
    console.log(`   (${sinMapa} entidades sin URL definida en el script)`);
  }
}

main()
  .catch((e) => {
    console.error('❌ Error actualizando URLs:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
