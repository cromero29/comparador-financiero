#!/usr/bin/env node
/**
 * CLI para ejecutar scraping manualmente
 * 
 * Uso:
 *   npm run scrape              # Ejecutar todas las entidades
 *   npm run scrape -- --all     # Ejecutar todas las entidades
 *   npm run scrape -- --stats   # Ver estadísticas
 */

import { ScraperOrchestrator } from './ScraperOrchestrator';
import { logger } from '../config/logger';

// Parse argumentos
const args = process.argv.slice(2);
const command = args[0] || '--all';

async function main() {
  const orchestrator = new ScraperOrchestrator();

  try {
    switch (command) {
      case '--all':
      case 'all':
        logger.info('🚀 Ejecutando scraping de todas las entidades...');
        const resultado = await orchestrator.scrapeAll();
        
        console.log('\n' + '='.repeat(50));
        console.log('📊 RESUMEN DE SCRAPING');
        console.log('='.repeat(50));
        console.log(`✅ Entidades procesadas: ${resultado.entidadesProcesadas}`);
        console.log(`📦 Productos actualizados: ${resultado.productosActualizados}`);
        console.log(`❌ Errores: ${resultado.errores.length}`);
        
        if (resultado.errores.length > 0) {
          console.log('\n🔴 Errores:');
          resultado.errores.forEach(error => console.log(`   - ${error}`));
        }
        
        console.log('='.repeat(50) + '\n');
        
        process.exit(resultado.exitoso ? 0 : 1);
        break;

      case '--stats':
      case 'stats':
        const estadisticas = await orchestrator.getEstadisticas(30);
        
        console.log('\n' + '='.repeat(50));
        console.log('📊 ESTADÍSTICAS DE SCRAPING');
        console.log('='.repeat(50));
        console.log(`Periodo: ${estadisticas.periodo}`);
        console.log(`Total ejecuciones: ${estadisticas.total}`);
        console.log(`Exitosas: ${estadisticas.exitosos}`);
        console.log(`Fallidas: ${estadisticas.fallidos}`);
        console.log(`Tasa de éxito: ${estadisticas.tasaExito}`);
        console.log(`Duración promedio: ${estadisticas.duracionPromedio}`);
        
        console.log('\n📦 Por entidad:');
        Object.entries(estadisticas.porEntidad).forEach(([nombre, stats]: [string, any]) => {
          console.log(`   ${nombre}:`);
          console.log(`      Total: ${stats.total} | Exitosos: ${stats.exitosos} | Fallidos: ${stats.fallidos}`);
        });
        
        console.log('\n🕐 Últimas ejecuciones:');
        estadisticas.ultimosLogs.forEach((log: any) => {
          const icon = log.exitoso ? '✅' : '❌';
          console.log(`   ${icon} ${log.fecha.toISOString()} - ${log.entidad} (${log.duracion})`);
          if (log.error) {
            console.log(`      Error: ${log.error}`);
          }
        });
        
        console.log('='.repeat(50) + '\n');
        
        process.exit(0);
        break;

      case '--help':
      case 'help':
        console.log('\n📖 USO DEL CLI DE SCRAPING\n');
        console.log('Comandos disponibles:');
        console.log('  npm run scrape              # Ejecutar todas las entidades');
        console.log('  npm run scrape -- --all     # Ejecutar todas las entidades');
        console.log('  npm run scrape -- --stats   # Ver estadísticas');
        console.log('  npm run scrape -- --help    # Mostrar esta ayuda\n');
        process.exit(0);
        break;

      default:
        console.error(`❌ Comando desconocido: ${command}`);
        console.log('Usa --help para ver los comandos disponibles');
        process.exit(1);
    }

  } catch (error: any) {
    logger.error('❌ Error en CLI de scraping:', error);
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  }
}

main();
