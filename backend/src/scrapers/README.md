# Sistema de Web Scraping

Sistema automatizado de web scraping para recopilar información de productos financieros de entidades bancarias y fintechs en Colombia.

## 📋 Arquitectura

```
ScraperScheduler (Cron)
    ↓
ScraperOrchestrator (Coordinador)
    ↓
ScraperEngine (Puppeteer/Cheerio)
    ↓
Base de Datos (Prisma)
```

### Componentes

1. **ScraperEngine** - Motor de scraping
   - Estrategia STATIC: Cheerio (HTML estático)
   - Estrategia DYNAMIC: Puppeteer (JavaScript renderizado)

2. **ScraperOrchestrator** - Coordinador
   - Ejecuta scrapers de múltiples entidades
   - Maneja errores y reintentos
   - Actualiza productos en BD
   - Registra logs de ejecución

3. **ScraperScheduler** - Programador
   - Ejecuta scraping automático (cron)
   - Por defecto: Diario a las 3 AM
   - Configurable vía `SCRAPING_SCHEDULE`

## 🚀 Uso

### CLI (Línea de comandos)

```bash
# Ejecutar scraping de todas las entidades
npm run scrape

# Ver estadísticas de scraping
npm run scrape -- --stats

# Ver ayuda
npm run scrape -- --help
```

### API REST

```http
# Ejecutar scraping completo
POST /api/v1/scraper/execute

# Ejecutar scraping de una entidad
POST /api/v1/scraper/execute/:scraperConfigId

# Ver estadísticas
GET /api/v1/scraper/estadisticas?dias=30

# Estado del scheduler
GET /api/v1/scraper/status
```

### Scheduler Automático

El scheduler se inicia automáticamente al arrancar el servidor si `SCRAPING_ENABLED=true`.

```env
SCRAPING_ENABLED=true
SCRAPING_SCHEDULE="0 3 * * *"  # 3 AM diario
SCRAPING_TIMEOUT=30000         # 30 segundos
PUPPETEER_HEADLESS=true        # Sin GUI
```

## ⚙️ Configuración

### Agregar Nueva Entidad

1. **Crear entidad en BD:**

```sql
INSERT INTO entidades_financieras (codigo, nombre, tipo, sitio_web)
VALUES ('NEQUI', 'Nequi', 'FINTECH', 'https://www.nequi.com.co');
```

2. **Crear configuración de scraper:**

```sql
INSERT INTO scraper_configs (entidad_id, tipo, url, estrategia, selectores, wait_for_selector, timeout)
VALUES (
  'uuid-nequi',
  'LIBRE_INVERSION',
  'https://www.nequi.com.co/credito',
  'DYNAMIC',
  '{
    "tasaMensual": ".tasa-mes",
    "tasaAnual": ".tasa-anual",
    "montoMaximo": ".monto-max"
  }',
  '.tasa-mes',
  30000
);
```

3. **Probar scraper:**

```bash
npm run scrape
```

### Selectores CSS

Los selectores CSS deben apuntar a elementos que contengan la información:

```json
{
  "tasaMensual": ".tasa-mensual",              // "1.5%" → 1.5
  "tasaAnual": ".tasa-anual",                  // "18%" → 18.0
  "montoMinimo": ".monto-min",                 // "$1,000,000" → 1000000
  "montoMaximo": ".monto-max",                 // "$100,000,000" → 100000000
  "plazoMinimo": ".plazo-min",                 // "6 meses" → 6
  "plazoMaximo": ".plazo-max",                 // "84 meses" → 84
  "costoEstudio": ".costo-estudio",            // "$50,000" → 50000
  "ingresoMinimo": ".ingreso-min"              // "$2,000,000" → 2000000
}
```

## 🔍 Estrategias de Scraping

### STATIC (Cheerio)

Para sitios web que renderizan HTML en el servidor.

**Ventajas:**
- ✅ Más rápido
- ✅ Menos recursos
- ✅ No requiere navegador

**Cuando usar:**
- Sitios tradicionales con SSR
- HTML estático
- Sin JavaScript crítico

**Ejemplo:**
```typescript
{
  url: "https://banco.com/creditos",
  estrategia: "STATIC",
  selectores: {
    "tasaMensual": "div.tasa"
  }
}
```

### DYNAMIC (Puppeteer)

Para sitios web SPA que renderizan con JavaScript.

**Ventajas:**
- ✅ Ejecuta JavaScript
- ✅ Espera elementos dinámicos
- ✅ Maneja AJAX/fetch

**Desventajas:**
- ❌ Más lento
- ❌ Más recursos (memoria, CPU)

**Cuando usar:**
- SPAs (React, Vue, Angular)
- Sitios con JavaScript crítico
- Contenido cargado con AJAX

**Ejemplo:**
```typescript
{
  url: "https://fintech.com/prestamos",
  estrategia: "DYNAMIC",
  selectores: {
    "tasaMensual": "[data-testid='rate']"
  },
  waitForSelector: "[data-testid='rate']",
  timeout: 30000
}
```

## 📊 Logging y Monitoreo

### Logs de Ejecución

Cada ejecución se registra en `scraping_logs`:

```typescript
{
  scraperConfigId: "uuid",
  exitoso: true,
  productosEncontrados: 1,
  error: null,
  duracionMs: 2500,
  fecha: "2026-09-12T03:00:00Z"
}
```

### Ver Logs

```sql
-- Últimos 10 logs
SELECT 
  sl.fecha,
  e.nombre as entidad,
  sl.exitoso,
  sl.productos_encontrados,
  sl.duracion_ms / 1000 as duracion_seg,
  sl.error
FROM scraping_logs sl
JOIN scraper_configs sc ON sl.scraper_config_id = sc.id
JOIN entidades_financieras e ON sc.entidad_id = e.id
ORDER BY sl.fecha DESC
LIMIT 10;

-- Tasa de éxito por entidad
SELECT 
  e.nombre,
  COUNT(*) as total,
  SUM(CASE WHEN sl.exitoso THEN 1 ELSE 0 END) as exitosos,
  ROUND(AVG(CASE WHEN sl.exitoso THEN 1.0 ELSE 0.0 END) * 100, 2) as tasa_exito
FROM scraping_logs sl
JOIN scraper_configs sc ON sl.scraper_config_id = sc.id
JOIN entidades_financieras e ON sc.entidad_id = e.id
WHERE sl.fecha >= NOW() - INTERVAL '30 days'
GROUP BY e.nombre;
```

## 🔒 Buenas Prácticas

### 1. Respetar robots.txt

Verificar que el scraping esté permitido:

```
User-agent: *
Disallow: /admin/
Allow: /creditos/
```

### 2. Rate Limiting

- Delay entre requests: 2-5 segundos
- Horarios de bajo tráfico: 3-6 AM
- Máximo 1 ejecución por hora (configurado en rate limiter)

### 3. User Agent

Identificarse claramente:

```
ComparadorBot/1.0 (+https://comparador.com/bot; soporte@comparador.com)
```

### 4. Manejo de Errores

- No reintentar inmediatamente si falla
- Registrar errores en logs
- Alertar si múltiples fallos consecutivos
- Timeout razonable (30 segundos)

### 5. Privacidad

- Solo scrapear datos públicos
- No áreas con login
- No datos personales de usuarios
- Respetar `Disallow` en robots.txt

## 🐛 Troubleshooting

### Selector no encuentra elemento

```typescript
// ❌ Mal
"tasaMensual": ".tasa"

// ✅ Bien - Más específico
"tasaMensual": "div.producto-credito span.tasa-mensual"
```

### Timeout constantemente

1. Aumentar timeout en config
2. Verificar `waitForSelector` correcto
3. Considerar cambiar a STATIC si no requiere JS

### Datos no se actualizan

1. Verificar que selectores están correctos
2. Ver logs de scraping para errores
3. Comprobar que producto existe en BD
4. Validar estructura HTML del sitio

### Puppeteer falla en producción

```bash
# Instalar dependencias de Chrome en Linux
apt-get update
apt-get install -y chromium chromium-driver
```

## 📈 Métricas

### Por Entidad

```bash
npm run scrape -- --stats
```

Muestra:
- Total ejecuciones
- Tasa de éxito
- Duración promedio
- Últimos logs

### Dashboard (Futuro)

Implementar dashboard visual con:
- Gráfico de tasa de éxito por tiempo
- Alertas de fallos consecutivos
- Duración promedio por entidad
- Productos más actualizados

## 🚀 Próximos Pasos

- [ ] Implementar reintentos automáticos (3 intentos)
- [ ] Alertas por email/Slack si fallos críticos
- [ ] Dashboard visual de métricas
- [ ] Detectar cambios en estructura HTML
- [ ] Cache de HTML para debugging
- [ ] Capturas de pantalla en fallos
- [ ] Validación de datos scrapeados
- [ ] Comparación con datos anteriores

## 📝 Notas

- El scraping es legal si se respetan términos de uso
- Datos públicos no requieren autorización
- Identificarse con User-Agent apropiado
- No sobrecargar servidores de entidades
- Documentar en `/bot` el comportamiento del scraper
