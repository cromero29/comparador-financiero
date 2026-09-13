# Resumen Ejecutivo - MVP
## Comparador de Productos Financieros

**Versión:** 1.0 - MVP Simplificado  
**Fecha:** Septiembre 2026  
**Tipo:** Comparador Informativo (tipo Compara Precios)  

---

## 🎯 CONCEPTO

Una plataforma web donde las personas pueden **comparar ofertas de crédito** de múltiples entidades financieras en un solo lugar, de forma rápida y sin registrarse.

**Inspiración:** Similar a "Compara Precios" pero para productos financieros.

---

## 📋 ALCANCE DEL MVP

### ✅ Lo que SÍ incluye

**Productos:**
- Crédito de libre inversión
- Compra de cartera (consolidación de deudas)

**Funcionalidades Core:**
1. **Web Scraping Automático** - Extrae datos de sitios web de entidades financieras
2. **Formulario simple** - Usuario ingresa: monto, plazo, ingresos
3. **Motor de comparación** - Consulta BD y calcula mejores ofertas
4. **Resultados visuales** - Muestra top 5 ofertas ordenadas por conveniencia
5. **Simulador en tiempo real** - Ajustar monto/plazo y ver cambios al instante
6. **Información detallada** - Desglose de costos, requisitos, ventajas
7. **Redirección directa** - Botón que lleva al sitio web de la entidad

**Características:**
- ✅ Sin registro de usuarios
- ✅ Mobile-first
- ✅ Gratuito 100%
- ✅ Rápido (< 2 segundos)
- ✅ Simple de usar

### ❌ Lo que NO incluye (Post-MVP)

- ❌ Sistema de solicitud de créditos (leads)
- ❌ Dashboard para entidades financieras
- ❌ Login/registro de usuarios
- ❌ Integración con APIs de bancos
- ❌ Centrales de riesgo
- ❌ Otros productos (hipotecario, vehículo, tarjetas)

---

## 👤 USUARIO OBJETIVO

**Persona natural que:**
- Necesita un crédito de libre inversión ($1M - $100M)
- Quiere consolidar sus deudas en un solo crédito
- Busca comparar opciones antes de decidir
- No quiere visitar múltiples bancos
- Prefiere tomar decisiones informadas

**Comportamiento:**
1. Entra a la web
2. Selecciona tipo de crédito
3. Ingresa datos básicos
4. Ve las 5 mejores opciones
5. Compara y elige
6. Va al sitio del banco a solicitar

---

## 🎨 FLUJO DE USUARIO

```
┌─────────────────┐
│  Landing Page   │
│                 │
│ "Compara las    │
│ mejores ofertas │
│ de crédito"     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Selección Tipo  │
│                 │
│ [Libre Inv.]    │
│ [Compra Cart.]  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   Formulario    │
│                 │
│ • Monto         │
│ • Plazo         │
│ • Ingresos      │
│ • Tipo empleo   │
│ (+ datos para   │
│  compra cartera)│
└────────┬────────┘
         │
         ▼ [Comparar]
┌─────────────────┐
│   Resultados    │
│   (Top 5)       │
│                 │
│ 🥇 #1 - Mejor   │
│ 🥈 #2           │
│ 🥉 #3           │
│    #4           │
│    #5           │
│                 │
│ Cada card:      │
│ • Entidad       │
│ • Tasa          │
│ • Cuota         │
│ • Costo total   │
│ • Ahorro        │
│ • [Solicitar]   │
└────────┬────────┘
         │
         ▼ [Clic Solicitar]
┌─────────────────┐
│  Nueva Pestaña  │
│                 │
│ Sitio web de    │
│ la entidad      │
│ financiera      │
└─────────────────┘
```

---

## 🏗️ ARQUITECTURA TÉCNICA

### Stack Tecnológico

**Frontend:**
- React 18 + TypeScript
- Vite (build tool)
- TailwindCSS + Shadcn/ui
- Zustand (estado)
- React Hook Form (formularios)

**Backend:**
- Node.js 20 + Express
- TypeScript
- Prisma ORM
- PostgreSQL

**Hosting (Gratuito):**
- Frontend: Vercel
- Backend: Railway
- Database: Railway PostgreSQL (500MB)

**Costo Total: $0/mes** 🎉

### Arquitectura Simplificada

```
┌──────────────────────────────────────┐
│         USUARIO (Browser)            │
└───────────────┬──────────────────────┘
                │
                │ HTTPS
                ▼
        ┌───────────────┐
        │   Frontend    │
        │   (Vercel)    │
        │   React       │
        └───────┬───────┘
                │
                │ REST API
                ▼
        ┌───────────────┐
        │   Backend     │
        │  (Railway)    │
        │  Express      │
        └───────┬───────┘
                │
                │ Prisma
                ▼
        ┌───────────────┐
        │  PostgreSQL   │
        │  (Railway)    │
        └───────────────┘
```

---

## 📊 MODELO DE DATOS SIMPLIFICADO

### Entidades Principales (MVP)

**1. Producto**
```typescript
{
  id: string,
  
  // Entidad
  entidadNombre: string,
  entidadLogo: string,
  entidadTipo: 'banco' | 'fintech' | 'cooperativa',
  tipo: 'libre-inversion' | 'compra-cartera',
  nombre: string,
  
  // Condiciones (extraídas por scraping)
  montoMinimo: number,
  montoMaximo: number,
  plazoMinimo: number,
  plazoMaximo: number,
  
  // Tasas (extraídas por scraping)
  tasaMensual: number,
  tasaEA: number,
  seguroVida: number,
  
  // Info adicional
  ingresoMinimo: number,
  tiempoAprobacion: string,
  requisitos: string[],
  ventajas: string[],
  
  // URLs
  urlSolicitud: string, // Link al sitio del banco
  urlFuente: string,    // URL de donde se scrapeó
  
  // Metadata de scraping
  fuenteDatos: 'scraping' | 'manual',
  fechaUltimoScraping: Date,
  fechaActualizacion: Date,
  cambiosDetectados: string[],
  
  activo: boolean
}
```

**2. ScraperConfig**
```typescript
{
  id: string,
  entidadNombre: string,
  
  // URLs a scrapear
  urls: {
    libreInversion: string,
    compraCartera: string
  },
  
  // Selectores CSS
  selectors: {
    tasaMensual: string,
    montoMinimo: string,
    montoMaximo: string,
    // ... más selectores
  },
  
  // Configuración
  strategy: 'static' | 'dynamic',
  enabled: boolean,
  priority: number,
  
  // Estado
  ultimoScraping: Date,
  ultimoExito: Date,
  intentosFallidos: number
}
```

**3. ScrapingLog** (opcional - para monitoreo)
```typescript
{
  id: string,
  scraperConfigId: string,
  exitoso: boolean,
  duracionMs: number,
  cambiosDetectados: string[],
  errorMensaje: string,
  timestamp: Date
}
```

**Total de Tablas en MVP: 3** (productos, scraper_configs, scraping_logs)

---

## 🧮 ALGORITMO CORE

### Motor de Comparación

**Entrada:**
- Monto solicitado
- Plazo en meses
- Ingresos mensuales
- Tipo de empleo

**Proceso:**
1. Filtrar productos elegibles (monto, plazo, ingresos)
2. Calcular cuota mensual para cada uno (sistema francés)
3. Calcular costo total (cuotas + seguros + comisiones)
4. Calcular ahorro (solo compra de cartera)
5. Calcular score ponderado:
   - 40% Costo total
   - 30% Tasa
   - 20% Tiempo aprobación
   - 10% Requisitos
6. Ordenar por score (mejor a peor)
7. Retornar top 5

**Salida:**
- Array de 5 mejores ofertas ordenadas
- Cada oferta con: entidad, tasa, cuota, costo, ahorro, badges

### Fórmula de Cuota Mensual

```
        P × i × (1 + i)^n
CM = ─────────────────────
        (1 + i)^n - 1

P = Monto del crédito
i = Tasa mensual (decimal)
n = Plazo en meses
```

---

## 📱 UI/UX - Pantallas Principales

### 1. Landing Page
- Hero con call-to-action
- Explicación simple del servicio
- Botones: "Crédito Libre Inversión" | "Compra de Cartera"

### 2. Formulario de Comparación
- Campos claros y grandes
- Sliders para monto y plazo
- Validación en tiempo real
- Botón grande "Comparar Ofertas"

### 3. Resultados (Cards)
```
╔════════════════════════════════╗
║ 🥇 #1 - MEJOR OPCIÓN           ║
║ ────────────────────────────── ║
║ [Logo] FINTECH RÁPIDA          ║
║                                ║
║ Tasa: 1.2% MV | 15.4% EA       ║
║ Cuota: $980.000/mes            ║
║ Total a pagar: $35.280.000     ║
║                                ║
║ ✓ Tasa más baja                ║
║ ✓ Aprobación en 2 horas        ║
║ ✓ 100% digital                 ║
║                                ║
║ 💰 Ahorras $70.000/mes         ║
║                                ║
║ [Ver Detalles] [Solicitar] →  ║
╚════════════════════════════════╝
```

### 4. Detalle de Oferta (Modal/Página)
- Tabla de amortización
- Desglose completo de costos
- Requisitos documentales
- Información de la entidad

---

## 🚀 PLAN DE EJECUCIÓN

### Semana 1-2: Setup y Web Scraping Base
- ✅ Setup proyectos (frontend + backend)
- ✅ Configurar Prisma + PostgreSQL
- ✅ Crear schema de BD (productos, scraper_configs, scraping_logs)
- ✅ Instalar Puppeteer/Cheerio
- ✅ Implementar ScraperEngine básico
- ✅ Crear 2-3 configuraciones de scraper piloto
- ✅ Probar scraping manual
- ✅ Setup Vercel + Railway

### Semana 3-4: Backend Core + Scraping Automático
- ✅ Implementar ScraperOrchestrator
- ✅ Sistema de logs y manejo de errores
- ✅ Cron job para scraping diario (2 AM)
- ✅ Endpoint de comparación
- ✅ Algoritmo de elegibilidad
- ✅ Cálculos financieros
- ✅ Sistema de ranking
- ✅ Tests básicos

### Semana 5-6: Frontend Core
- ✅ Landing page
- ✅ Formulario de comparación
- ✅ Página de resultados
- ✅ Cards de ofertas con indicador de actualización
- ✅ Modal de detalle
- ✅ Mostrar fecha de último scraping

### Semana 7: Refinamiento y Expansión
- ✅ Simulador en tiempo real
- ✅ Mobile responsive
- ✅ Agregar más entidades (5-8 total)
- ✅ Dashboard básico de monitoreo del scraping
- ✅ Optimización de performance
- ✅ Validaciones completas

### Semana 8: Deploy y Testing
- ✅ Deploy a producción
- ✅ Testing end-to-end del scraping
- ✅ Verificar cron jobs funcionando
- ✅ Ajustes finales
- ✅ Documentación

**Total: 2 meses** ⏱️

---

## 📈 MÉTRICAS DE ÉXITO

### Objetivos Mes 1-3
- **Tráfico:** 500-1,000 visitantes/mes
- **Comparaciones:** 300-600/mes
- **Clics a entidades:** 20% de usuarios
- **Tiempo en sitio:** > 3 minutos
- **Mobile:** > 50% del tráfico

### KPIs Técnicos
- Uptime: > 95%
- Tiempo de carga: < 3 segundos
- Tiempo de comparación: < 2 segundos
- Error rate: < 5%

---

## 💰 MODELO DE NEGOCIO (Futuro)

**Fase MVP:** Sin monetización (puramente comparador)

**Fase 2 - Monetización:**
1. **CPC (Costo Por Clic)** - Entidades pagan por cada clic
2. **CPL (Costo Por Lead)** - Entidades pagan por solicitudes
3. **CPA (Costo Por Adquisición)** - Comisión por crédito desembolsado
4. **Productos patrocinados** - Entidades pagan por destacarse

**Proyección:**
- Mes 1-3: $0 (construcción de tráfico)
- Mes 4-6: $200-500 USD/mes (CPC inicial)
- Mes 7-12: $1,000-2,000 USD/mes (CPC + CPL)
- Año 2: $5,000+ USD/mes (CPC + CPL + CPA)

---

## ⚠️ RIESGOS Y MITIGACIONES

### Riesgos Identificados

**1. Datos desactualizados**
- **Riesgo:** Tasas cambian y no se actualizan
- **Mitigación:** Revisión manual mensual + disclaimer de vigencia

**2. Bajo tráfico inicial**
- **Riesgo:** Pocos usuarios en primeros meses
- **Mitigación:** SEO básico, contenido educativo, redes sociales

**3. Dependencia de hosting gratuito**
- **Riesgo:** Límites de uso o cambios en planes
- **Mitigación:** Monitorear uso, tener plan B (hosting económico)

**4. Competencia**
- **Riesgo:** Comparadores existentes
- **Mitigación:** Enfoque en UX simple y cálculos transparentes

---

## 📝 PRÓXIMOS PASOS INMEDIATOS

1. ✅ **Finalizar especificaciones SDD** (en progreso)
2. 🔨 **Setup inicial de proyectos**
   - Crear repos en GitHub
   - Configurar Vercel + Railway
   - Setup inicial de código
3. 📊 **Investigar productos reales**
   - Tasas actuales de 5-8 entidades
   - Crear catálogo inicial
4. 🎨 **Diseño de UI**
   - Wireframes de pantallas principales
   - Paleta de colores y tipografía
5. 💻 **Desarrollo Sprint 1**
   - Backend: API de comparación
   - Frontend: Formulario básico

---

## 🎯 VISIÓN A LARGO PLAZO

**1 año:** Comparador consolidado con 1,000+ usuarios/mes  
**2 años:** Marketplace con leads y monetización activa  
**3 años:** Plataforma líder en Colombia con expansión regional

---

**Documento creado por:** Sistema SDD  
**Última actualización:** Septiembre 2026  
**Estado:** MVP Simplificado - Listo para desarrollo
