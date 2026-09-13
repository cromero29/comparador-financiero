# Requerimientos Funcionales y No Funcionales
## Plataforma de Comparación Financiera - MVP

**Proyecto:** Comparador de Productos Financieros  
**MVP:** Crédito de Libre Inversión y Compra de Cartera  
**Versión:** 1.0  
**Fecha:** Septiembre 2026  
**Metodología:** Specification-Driven Development (SDD)

---

## 1. VISIÓN DEL PRODUCTO

### 1.1 Problema a Resolver
Las personas necesitan comparar múltiples ofertas de crédito de diferentes entidades financieras, pero actualmente deben:
- Visitar físicamente múltiples bancos
- Navegar múltiples sitios web con información no estandarizada
- Realizar cálculos manuales para comparar
- No tienen visibilidad del ahorro real
- Desconocen todas las opciones disponibles

### 1.2 Propuesta de Valor
**Para Usuarios Finales:**
"Encuentre y compare las mejores opciones de crédito en minutos, viendo ofertas reales de múltiples entidades financieras desde un solo lugar, sin necesidad de registrarse."

### 1.3 Alcance del MVP - Versión Simplificada
**Productos Financieros Incluidos:**
- ✅ Crédito de libre inversión
- ✅ Compra de cartera (consolidación de deudas)

**Funcionalidades Core MVP:**
- ✅ Comparador inteligente (hasta RF-004)
- ✅ Simulador financiero en tiempo real
- ✅ Ranking automático de ofertas
- ✅ Visualización de resultados ordenados
- ✅ Información detallada por oferta
- ✅ Cálculo de ahorro para compra de cartera
- ✅ Web scraping o datos manuales de entidades

**Fuera del Alcance del MVP:**
- ❌ Sistema de leads (solicitud de crédito)
- ❌ Dashboard para entidades financieras (B2B)
- ❌ Registro de usuarios (opcional)
- ❌ Crédito hipotecario
- ❌ Crédito de vehículo
- ❌ Tarjetas de crédito
- ❌ CDT e inversiones
- ❌ Seguros

**Nota:** El MVP se enfoca en ser un **comparador informativo** tipo "Compara Precios". El usuario consulta, compara y decide. La conversión (solicitar el crédito) se hace directamente en el sitio web de la entidad financiera elegida.

---

## 2. USUARIOS Y ROLES - MVP SIMPLIFICADO

### 2.1 Usuario Final (Usuario Único del MVP)
**Perfil Principal:**
- Persona natural mayor de edad
- Con ingresos demostrables
- Que necesita:
  - Crédito de libre inversión ($1M - $100M COP)
  - Consolidar deudas existentes

**Necesidades:**
- Comparar ofertas reales sin registrarse
- Simular cuotas y costos totales en tiempo real
- Entender el ahorro estimado (compra de cartera)
- Ver información detallada de cada oferta
- Acceder al sitio web de la entidad para solicitar

**Flujo del Usuario:**
1. Ingresa a la web
2. Selecciona tipo de crédito (libre inversión o compra de cartera)
3. Ingresa datos requeridos (monto, plazo, ingresos)
4. Ve comparación de las 5 mejores ofertas
5. Hace clic en la oferta elegida → redirige al sitio de la entidad

### 2.2 Administrador de Plataforma (Futuro - Post-MVP)
**Responsabilidades:**
- Gestionar catálogo de productos
- Actualizar tasas y condiciones
- Configurar algoritmo de ranking
- Gestionar contenido educativo

**Nota:** En el MVP, los productos se gestionan directamente en la base de datos o mediante scripts de actualización.

---

## 3. REQUERIMIENTOS FUNCIONALES - MVP

### RF-001: Formulario de Solicitud de Comparación
**Prioridad:** Crítica | **Módulo:** Frontend

**Descripción:**  
El usuario debe poder ingresar su información básica para recibir ofertas personalizadas. **No requiere registro ni autenticación.**

**Criterios de Aceptación:**
- ✅ Seleccionar tipo de producto (libre inversión o compra de cartera)
- ✅ Capturar monto solicitado ($1M - $100M)
- ✅ Capturar plazo deseado (6 - 84 meses)
- ✅ Capturar ingresos mensuales
- ✅ Capturar tipo de empleo (dependiente/independiente)
- ✅ Validación de datos en tiempo real
- ✅ Diseño responsive (mobile-first)
- ✅ Sin necesidad de crear cuenta

**Para Compra de Cartera Adicional:**
- ✅ Cantidad de deudas a consolidar
- ✅ Monto total adeudado
- ✅ Cuota mensual actual estimada

**Campos del Formulario:**
```typescript
interface FormularioComparacion {
  // Tipo de crédito
  tipoProducto: 'libre-inversion' | 'compra-cartera';
  
  // Datos del crédito
  montoSolicitado: number; // COP
  plazoMeses: number;
  
  // Datos personales básicos (mínimos)
  ingresos: number; // COP mensuales
  tipoEmpleo: 'dependiente' | 'independiente';
  edad?: number; // Opcional
  ciudad?: string; // Opcional
  
  // Para compra de cartera
  cantidadDeudas?: number;
  montoTotalDeudas?: number;
  cuotaMensualActual?: number;
}
```

---

### RF-002: Motor de Comparación
**Prioridad:** Crítica | **Módulo:** Backend

**Descripción:**  
Sistema que consulta productos de la base de datos, aplica reglas de elegibilidad y calcula las ofertas disponibles.

**Criterios de Aceptación:**
- ✅ Consultar productos activos de la BD
- ✅ Aplicar reglas de elegibilidad por producto
- ✅ Calcular cuota mensual (método francés)
- ✅ Calcular costo total del crédito
- ✅ Calcular tasa efectiva anual (TEA)
- ✅ Incluir seguros y costos adicionales
- ✅ Tiempo de respuesta < 2 segundos
- ✅ Ranking automático de ofertas
- ✅ Retornar máximo 5 mejores ofertas

**Algoritmo de Ranking (Ponderado):**
```
Score = (40% * ScoreCostoTotal) + 
        (30% * ScoreTasa) + 
        (20% * ScoreTiempoRespuesta) + 
        (10% * ScoreRequisitos)
```

**Reglas de Negocio:**
1. Solo mostrar ofertas donde el usuario es elegible
2. Ordenar por mejor costo total para el cliente
3. Destacar el ahorro vs opción más cara
4. Mostrar máximo 5 ofertas (las mejores)

**Fuente de Datos:**
- Base de datos local con productos de entidades
- Actualización manual o mediante scripts (web scraping futuro)
- Cada producto tiene: nombre entidad, logo, tasas, requisitos, URL

---

### RF-003: Simulador Financiero en Tiempo Real
**Prioridad:** Alta | **Módulo:** Backend/Frontend

**Descripción:**  
Herramienta que permite al usuario ajustar monto y plazo y ver cómo cambian las ofertas instantáneamente.

**Criterios de Aceptación:**
- ✅ Ajustar monto con slider o input
- ✅ Ajustar plazo con slider o input
- ✅ Recalcular todas las ofertas dinámicamente
- ✅ Mostrar indicador de capacidad de pago (% de ingresos)
- ✅ Respuesta instantánea (< 500ms)

**Fórmulas Clave:**
```
Cuota Mensual (Sistema Francés):
CM = P * (i * (1 + i)^n) / ((1 + i)^n - 1)

Costo Total:
CT = (CM * n) + Seguros + Comisiones

Ahorro (compra de cartera):
Ahorro = CuotaActual - CuotaNueva
```

---

### RF-004: Visualización de Resultados (Página de Comparación)
**Prioridad:** Crítica | **Módulo:** Frontend

**Descripción:**  
Pantalla que muestra las 5 mejores ofertas ordenadas con toda la información relevante.

**Criterios de Aceptación:**
- ✅ Cards/tarjetas para cada oferta
- ✅ Información clave visible: entidad, logo, tasa, cuota, costo total
- ✅ Badge de "Mejor opción" en la primera
- ✅ Badges adicionales: "Tasa más baja", "Cuota más baja", "Más rápido"
- ✅ Desglose de costos expandible (modal o acordeón)
- ✅ Botón "Solicitar en [Entidad]" que abre el sitio web de la entidad
- ✅ Información de requisitos por entidad
- ✅ Comparación lado a lado (opcional)
- ✅ Compartir resultado (opcional)

**Vista de Card por Oferta:**
```
╔══════════════════════════════════════╗
║  🏦 BANCO EJEMPLO        🥇 #1       ║
║  [Logo]                              ║
║                                      ║
║  Tasa MV: 1.2%                       ║
║  Cuota: $980.000/mes                 ║
║  Costo Total: $35.280.000            ║
║                                      ║
║  ⏱️ Aprobación: 24 horas             ║
║  📋 Requisitos: Cédula, Cert. Lab.   ║
║                                      ║
║  💰 Ahorra $70.000/mes vs actual     ║
║  (solo compra de cartera)            ║
║                                      ║
║  [Ver Detalles] [Solicitar Ahora]   ║
║  ↳ Abre sitio web del banco          ║
╚══════════════════════════════════════╝
```

**Al hacer clic en "Solicitar Ahora":**
- Abre nueva pestaña con la URL de la entidad financiera
- URL almacenada en BD por producto: `producto.urlSolicitud`
- Tracking del clic para analytics (futuro monetización CPC)

---

### RF-005: Sistema de Web Scraping (Fuente de Datos Automática)
**Prioridad:** Crítica | **Módulo:** Backend/Scraper

**Descripción:**  
Sistema automatizado que extrae datos de productos financieros desde los sitios web públicos de entidades financieras mediante web scraping.

**Criterios de Aceptación:**
- ✅ Scraper para mínimo 5-8 entidades financieras
- ✅ Extracción de: tasas, montos, plazos, requisitos, condiciones
- ✅ Ejecución automática programada (cron job diario)
- ✅ Actualización de BD con datos frescos
- ✅ Manejo de errores y reintentos
- ✅ Logs de scraping exitoso/fallido
- ✅ Validación de datos extraídos
- ✅ Backup de datos anteriores antes de actualizar
- ✅ Notificación si scraping falla > 24 horas

**Tecnologías:**
- **Puppeteer** o **Playwright** - Browser automation
- **Cheerio** - HTML parsing (para sitios estáticos)
- **node-cron** - Scheduling
- **Prisma** - Actualización de BD

**Arquitectura del Scraper:**
```
┌─────────────────────────────────────┐
│   Sitios Web de Entidades           │
│   (Datos públicos)                  │
└──────────────┬──────────────────────┘
               │
               │ HTTP/HTTPS
               ▼
       ┌───────────────────┐
       │  Scraper Service  │
       │  (Puppeteer)      │
       │                   │
       │  • Parser         │
       │  • Validator      │
       │  • Transformer    │
       └─────────┬─────────┘
                 │
                 │ Update/Insert
                 ▼
         ┌───────────────┐
         │  PostgreSQL   │
         │  (Productos)  │
         └───────────────┘
```

**Flujo de Scraping:**
1. **Cron job** ejecuta scraper diariamente a las 2 AM
2. **Para cada entidad:**
   - Navegar a URL del producto
   - Extraer datos con selectores CSS
   - Validar datos extraídos
   - Transformar a formato estándar
   - Comparar con datos existentes
   - Actualizar si hay cambios
3. **Logging:** Guardar resultado (éxito/error)
4. **Notificación:** Email si falla por > 24h

**Estructura de Configuración del Scraper:**
```typescript
interface ScraperConfig {
  entidadId: string;
  nombre: string;
  tipo: 'banco' | 'fintech' | 'cooperativa';
  
  // URLs a scrapear
  urls: {
    libreInversion?: string;
    compraCartera?: string;
  };
  
  // Selectores CSS para extraer datos
  selectors: {
    tasaMensual?: string;
    tasaEA?: string;
    montoMinimo?: string;
    montoMaximo?: string;
    plazoMinimo?: string;
    plazoMaximo?: string;
    // ... más selectores
  };
  
  // Estrategia de scraping
  strategy: 'static' | 'dynamic'; // Cheerio vs Puppeteer
  
  // Activo
  enabled: boolean;
  
  // Metadata
  ultimoScraping?: Date;
  ultimoExito?: Date;
  intentosFallidos: number;
}
```

**Estructura de Producto en BD:**
```typescript
interface ProductoBD {
  id: string;
  
  // Entidad
  entidadNombre: string;
  entidadLogo: string;
  entidadTipo: 'banco' | 'fintech' | 'cooperativa';
  urlSolicitud: string;
  urlFuente: string; // URL de donde se extrajo
  
  // Producto
  tipo: 'libre-inversion' | 'compra-cartera';
  nombre: string;
  descripcion: string;
  
  // Condiciones (extraídas por scraping)
  montoMinimo: number;
  montoMaximo: number;
  plazoMinimo: number;
  plazoMaximo: number;
  
  // Tasas y costos (extraídas por scraping)
  tasaMensual: number;
  tasaEfectivaAnual: number;
  seguroVida: number;
  comisionDesembolso?: number;
  
  // Elegibilidad (extraídas por scraping o default)
  ingresoMinimo: number;
  edadMinima: number;
  edadMaxima: number;
  tiposEmpleoPermitidos: string[];
  
  // Info adicional (extraída por scraping)
  tiempoAprobacion: string;
  requisitos: string[];
  ventajas: string[];
  
  // Metadata de scraping
  fuenteDatos: 'scraping' | 'manual';
  fechaUltimoScraping: Date;
  fechaActualizacion: Date;
  cambiosDetectados: string[]; // Log de qué cambió
  
  // Estado
  activo: boolean;
  scrapingEnabled: boolean;
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}
```

**Validación de Datos Extraídos:**
```typescript
interface ValidationRules {
  tasaMensual: {
    min: 0.5,  // 0.5% MV mínimo
    max: 5.0   // 5% MV máximo (usura)
  };
  montoMinimo: {
    min: 500000,
    max: 5000000
  };
  plazoMinimo: {
    min: 6,
    max: 24
  };
  plazoMaximo: {
    min: 12,
    max: 120
  };
}
```

**Manejo de Errores:**
- **Error 404:** Marcar URL como inválida, notificar
- **Cambio de estructura:** Intentar selectores alternativos, luego notificar
- **Timeout:** Reintentar 3 veces con backoff exponencial
- **Datos inválidos:** Mantener datos anteriores, loguear warning
- **Bloqueo anti-bot:** Usar rotación de user-agents, delays aleatorios

**Endpoints de Monitoreo:**
- `GET /api/v1/admin/scraping/status` - Estado del scraping
- `GET /api/v1/admin/scraping/logs` - Logs de ejecuciones
- `POST /api/v1/admin/scraping/run` - Ejecutar manualmente
- `GET /api/v1/admin/scraping/config` - Ver configuraciones

**Indicador en UI:**
```tsx
<div className="text-sm text-gray-600">
  📅 Tasas actualizadas: {formatDate(producto.fechaActualizacion)}
  {producto.fuenteDatos === 'scraping' && (
    <Badge>🤖 Actualización automática</Badge>
  )}
</div>
```

---

## 4. REQUERIMIENTOS NO FUNCIONALES - MVP

### RNF-001: Performance
- **Tiempo de carga inicial:** < 3 segundos
- **Tiempo de comparación:** < 2 segundos
- **Tiempo de simulación:** < 500ms (cambios en sliders)
- **Optimización de imágenes:** WebP, lazy loading, logos comprimidos
- **Caché:** LocalStorage para datos estáticos
- **Sin CDN en MVP:** Hosting gratuito/económico (Vercel, Netlify, Railway)

### RNF-002: Escalabilidad (Preparada para Futuro)
- **Usuarios concurrentes MVP:** 100-500 usuarios simultáneos
- **Base de datos:** PostgreSQL con índices básicos optimizados
- **Arquitectura:** Monolito modular, fácil de migrar a microservicios
- **Sin Redis en MVP:** Caché en memoria o sin caché

### RNF-003: Disponibilidad
- **Uptime MVP:** 95% (hosting gratuito puede tener limitaciones)
- **Backup:** Manual semanal de BD en MVP
- **Monitoreo:** Básico con logs de aplicación

### RNF-004: Seguridad Básica
- **Encriptación:** HTTPS obligatorio (Let's Encrypt gratuito)
- **Rate limiting:** Básico a nivel de servidor (10 requests/minuto)
- **Validación:** Input sanitization en frontend y backend
- **Sin autenticación en MVP:** No hay usuarios registrados
- **OWASP:** Protección básica contra XSS, SQL injection

### RNF-005: Usabilidad
- **Mobile first:** Diseño responsive desde 320px
- **Accesibilidad:** Básica (contraste, alt text en imágenes)
- **Tiempo de uso:** Usuario completa comparación en < 3 minutos
- **Tasa de abandono objetivo:** < 50% en formulario
- **Lenguaje:** Simple y claro, sin tecnicismos

### RNF-006: Compatibilidad
- **Navegadores:** Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Dispositivos:** Mobile (prioridad), tablet, desktop
- **Resoluciones:** 320px - 1920px

### RNF-007: Mantenibilidad
- **Código:** TypeScript, ESLint, Prettier
- **Testing:** Mínimo en MVP (tests críticos solamente)
- **Documentación:** README con instrucciones de setup
- **Logs:** Console.log básico en MVP
- **Versionamiento:** Git con commits descriptivos

### RNF-008: Hosting y Despliegue (Gratis/Económico)
**Opciones Recomendadas:**

**Frontend:**
- ✅ **Vercel** (Gratis) - Recomendado para React/Next.js
- ✅ **Netlify** (Gratis) - Alternativa excelente
- ✅ **GitHub Pages** (Gratis) - Para sitios estáticos

**Backend:**
- ✅ **Railway** (Gratis inicial) - Node.js + PostgreSQL
- ✅ **Render** (Gratis) - Node.js + PostgreSQL
- ✅ **Fly.io** (Gratis) - Alternativa
- ⚠️ **Heroku** (Ya no tiene plan gratuito)

**Base de Datos:**
- ✅ **Railway PostgreSQL** (Gratis 500MB)
- ✅ **Render PostgreSQL** (Gratis 1GB)
- ✅ **Supabase** (Gratis 500MB)
- ✅ **ElephantSQL** (Gratis 20MB - suficiente para MVP)

**Configuración Recomendada MVP:**
```
Frontend: Vercel (Gratis, ilimitado)
Backend: Railway (Gratis hasta $5/mes de uso)
Database: Railway PostgreSQL (Gratis 500MB)
Domain: Subdominio gratuito de Vercel/Railway
SSL: Automático (Let's Encrypt)
```

**Costos Estimados MVP:**
- Hosting: $0/mes (planes gratuitos)
- Dominio personalizado (opcional): $10-15/año
- **Total: $0-15/año** 🎉

### RNF-009: SEO y Analytics (Básico)
- **SEO:** Meta tags básicos, sitemap.xml
- **Analytics:** Google Analytics 4 (gratuito)
- **Sin tracking avanzado en MVP**

---

## 5. HISTORIAS DE USUARIO - MVP

### HU-001: Comparar ofertas de crédito de libre inversión
**Como** usuario que necesita dinero  
**Quiero** comparar ofertas de crédito de diferentes bancos sin registrarme  
**Para** elegir la opción más económica para mí

**Criterios:**
- Puedo ingresar cuánto necesito y en cuánto tiempo
- Veo las 5 mejores ofertas automáticamente
- Puedo ver claramente cuánto pagaré en total
- Entiendo cuál es la mejor opción
- Puedo ir directamente al sitio del banco a solicitar

**Prioridad:** Crítica

---

### HU-002: Consolidar mis deudas en un solo crédito
**Como** usuario con múltiples deudas  
**Quiero** ver si puedo consolidarlas en un solo crédito más barato  
**Para** pagar menos cada mes y salir más rápido de deudas

**Criterios:**
- Puedo ingresar mis deudas actuales y cuota mensual
- El sistema me muestra cuánto ahorraría
- Veo las 5 mejores opciones
- Puedo ir al sitio del banco a solicitar

**Prioridad:** Crítica

---

### HU-003: Simular diferentes escenarios
**Como** usuario indeciso  
**Quiero** simular diferentes montos y plazos en tiempo real  
**Para** entender qué me conviene más según mi capacidad de pago

**Criterios:**
- Cambio monto y plazo fácilmente con sliders
- Los resultados se actualizan al instante
- Veo cómo cambia mi cuota mensual
- Veo el % de mis ingresos que representa

**Prioridad:** Alta

---

### HU-004: Ver detalles de una oferta
**Como** usuario interesado en una oferta  
**Quiero** ver todos los detalles, costos y requisitos  
**Para** tomar una decisión informada

**Criterios:**
- Veo desglose completo de costos
- Veo requisitos necesarios
- Veo tiempo estimado de aprobación
- Puedo acceder fácilmente al sitio del banco

**Prioridad:** Alta

---

### HU-005: Usar desde mi celular
**Como** usuario que navega desde mi celular  
**Quiero** que la aplicación funcione perfectamente en móvil  
**Para** comparar ofertas desde cualquier lugar

**Criterios:**
- Todo funciona perfectamente en pantalla pequeña
- Los sliders son fáciles de usar
- Las cards se ven completas
- El sitio carga rápido

**Prioridad:** Crítica (mobile first)

---

## 6. MÉTRICAS DE ÉXITO - MVP

### Métricas de Usuario
- **Tráfico:** 500-1,000 visitantes/mes en primer trimestre
- **Conversión a comparación:** 60% de visitantes completa formulario
- **Clics a entidades:** 20% de usuarios hace clic en "Solicitar"
- **Tiempo en sitio:** > 3 minutos promedio
- **Tasa de rebote:** < 60%
- **Usuarios móviles:** > 50%

### Métricas Técnicas
- **Uptime:** > 95%
- **Tiempo de respuesta:** < 2 segundos para comparación
- **Errores:** < 5% error rate
- **Tiempo de carga:** < 3 segundos

### Métricas de Contenido
- **Productos activos:** Mínimo 10 productos de 5-8 entidades
- **Actualización:** Revisión mensual de tasas
- **Cobertura:** Bancos, fintech y cooperativas

---

## 7. RESTRICCIONES Y SUPUESTOS - MVP

### Restricciones MVP
1. **Presupuesto:** $0 (hosting gratuito)
2. **Tiempo:** MVP en 1-2 meses
3. **Equipo:** 1 desarrollador fullstack
4. **Datos:** Ingreso manual de productos (sin integraciones)
5. **Funcionalidad:** Solo comparación (sin solicitud de créditos)

### Supuestos MVP
1. Usuarios buscan información antes de decidir
2. Usuarios están dispuestos a visitar el sitio del banco
3. Datos de productos se actualizan manualmente (mensual)
4. No se requieren integraciones con entidades en MVP
5. El tráfico inicial será bajo (< 1,000 usuarios/mes)

---

## 8. ROADMAP SIMPLIFICADO

### Fase 1: MVP Básico (Mes 1-2) ✅ ALCANCE ACTUAL
- ✅ Formulario de comparación (libre inversión + compra cartera)
- ✅ Motor de comparación con ranking
- ✅ Visualización de 5 mejores ofertas
- ✅ Simulador en tiempo real
- ✅ 10 productos de 5-8 entidades
- ✅ Diseño responsive mobile-first
- ✅ Deploy en hosting gratuito

**Entregables:**
- Web funcional y pública
- Catálogo inicial de productos
- README con documentación

### Fase 2: Mejoras y Contenido (Mes 3-4)
- 📋 Agregar más productos y entidades (20+ productos)
- 📋 Sistema de actualización más eficiente (scripts)
- 📋 Página de detalle por oferta
- 📋 Comparación lado a lado
- 📋 Blog con contenido educativo
- 📋 FAQs y calculadoras adicionales
- 📋 SEO optimization
- 📋 Google Analytics integrado

### Fase 3: Sistema de Leads (Mes 5-6)
- 📋 Formulario de solicitud de crédito
- 📋 Captura y almacenamiento de leads
- 📋 Email confirmación a usuario
- 📋 Envío a entidad por email
- 📋 Tracking de conversión
- 📋 CPC tracking para monetización

### Fase 4: Dashboard B2B (Mes 7-12)
- 📋 Panel para entidades financieras
- 📋 Gestión de leads recibidos
- 📋 Métricas y reportes
- 📋 Webhooks de integración
- 📋 Modelo de monetización completo (CPL/CPA)

### Fase 5: Expansión (Año 2)
- 📋 App móvil nativa
- 📋 Web scraping automático
- 📋 Integración con centrales de riesgo
- 📋 Pre-aprobación en línea
- 📋 Más tipos de productos (vehículo, hipotecario)
- 📋 Expansión regional

---

## 9. GLOSARIO

- **TEA:** Tasa Efectiva Anual
- **MV:** Mes Vencido
- **Score:** Puntaje crediticio (0-999)
- **Lead:** Cliente potencial con datos de contacto
- **CPC:** Costo Por Clic
- **CPL:** Costo Por Lead
- **CPA:** Costo Por Adquisición
- **Compra de cartera:** Consolidación de deudas en un nuevo crédito

---

**Documento creado por:** Sistema SDD  
**Próximo documento:** 02-arquitectura-sistema.md
