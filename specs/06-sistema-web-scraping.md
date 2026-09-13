# Sistema de Web Scraping
## Extracción Automática de Datos Financieros

**Proyecto:** Comparador de Productos Financieros  
**Versión:** 1.0  
**Fecha:** Septiembre 2026  

---

## 1. VISIÓN GENERAL

El sistema de web scraping es el **corazón de la plataforma**, similar a como funciona "Compara Precios". Extrae automáticamente información de productos financieros desde los sitios web públicos de entidades financieras.

### 1.1 Objetivos

- ✅ **Automatización:** Datos siempre actualizados sin intervención manual
- ✅ **Escalabilidad:** Fácil agregar nuevas entidades
- ✅ **Confiabilidad:** Manejo robusto de errores y cambios
- ✅ **Transparencia:** Logs y tracking completo
- ✅ **Compliance:** Solo datos públicos, respetando robots.txt

---

## 2. ARQUITECTURA DEL SISTEMA

### 2.1 Diagrama de Componentes

```
┌──────────────────────────────────────────────────────────┐
│              SITIOS WEB DE ENTIDADES                      │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐      │
│  │ Bancolombia │  │ Davivienda  │  │   Fintech   │ ...  │
│  └─────────────┘  └─────────────┘  └─────────────┘      │
└────────────────────┬─────────────────────────────────────┘
                     │ HTTP/HTTPS
                     ▼
         ┌───────────────────────┐
         │   Scraper Scheduler   │
         │   (node-cron)         │
         │                       │
         │  Ejecuta: 2 AM diario │
         └───────────┬───────────┘
                     │
                     ▼
    ┌────────────────────────────────────┐
    │      Scraper Orchestrator          │
    │  ┌──────────────────────────────┐  │
    │  │  Queue Manager               │  │
    │  │  • Priorización              │  │
    │  │  • Rate limiting             │  │
    │  │  • Retry logic               │  │
    │  └──────────────────────────────┘  │
    └────────────┬───────────────────────┘
                 │
         ┌───────┼───────┐
         │       │       │
         ▼       ▼       ▼
    ┌────────┐ ┌────────┐ ┌────────┐
    │Scraper │ │Scraper │ │Scraper │
    │   1    │ │   2    │ │   N    │
    └────┬───┘ └────┬───┘ └────┬───┘
         │          │          │
         └──────────┼──────────┘
                    │
                    ▼
         ┌──────────────────┐
         │  Data Pipeline   │
         │                  │
         │  1. Extract      │
         │  2. Transform    │
         │  3. Validate     │
         │  4. Load (ETL)   │
         └────────┬─────────┘
                  │
                  ▼
         ┌──────────────────┐
         │   PostgreSQL     │
         │   • productos    │
         │   • scraping_log │
         │   • scraper_cfg  │
         └──────────────────┘
```

---

## 3. COMPONENTES PRINCIPALES

### 3.1 Scraper Configuration

Configuración por entidad en base de datos:

```typescript
// Tabla: scraper_configs
interface ScraperConfig {
  id: string;
  entidadNombre: string;
  tipo: 'banco' | 'fintech' | 'cooperativa';
  
  // URLs
  urls: {
    libreInversion?: string;
    compraCartera?: string;
  };
  
  // Selectores CSS
  selectors: {
    // Selectores principales
    tasaMensual: string;
    tasaEA: string;
    montoMinimo: string;
    montoMaximo: string;
    plazoMinimo: string;
    plazoMaximo: string;
    
    // Selectores opcionales
    seguroVida?: string;
    comisionDesembolso?: string;
    tiempoAprobacion?: string;
    requisitos?: string;
    ventajas?: string;
  };
  
  // Selectores alternativos (fallback)
  selectorsAlt?: typeof selectors;
  
  // Estrategia
  strategy: 'static' | 'dynamic'; // Cheerio vs Puppeteer
  
  // Opciones de navegación (para Puppeteer)
  navigationOptions?: {
    waitUntil: 'load' | 'domcontentloaded' | 'networkidle0';
    timeout: number; // ms
    clickSelectors?: string[]; // Botones a clickear
    scrollToBottom?: boolean;
  };
  
  // Transformadores de datos
  transformers: {
    tasaMensual?: string; // "parsePercentage", "extractNumber"
    montoMinimo?: string;
    // ... etc
  };
  
  // Rate limiting
  rateLimit: {
    requestsPerMinute: number;
    delayBetweenRequests: number; // ms
  };
  
  // Estado
  enabled: boolean;
  priority: number; // 1-10 (mayor = más prioritario)
  
  // Metadata
  ultimoScraping?: Date;
  ultimoExito?: Date;
  intentosFallidos: number;
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}
```

**Ejemplo de configuración real:**

```typescript
// Bancolombia - Crédito Libre Inversión
{
  id: "scraper_bancolombia_li",
  entidadNombre: "Bancolombia",
  tipo: "banco",
  
  urls: {
    libreInversion: "https://www.grupobancolombia.com/personas/productos-servicios/creditos/credito-libre-inversion"
  },
  
  selectors: {
    tasaMensual: ".producto-tasa .valor-tasa",
    tasaEA: ".tasa-efectiva-anual",
    montoMinimo: ".condiciones-monto .minimo",
    montoMaximo: ".condiciones-monto .maximo",
    plazoMinimo: ".condiciones-plazo .minimo",
    plazoMaximo: ".condiciones-plazo .maximo",
    requisitos: ".requisitos-lista li"
  },
  
  selectorsAlt: {
    tasaMensual: ".tasa-credito", // Selector alternativo
  },
  
  strategy: "dynamic", // Requiere JS
  
  navigationOptions: {
    waitUntil: "networkidle0",
    timeout: 30000,
    clickSelectors: [".ver-mas-condiciones"],
    scrollToBottom: true
  },
  
  transformers: {
    tasaMensual: "parsePercentage",
    montoMinimo: "parseCurrency",
    montoMaximo: "parseCurrency"
  },
  
  rateLimit: {
    requestsPerMinute: 10,
    delayBetweenRequests: 2000
  },
  
  enabled: true,
  priority: 9
}
```

---

### 3.2 Scraper Engine

Motor principal de scraping:

```typescript
// src/scrapers/scraper-engine.ts

import puppeteer from 'puppeteer';
import * as cheerio from 'cheerio';

export class ScraperEngine {
  private browser: puppeteer.Browser | null = null;
  
  async initialize() {
    this.browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--disable-gpu'
      ]
    });
  }
  
  async scrapeEntidad(config: ScraperConfig): Promise<ScrapedData> {
    const startTime = Date.now();
    
    try {
      // Seleccionar estrategia
      const data = config.strategy === 'dynamic' 
        ? await this.scrapeDynamic(config)
        : await this.scrapeStatic(config);
      
      // Validar datos extraídos
      const validated = this.validateData(data, config);
      
      // Transformar datos
      const transformed = this.transformData(validated, config);
      
      // Log de éxito
      await this.logSuccess(config, transformed, Date.now() - startTime);
      
      return transformed;
      
    } catch (error) {
      // Log de error
      await this.logError(config, error, Date.now() - startTime);
      throw error;
    }
  }
  
  private async scrapeDynamic(config: ScraperConfig): Promise<RawData> {
    if (!this.browser) throw new Error('Browser not initialized');
    
    const page = await this.browser.newPage();
    
    try {
      // Set user agent
      await page.setUserAgent(
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      );
      
      // Navegar a URL
      await page.goto(config.urls.libreInversion!, {
        waitUntil: config.navigationOptions?.waitUntil || 'networkidle0',
        timeout: config.navigationOptions?.timeout || 30000
      });
      
      // Clickear botones si es necesario
      if (config.navigationOptions?.clickSelectors) {
        for (const selector of config.navigationOptions.clickSelectors) {
          await page.click(selector);
          await page.waitForTimeout(1000);
        }
      }
      
      // Scroll si es necesario
      if (config.navigationOptions?.scrollToBottom) {
        await page.evaluate(() => {
          window.scrollTo(0, document.body.scrollHeight);
        });
        await page.waitForTimeout(500);
      }
      
      // Extraer datos
      const data = await page.evaluate((selectors) => {
        const extract = (selector: string) => {
          const el = document.querySelector(selector);
          return el?.textContent?.trim() || null;
        };
        
        const extractAll = (selector: string) => {
          return Array.from(document.querySelectorAll(selector))
            .map(el => el.textContent?.trim())
            .filter(Boolean);
        };
        
        return {
          tasaMensual: extract(selectors.tasaMensual),
          tasaEA: extract(selectors.tasaEA),
          montoMinimo: extract(selectors.montoMinimo),
          montoMaximo: extract(selectors.montoMaximo),
          plazoMinimo: extract(selectors.plazoMinimo),
          plazoMaximo: extract(selectors.plazoMaximo),
          requisitos: extractAll(selectors.requisitos || ''),
          ventajas: extractAll(selectors.ventajas || '')
        };
      }, config.selectors);
      
      return data;
      
    } finally {
      await page.close();
    }
  }
  
  private async scrapeStatic(config: ScraperConfig): Promise<RawData> {
    // Fetch HTML
    const response = await fetch(config.urls.libreInversion!);
    const html = await response.text();
    
    // Parse con Cheerio
    const $ = cheerio.load(html);
    
    const extract = (selector: string) => {
      return $(selector).text().trim() || null;
    };
    
    const extractAll = (selector: string) => {
      return $(selector).map((_, el) => $(el).text().trim()).get();
    };
    
    return {
      tasaMensual: extract(config.selectors.tasaMensual),
      tasaEA: extract(config.selectors.tasaEA),
      montoMinimo: extract(config.selectors.montoMinimo),
      montoMaximo: extract(config.selectors.montoMaximo),
      plazoMinimo: extract(config.selectors.plazoMinimo),
      plazoMaximo: extract(config.selectors.plazoMaximo),
      requisitos: extractAll(config.selectors.requisitos || ''),
      ventajas: extractAll(config.selectors.ventajas || '')
    };
  }
  
  private validateData(data: RawData, config: ScraperConfig): RawData {
    // Validar campos obligatorios
    if (!data.tasaMensual) {
      throw new Error('tasaMensual no encontrada');
    }
    
    if (!data.montoMinimo || !data.montoMaximo) {
      throw new Error('Montos no encontrados');
    }
    
    return data;
  }
  
  private transformData(data: RawData, config: ScraperConfig): TransformedData {
    return {
      tasaMensual: this.parsePercentage(data.tasaMensual!),
      tasaEA: this.parsePercentage(data.tasaEA || '0'),
      montoMinimo: this.parseCurrency(data.montoMinimo!),
      montoMaximo: this.parseCurrency(data.montoMaximo!),
      plazoMinimo: this.parseNumber(data.plazoMinimo || '6'),
      plazoMaximo: this.parseNumber(data.plazoMaximo || '60'),
      requisitos: data.requisitos || [],
      ventajas: data.ventajas || []
    };
  }
  
  // Parsers
  private parsePercentage(text: string): number {
    const match = text.match(/[\d.,]+/);
    if (!match) return 0;
    return parseFloat(match[0].replace(',', '.'));
  }
  
  private parseCurrency(text: string): number {
    // Remover símbolos y puntos de miles
    const cleaned = text.replace(/[$.]/g, '').replace(',', '.');
    const match = cleaned.match(/[\d.]+/);
    if (!match) return 0;
    return parseFloat(match[0]);
  }
  
  private parseNumber(text: string): number {
    const match = text.match(/\d+/);
    if (!match) return 0;
    return parseInt(match[0]);
  }
  
  async cleanup() {
    if (this.browser) {
      await this.browser.close();
    }
  }
}

interface RawData {
  tasaMensual: string | null;
  tasaEA: string | null;
  montoMinimo: string | null;
  montoMaximo: string | null;
  plazoMinimo: string | null;
  plazoMaximo: string | null;
  requisitos: string[];
  ventajas: string[];
}

interface TransformedData {
  tasaMensual: number;
  tasaEA: number;
  montoMinimo: number;
  montoMaximo: number;
  plazoMinimo: number;
  plazoMaximo: number;
  requisitos: string[];
  ventajas: string[];
}
```

---

### 3.3 Scraper Orchestrator

Coordina la ejecución de múltiples scrapers:

```typescript
// src/scrapers/scraper-orchestrator.ts

export class ScraperOrchestrator {
  private engine: ScraperEngine;
  private prisma: PrismaClient;
  
  constructor() {
    this.engine = new ScraperEngine();
    this.prisma = new PrismaClient();
  }
  
  async runAll(): Promise<ScrapingResult[]> {
    console.log('🚀 Iniciando scraping de todas las entidades...');
    
    // Inicializar browser
    await this.engine.initialize();
    
    try {
      // Obtener configs activas ordenadas por prioridad
      const configs = await this.prisma.scraperConfig.findMany({
        where: { enabled: true },
        orderBy: { priority: 'desc' }
      });
      
      console.log(`📋 ${configs.length} entidades a scrapear`);
      
      const results: ScrapingResult[] = [];
      
      // Ejecutar secuencialmente (para evitar ser bloqueados)
      for (const config of configs) {
        console.log(`⚙️  Scraping: ${config.entidadNombre}...`);
        
        try {
          // Delay entre requests
          await this.delay(config.rateLimit.delayBetweenRequests);
          
          // Scrapear
          const data = await this.engine.scrapeEntidad(config);
          
          // Actualizar producto en BD
          await this.updateProducto(config, data);
          
          // Actualizar config (último éxito)
          await this.prisma.scraperConfig.update({
            where: { id: config.id },
            data: {
              ultimoScraping: new Date(),
              ultimoExito: new Date(),
              intentosFallidos: 0
            }
          });
          
          results.push({
            entidad: config.entidadNombre,
            success: true,
            data
          });
          
          console.log(`✅ ${config.entidadNombre} - Exitoso`);
          
        } catch (error) {
          // Manejar error
          await this.handleError(config, error);
          
          results.push({
            entidad: config.entidadNombre,
            success: false,
            error: error.message
          });
          
          console.log(`❌ ${config.entidadNombre} - Error: ${error.message}`);
        }
      }
      
      return results;
      
    } finally {
      await this.engine.cleanup();
      console.log('🏁 Scraping finalizado');
    }
  }
  
  private async updateProducto(
    config: ScraperConfig, 
    data: TransformedData
  ): Promise<void> {
    // Buscar producto existente
    const existing = await this.prisma.producto.findFirst({
      where: {
        entidadNombre: config.entidadNombre,
        tipo: 'libre-inversion'
      }
    });
    
    if (existing) {
      // Detectar cambios
      const cambios = this.detectarCambios(existing, data);
      
      // Actualizar
      await this.prisma.producto.update({
        where: { id: existing.id },
        data: {
          tasaMensual: data.tasaMensual,
          tasaEfectivaAnual: data.tasaEA,
          montoMinimo: data.montoMinimo,
          montoMaximo: data.montoMaximo,
          plazoMinimo: data.plazoMinimo,
          plazoMaximo: data.plazoMaximo,
          requisitos: data.requisitos,
          ventajas: data.ventajas,
          fechaUltimoScraping: new Date(),
          fechaActualizacion: new Date(),
          cambiosDetectados: cambios,
          fuenteDatos: 'scraping'
        }
      });
      
      if (cambios.length > 0) {
        console.log(`   📝 Cambios detectados: ${cambios.join(', ')}`);
      }
      
    } else {
      // Crear nuevo producto
      await this.prisma.producto.create({
        data: {
          entidadNombre: config.entidadNombre,
          entidadLogo: `/logos/${config.entidadNombre.toLowerCase()}.png`,
          entidadTipo: config.tipo,
          tipo: 'libre-inversion',
          nombre: `Crédito Libre Inversión ${config.entidadNombre}`,
          descripcion: `Crédito de libre inversión de ${config.entidadNombre}`,
          urlFuente: config.urls.libreInversion!,
          
          tasaMensual: data.tasaMensual,
          tasaEfectivaAnual: data.tasaEA,
          montoMinimo: data.montoMinimo,
          montoMaximo: data.montoMaximo,
          plazoMinimo: data.plazoMinimo,
          plazoMaximo: data.plazoMaximo,
          
          requisitos: data.requisitos,
          ventajas: data.ventajas,
          
          ingresoMinimo: 2000000, // Default
          edadMinima: 18,
          edadMaxima: 70,
          tiposEmpleoPermitidos: ['dependiente', 'independiente'],
          tiempoAprobacion: '48 horas',
          seguroVida: 0.054,
          
          fuenteDatos: 'scraping',
          fechaUltimoScraping: new Date(),
          fechaActualizacion: new Date(),
          activo: true,
          scrapingEnabled: true
        }
      });
      
      console.log(`   ✨ Producto creado`);
    }
  }
  
  private detectarCambios(existing: any, data: TransformedData): string[] {
    const cambios: string[] = [];
    
    if (existing.tasaMensual !== data.tasaMensual) {
      cambios.push(`Tasa: ${existing.tasaMensual}% → ${data.tasaMensual}%`);
    }
    
    if (existing.montoMaximo !== data.montoMaximo) {
      cambios.push(`Monto máx: ${existing.montoMaximo} → ${data.montoMaximo}`);
    }
    
    return cambios;
  }
  
  private async handleError(config: ScraperConfig, error: any): Promise<void> {
    const intentos = config.intentosFallidos + 1;
    
    await this.prisma.scraperConfig.update({
      where: { id: config.id },
      data: {
        ultimoScraping: new Date(),
        intentosFallidos: intentos
      }
    });
    
    // Notificar si > 3 intentos fallidos
    if (intentos >= 3) {
      await this.notifyFailure(config, error);
    }
  }
  
  private async notifyFailure(config: ScraperConfig, error: any): Promise<void> {
    // TODO: Enviar email o notificación
    console.log(`🚨 ALERTA: ${config.entidadNombre} falló ${config.intentosFallidos} veces`);
  }
  
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

interface ScrapingResult {
  entidad: string;
  success: boolean;
  data?: TransformedData;
  error?: string;
}
```

---

### 3.4 Scheduler

Programación de ejecución automática:

```typescript
// src/scrapers/scraper-scheduler.ts

import cron from 'node-cron';

export class ScraperScheduler {
  private orchestrator: ScraperOrchestrator;
  
  constructor() {
    this.orchestrator = new ScraperOrchestrator();
  }
  
  start() {
    // Ejecutar diariamente a las 2 AM
    cron.schedule('0 2 * * *', async () => {
      console.log('⏰ Cron job: Iniciando scraping programado...');
      
      try {
        const results = await this.orchestrator.runAll();
        
        const exitosos = results.filter(r => r.success).length;
        const fallidos = results.filter(r => !r.success).length;
        
        console.log(`✅ Exitosos: ${exitosos}`);
        console.log(`❌ Fallidos: ${fallidos}`);
        
      } catch (error) {
        console.error('💥 Error en cron job:', error);
      }
    });
    
    console.log('📅 Scheduler iniciado: Scraping diario a las 2 AM');
  }
  
  // Ejecutar manualmente
  async runNow(): Promise<void> {
    console.log('🔧 Ejecución manual del scraping...');
    await this.orchestrator.runAll();
  }
}

// En server.ts
const scheduler = new ScraperScheduler();
scheduler.start();

// Endpoint para ejecutar manualmente
app.post('/api/v1/admin/scraping/run', async (req, res) => {
  try {
    await scheduler.runNow();
    res.json({ success: true, message: 'Scraping ejecutado' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});
```

---

## 4. LOGGING Y MONITOREO

### 4.1 Tabla de Logs

```prisma
model ScrapingLog {
  id              String   @id @default(uuid())
  scraperConfigId String
  entidadNombre   String
  
  // Resultado
  exitoso         Boolean
  duracionMs      Int
  
  // Datos
  productosActualizados Int @default(0)
  cambiosDetectados     String[]
  
  // Error (si aplica)
  errorMensaje    String?
  errorStack      String?
  
  // Metadata
  timestamp       DateTime @default(now())
  
  scraperConfig   ScraperConfig @relation(fields: [scraperConfigId], references: [id])
  
  @@index([scraperConfigId, timestamp])
  @@index([timestamp])
  @@map("scraping_logs")
}
```

### 4.2 Dashboard de Monitoreo

Endpoint para ver estado:

```typescript
app.get('/api/v1/admin/scraping/status', async (req, res) => {
  // Últimos 30 días
  const logs = await prisma.scrapingLog.findMany({
    where: {
      timestamp: {
        gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      }
    },
    orderBy: { timestamp: 'desc' },
    take: 100
  });
  
  const configs = await prisma.scraperConfig.findMany();
  
  const status = configs.map(config => {
    const configLogs = logs.filter(l => l.scraperConfigId === config.id);
    const exitosos = configLogs.filter(l => l.exitoso).length;
    const fallidos = configLogs.filter(l => !l.exitoso).length;
    
    return {
      entidad: config.entidadNombre,
      enabled: config.enabled,
      ultimoScraping: config.ultimoScraping,
      ultimoExito: config.ultimoExito,
      intentosFallidos: config.intentosFallidos,
      tasaExito: exitosos / (exitosos + fallidos) * 100,
      stats: {
        exitosos,
        fallidos,
        total: configLogs.length
      }
    };
  });
  
  res.json({
    success: true,
    data: {
      resumen: {
        totalEntidades: configs.length,
        entidadesActivas: configs.filter(c => c.enabled).length,
        ultimaEjecucion: logs[0]?.timestamp
      },
      entidades: status
    }
  });
});
```

---

## 5. ENTIDADES INICIALES A SCRAPEAR

### 5.1 Bancos Tradicionales

1. **Bancolombia**
   - URL: https://www.grupobancolombia.com/personas/productos-servicios/creditos
   - Dificultad: Media
   - Estrategia: Dynamic (requiere JS)

2. **Davivienda**
   - URL: https://www.davivienda.com/wps/portal/personas/nuevo/creditos
   - Dificultad: Media
   - Estrategia: Dynamic

3. **BBVA Colombia**
   - URL: https://www.bbva.com.co/personas/productos/prestamos.html
   - Dificultad: Media
   - Estrategia: Dynamic

4. **Banco de Bogotá**
   - URL: https://www.bancodebogota.com/personas/creditos
   - Dificultad: Baja
   - Estrategia: Static

### 5.2 Fintech

5. **Rappipay**
   - URL: https://www.rappipay.com.co/credito-digital
   - Dificultad: Baja
   - Estrategia: Static

6. **Addi**
   - URL: https://addi.com/co/credito-personal
   - Dificultad: Media
   - Estrategia: Dynamic

7. **Lineru**
   - URL: https://www.lineru.com/credito
   - Dificultad: Baja
   - Estrategia: Static

### 5.3 Cooperativas

8. **Coofinep**
   - URL: https://www.coofinep.com.co/creditos
   - Dificultad: Baja
   - Estrategia: Static

---

## 6. COMPLIANCE Y ÉTICA

### 6.1 Reglas de Scraping

✅ **Permitido:**
- Datos públicos en sitios web
- Información de productos y servicios
- Tasas y condiciones publicadas
- Respeto a robots.txt

❌ **No permitido:**
- Áreas con login/autenticación
- Datos personales de clientes
- Información confidencial
- Sobrecargar servidores

### 6.2 robots.txt

Respetar robots.txt de cada sitio:

```typescript
import robotsParser from 'robots-parser';

async function checkRobots(url: string): Promise<boolean> {
  const robotsUrl = new URL('/robots.txt', url).href;
  const response = await fetch(robotsUrl);
  const robotsTxt = await response.text();
  
  const robots = robotsParser(robotsUrl, robotsTxt);
  return robots.isAllowed(url, 'ComparadorBot');
}
```

### 6.3 User Agent

```
User-Agent: ComparadorBot/1.0 (+https://tudominio.com/bot-info)
```

---

## 7. PLAN DE IMPLEMENTACIÓN

### Semana 1: Setup Base
- [ ] Instalar dependencias (Puppeteer, Cheerio, node-cron)
- [ ] Crear tablas de BD (scraper_configs, scraping_logs)
- [ ] Implementar ScraperEngine básico

### Semana 2: Configuraciones
- [ ] Crear configs para 2 entidades piloto
- [ ] Probar scraping manual
- [ ] Ajustar selectores

### Semana 3: Orchestrator
- [ ] Implementar ScraperOrchestrator
- [ ] Sistema de logs
- [ ] Manejo de errores

### Semana 4: Scheduler
- [ ] Implementar cron job
- [ ] Testing end-to-end
- [ ] Deploy

### Semana 5-8: Expansión
- [ ] Agregar más entidades
- [ ] Dashboard de monitoreo
- [ ] Alertas y notificaciones

---

**Documento creado por:** Sistema SDD  
**Próximo paso:** Implementación del scraper engine
