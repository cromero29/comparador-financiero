import puppeteer, { Browser, Page } from 'puppeteer';
import * as cheerio from 'cheerio';
import { logger } from '../config/logger';
import { env } from '../config/env';
import { ScraperError } from '../utils/errors';
import { ScraperResult, ProductoScrapeado } from '../types';

export interface ScraperConfig {
  url: string;
  estrategia: 'STATIC' | 'DYNAMIC';
  selectores: Record<string, string>;
  waitForSelector?: string;
  timeout?: number;
}

export class ScraperEngine {
  private browser?: Browser;

  /**
   * Scrapear usando estrategia estática (Cheerio)
   */
  async scrapeStatic(config: ScraperConfig): Promise<ScraperResult> {
    const startTime = Date.now();
    
    try {
      logger.info(`Scraping estático iniciado: ${config.url}`);

      // Fetch HTML
      const response = await fetch(config.url, {
        headers: {
          'User-Agent': 'ComparadorBot/1.0 (+https://comparador.com/bot; soporte@comparador.com)',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const html = await response.text();
      const $ = cheerio.load(html);

      // Extraer datos usando selectores
      const producto = this.extractData($, config.selectores);

      const duracionMs = Date.now() - startTime;
      logger.info(`Scraping estático completado en ${duracionMs}ms`);

      return {
        exitoso: true,
        productosEncontrados: producto ? 1 : 0,
        productos: producto ? [producto] : [],
        duracionMs,
      };

    } catch (error: any) {
      const duracionMs = Date.now() - startTime;
      logger.error('Error en scraping estático:', error);

      return {
        exitoso: false,
        productosEncontrados: 0,
        error: error.message,
        duracionMs,
      };
    }
  }

  /**
   * Scrapear usando estrategia dinámica (Puppeteer)
   */
  async scrapeDynamic(config: ScraperConfig): Promise<ScraperResult> {
    const startTime = Date.now();
    let page: Page | undefined;

    try {
      logger.info(`Scraping dinámico iniciado: ${config.url}`);

      // Iniciar browser si no existe
      if (!this.browser) {
        await this.initBrowser();
      }

      // Crear nueva página
      page = await this.browser!.newPage();

      // Configurar viewport
      await page.setViewport({ width: 1920, height: 1080 });

      // Configurar user agent
      await page.setUserAgent(
        'ComparadorBot/1.0 (+https://comparador.com/bot; soporte@comparador.com)'
      );

      // Navegar a la URL
      await page.goto(config.url, {
        waitUntil: 'networkidle2',
        timeout: config.timeout || env.SCRAPING_TIMEOUT,
      });

      // Esperar por selector específico si está configurado
      if (config.waitForSelector) {
        await page.waitForSelector(config.waitForSelector, {
          timeout: config.timeout || env.SCRAPING_TIMEOUT,
        });
      }

      // Extraer HTML
      const html = await page.content();
      const $ = cheerio.load(html);

      // Extraer datos usando selectores
      const producto = this.extractData($, config.selectores);

      // Cerrar página
      await page.close();

      const duracionMs = Date.now() - startTime;
      logger.info(`Scraping dinámico completado en ${duracionMs}ms`);

      return {
        exitoso: true,
        productosEncontrados: producto ? 1 : 0,
        productos: producto ? [producto] : [],
        duracionMs,
      };

    } catch (error: any) {
      if (page) {
        await page.close().catch(() => {});
      }

      const duracionMs = Date.now() - startTime;
      logger.error('Error en scraping dinámico:', error);

      return {
        exitoso: false,
        productosEncontrados: 0,
        error: error.message,
        duracionMs,
      };
    }
  }

  /**
   * Extraer datos usando selectores CSS
   */
  private extractData(
    $: cheerio.CheerioAPI,
    selectores: Record<string, string>
  ): ProductoScrapeado | null {
    try {
      const producto: ProductoScrapeado = {
        nombre: '',
      };

      // Extraer cada campo usando su selector
      for (const [campo, selector] of Object.entries(selectores)) {
        const elemento = $(selector).first();
        
        if (elemento.length === 0) {
          logger.warn(`Selector no encontrado: ${campo} -> ${selector}`);
          continue;
        }

        const texto = elemento.text().trim();
        const valor = this.parseValue(texto, campo);

        // Asignar al producto según el campo
        switch (campo) {
          case 'nombre':
            producto.nombre = texto;
            break;
          case 'tasaMensual':
          case 'tasaNominalMensual':
            producto.tasaNominalMensual = valor;
            break;
          case 'tasaAnual':
          case 'tasaNominalAnual':
            producto.tasaNominalAnual = valor;
            break;
          case 'tasaEfectivaAnual':
          case 'TEA':
            producto.tasaEfectivaAnual = valor;
            break;
          case 'montoMinimo':
            producto.montoMinimo = valor;
            break;
          case 'montoMaximo':
            producto.montoMaximo = valor;
            break;
          case 'plazoMinimo':
            producto.plazoMinimoMeses = valor;
            break;
          case 'plazoMaximo':
            producto.plazoMaximoMeses = valor;
            break;
          case 'costoEstudio':
            producto.costoEstudio = valor;
            break;
          case 'ingresoMinimo':
            producto.ingresoMinimo = valor;
            break;
          default:
            // Guardar en metadata
            if (!producto.metadata) {
              producto.metadata = {};
            }
            producto.metadata[campo] = texto;
        }
      }

      // Validar que al menos tenga nombre
      if (!producto.nombre) {
        logger.warn('Producto sin nombre, descartando');
        return null;
      }

      return producto;

    } catch (error: any) {
      logger.error('Error extrayendo datos:', error);
      return null;
    }
  }

  /**
   * Parsear valor de texto a número
   */
  private parseValue(texto: string, campo: string): number | undefined {
    // Remover símbolos comunes
    let limpio = texto
      .replace(/[$%,.\s]/g, '')
      .replace(/COP|USD|pesos|mes|año/gi, '')
      .trim();

    // Intentar convertir a número
    const numero = parseFloat(limpio);

    if (isNaN(numero)) {
      logger.warn(`No se pudo parsear '${texto}' para campo '${campo}'`);
      return undefined;
    }

    // Ajustes según el campo
    if (campo.includes('tasa') || campo.includes('Tasa')) {
      // Si es tasa y es > 100, probablemente está en formato 1800 (18.00%)
      if (numero > 100) {
        return numero / 100;
      }
      return numero;
    }

    return numero;
  }

  /**
   * Inicializar navegador Puppeteer
   */
  private async initBrowser(): Promise<void> {
    logger.info('Iniciando navegador Puppeteer...');

    this.browser = await puppeteer.launch({
      headless: env.PUPPETEER_HEADLESS,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
      ],
    });

    logger.info('Navegador Puppeteer iniciado');
  }

  /**
   * Cerrar navegador
   */
  async close(): Promise<void> {
    if (this.browser) {
      await this.browser.close();
      this.browser = undefined;
      logger.info('Navegador Puppeteer cerrado');
    }
  }

  /**
   * Ejecutar scraping según estrategia
   */
  async scrape(config: ScraperConfig): Promise<ScraperResult> {
    if (config.estrategia === 'STATIC') {
      return this.scrapeStatic(config);
    } else {
      return this.scrapeDynamic(config);
    }
  }
}
