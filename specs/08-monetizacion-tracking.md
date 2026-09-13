# Estrategia de Monetización y Tracking
## Plataforma de Comparación Financiera - MVP

**Proyecto:** Comparador de Productos Financieros  
**Versión:** 1.0 - MVP Simplificado  
**Fecha:** Septiembre 2026  

---

## 1. VISIÓN GENERAL

### 1.1 Filosofía de Monetización

**Fase MVP (Mes 1-3):**
- **Enfoque:** Construcción de tráfico y marca
- **Monetización:** Preparación para CPC (Costo Por Clic)
- **Prioridad:** Experiencia de usuario y datos de calidad

**Fase 2 (Mes 4-6):**
- **Activación:** CPC con entidades interesadas
- **Objetivo:** $200-500 USD/mes

**Fase 3 (Mes 7-12):**
- **Expansión:** CPL (Costo Por Lead) + CPC
- **Objetivo:** $1,000-2,000 USD/mes

**Fase 4 (Año 2+):**
- **Madurez:** CPA (Costo Por Adquisición) + SaaS
- **Objetivo:** $5,000+ USD/mes

---

## 2. MODELOS DE MONETIZACIÓN

### 2.1 CPC - Costo Por Clic (Fase 2 - Corto Plazo)

**Concepto:**
Las entidades financieras pagan cada vez que un usuario hace clic en el botón "Solicitar" de su oferta.

**Implementación:**

```typescript
// Tracking de clic
interface ClicTracking {
  id: string;
  sessionId: string;
  usuarioId?: string; // Si está registrado (futuro)
  
  // Oferta clickeada
  productoId: string;
  entidadId: string;
  posicionEnResultados: number; // 1-5
  
  // Contexto de la búsqueda
  montoSolicitado: number;
  plazoMeses: number;
  tipoProducto: string;
  
  // Valor del clic
  costoClic: number; // $3,000 - $10,000 COP
  
  // Metadata
  fecha: Date;
  origen: string; // utm_source
  dispositivo: string;
  navegador: string;
  
  // Seguimiento
  redireccionExitosa: boolean;
  urlDestino: string;
}
```

**Endpoint:**
```typescript
POST /api/v1/tracking/clic

Request:
{
  "productoId": "prod_abc123",
  "sessionId": "sess_xyz789",
  "posicion": 1
}

Response:
{
  "success": true,
  "data": {
    "clicId": "clic_abc123",
    "urlRedirect": "https://bancolombia.com/credito?ref=comparador",
    "costoClic": 5000
  }
}

// Frontend abre en nueva pestaña
window.open(response.data.urlRedirect, '_blank');
```

**Tarifas Sugeridas:**

| Posición | Costo/Clic | Razón |
|----------|------------|-------|
| #1 (Mejor) | $10,000 | Mayor visibilidad |
| #2 | $7,000 | Segunda opción |
| #3 | $5,000 | Tercera opción |
| #4-5 | $3,000 | Menor visibilidad |

**Proyección Financiera CPC:**

```
Escenario Conservador (Mes 4-6):
- Visitantes/mes: 1,000
- % que compara: 60% = 600
- % que hace clic: 20% = 120 clics
- Clic promedio: $6,000
- Ingreso mensual: $720,000 COP (~$180 USD)

Escenario Optimista (Mes 7-12):
- Visitantes/mes: 5,000
- Clics/mes: 600
- Clic promedio: $7,000
- Ingreso mensual: $4,200,000 COP (~$1,050 USD)
```

---

### 2.2 CPL - Costo Por Lead (Fase 3 - Mediano Plazo)

**Concepto:**
Las entidades pagan cuando reciben un lead completo (usuario que llena formulario de solicitud).

**Implementación (Post-MVP):**

```typescript
interface Lead {
  id: string;
  codigo: string; // LD-2026-001234
  
  // Usuario
  nombres: string;
  email: string;
  telefono: string;
  // ... datos completos
  
  // Oferta elegida
  productoId: string;
  entidadId: string;
  
  // Valor del lead
  costoLead: number; // $20,000 - $100,000 COP
  
  // Estado
  estado: 'nuevo' | 'enviado' | 'contactado' | 'aprobado';
  fechaCreacion: Date;
}
```

**Tarifas Sugeridas:**

| Tipo Producto | Costo/Lead | Calidad |
|---------------|------------|---------|
| Libre Inversión | $30,000 | Básica |
| Compra Cartera | $50,000 | Alta (más valor) |
| Crédito Hipotecario | $100,000 | Premium |

**Proyección CPL:**

```
Escenario (Mes 7-12):
- Comparaciones/mes: 3,000
- % que solicita: 10% = 300 leads
- Lead promedio: $40,000
- Ingreso mensual: $12,000,000 COP (~$3,000 USD)
```

---

### 2.3 CPA - Costo Por Adquisición (Fase 4 - Largo Plazo)

**Concepto:**
La plataforma recibe comisión cuando el crédito es aprobado y desembolsado.

**Implementación:**

```typescript
interface Conversion {
  leadId: string;
  
  // Crédito aprobado
  montoDesembolsado: number;
  fechaDesembolso: Date;
  
  // Comisión
  porcentajeComision: number; // 0.5% - 2%
  comision: number; // COP
  
  // Confirmación
  confirmadoPorEntidad: boolean;
  fechaConfirmacion: Date;
}
```

**Tarifas:**

| Monto Crédito | Comisión | Ejemplo |
|---------------|----------|---------|
| $1M - $10M | 1.5% | $150,000 |
| $10M - $50M | 1.0% | $300,000 |
| $50M+ | 0.5% | $250,000 |

**Requiere:**
- Integración profunda con entidades
- Sistema de tracking post-solicitud
- Acuerdos comerciales formales
- Facturación y reconciliación

---

### 2.4 Productos Patrocinados (Fase 2+)

**Concepto:**
Entidades pagan por destacar su producto en resultados.

**Implementación:**

```typescript
interface ProductoPatrocinado {
  productoId: string;
  
  // Configuración
  activo: boolean;
  posicionPreferente: boolean; // Aparecer siempre en top 3
  badge: 'Patrocinado' | 'Destacado';
  
  // Costo
  costoDiario: number; // $50,000 - $200,000 COP/día
  presupuestoMensual: number;
  presupuestoRestante: number;
  
  // Periodo
  fechaInicio: Date;
  fechaFin: Date;
}
```

**UI:**

```
╔════════════════════════════════════╗
║  🥇 #1 - MEJOR OPCIÓN              ║
║  [Badge: Patrocinado]              ║
║  ─────────────────────────────     ║
║  FINTECH RÁPIDA                    ║
║  ...                               ║
╚════════════════════════════════════╝
```

**Tarifas:**

| Destacado | Costo/Día | Costo/Mes |
|-----------|-----------|-----------|
| Badge | $30,000 | $900,000 |
| Top 3 | $100,000 | $3,000,000 |
| Top 1 | $200,000 | $6,000,000 |

---

### 2.5 SaaS - Analytics para Entidades (Fase 4)

**Concepto:**
Suscripción mensual para que entidades accedan a dashboard con insights.

**Features:**

```typescript
interface DashboardEntidad {
  // Métricas propias
  impresiones: number;
  clics: number;
  ctr: number; // Click-through rate
  posicionPromedio: number;
  
  // Inteligencia competitiva
  comparativoMercado: {
    tuTasa: number;
    tasaPromedio: number;
    mejorTasa: number;
    tuPosicionRanking: number;
  };
  
  // Demanda del mercado
  busquedasPorMonto: Record<string, number>;
  busquedasPorPlazo: Record<string, number>;
  tendencias: TrendData[];
  
  // Recomendaciones
  sugerenciasMejora: string[];
}
```

**Planes:**

| Plan | Precio/Mes | Features |
|------|------------|----------|
| Básico | $500,000 COP | Métricas propias |
| Pro | $1,500,000 COP | + Competencia |
| Enterprise | $3,000,000 COP | + API, Custom |

---

## 3. SISTEMA DE TRACKING

### 3.1 Google Analytics 4

**Eventos Principales:**

```typescript
// Configuración GA4
const GA_MEASUREMENT_ID = 'G-XXXXXXXXXX';

// Eventos personalizados
interface GAEvent {
  event_name: string;
  event_params: Record<string, any>;
}

// Catálogo de eventos
const EVENTOS = {
  // Landing
  page_view: {
    page_location: string;
    page_title: string;
  },
  
  // Formulario
  form_start: {
    tipo_producto: string;
  },
  
  form_complete: {
    tipo_producto: string;
    monto: number;
    plazo: number;
    tiempo_segundos: number;
  },
  
  // Resultados
  results_view: {
    tipo_producto: string;
    ofertas_encontradas: number;
    mejor_tasa: number;
  },
  
  offer_view: {
    producto_id: string;
    entidad: string;
    posicion: number;
  },
  
  offer_click: {
    producto_id: string;
    entidad: string;
    posicion: number;
    costo_clic: number;
  },
  
  // Detalle
  detail_view: {
    producto_id: string;
    entidad: string;
  },
  
  // Simulador
  simulation_adjust: {
    monto_anterior: number;
    monto_nuevo: number;
    plazo_anterior: number;
    plazo_nuevo: number;
  }
};
```

**Implementación:**

```tsx
// hooks/useAnalytics.ts
import ReactGA from 'react-ga4';

export const useAnalytics = () => {
  const trackEvent = (eventName: string, params: Record<string, any>) => {
    ReactGA.event({
      category: params.category || 'General',
      action: eventName,
      label: params.label,
      value: params.value,
      ...params
    });
  };
  
  return { trackEvent };
};

// Uso en componentes
const { trackEvent } = useAnalytics();

const handleComparar = async () => {
  // Track inicio
  trackEvent('form_complete', {
    tipo_producto: 'libre-inversion',
    monto: 30000000,
    plazo: 36,
    tiempo_segundos: 45
  });
  
  // Ejecutar comparación
  const ofertas = await compararOfertas();
  
  // Track resultados
  trackEvent('results_view', {
    ofertas_encontradas: ofertas.length,
    mejor_tasa: ofertas[0].tasaMensual
  });
};

const handleClic = (oferta: Oferta, posicion: number) => {
  // Track clic (para monetización)
  trackEvent('offer_click', {
    producto_id: oferta.id,
    entidad: oferta.entidad.nombre,
    posicion,
    costo_clic: oferta.costoPorClic
  });
  
  // Abrir sitio entidad
  window.open(oferta.urlSolicitud, '_blank');
};
```

---

### 3.2 Tracking Interno

**Base de Datos:**

```prisma
// Tabla de eventos
model EventoTracking {
  id              String   @id @default(uuid())
  
  // Session
  sessionId       String
  usuarioId       String?  // Si está registrado (futuro)
  
  // Evento
  tipoEvento      String   // form_complete, offer_click, etc.
  categoria       String
  accion          String
  
  // Metadata (JSON flexible)
  metadata        Json
  
  // Contexto
  url             String
  dispositivo     String
  navegador       String
  
  // Origen
  utmSource       String?
  utmMedium       String?
  utmCampaign     String?
  
  // Timestamp
  fecha           DateTime @default(now())
  
  @@index([sessionId, fecha])
  @@index([tipoEvento, fecha])
  @@map("eventos_tracking")
}

// Tabla de clics (monetización)
model ClicTracking {
  id                  String   @id @default(uuid())
  
  sessionId           String
  productoId          String
  entidadId           String
  
  posicion            Int
  montoSolicitado     Decimal
  plazoMeses          Int
  
  costoClic           Decimal
  
  redireccionExitosa  Boolean
  urlDestino          String
  
  fecha               DateTime @default(now())
  
  producto            Producto @relation(fields: [productoId], references: [id])
  
  @@index([productoId, fecha])
  @@index([entidadId, fecha])
  @@map("clics_tracking")
}
```

**API de Tracking:**

```typescript
// POST /api/v1/tracking/evento
export const trackEvento = async (req: Request, res: Response) => {
  const { 
    tipoEvento, 
    categoria, 
    accion, 
    metadata 
  } = req.body;
  
  const sessionId = req.cookies.sessionId || generateSessionId();
  
  await prisma.eventoTracking.create({
    data: {
      sessionId,
      tipoEvento,
      categoria,
      accion,
      metadata,
      url: req.headers.referer || '',
      dispositivo: detectDevice(req.headers['user-agent']),
      navegador: detectBrowser(req.headers['user-agent']),
      utmSource: req.query.utm_source as string,
      utmMedium: req.query.utm_medium as string,
      utmCampaign: req.query.utm_campaign as string
    }
  });
  
  res.json({ success: true });
};

// POST /api/v1/tracking/clic
export const trackClic = async (req: Request, res: Response) => {
  const { productoId, posicion } = req.body;
  const sessionId = req.cookies.sessionId;
  
  // Obtener producto y entidad
  const producto = await prisma.producto.findUnique({
    where: { id: productoId },
    include: { entidad: true }
  });
  
  if (!producto) {
    return res.status(404).json({ error: 'Producto no encontrado' });
  }
  
  // Registrar clic
  const clic = await prisma.clicTracking.create({
    data: {
      sessionId,
      productoId,
      entidadId: producto.entidadId,
      posicion,
      montoSolicitado: req.body.montoSolicitado,
      plazoMeses: req.body.plazoMeses,
      costoClic: producto.costoPorClic,
      redireccionExitosa: true,
      urlDestino: producto.urlSolicitud
    }
  });
  
  // Retornar URL para redirección
  res.json({
    success: true,
    data: {
      clicId: clic.id,
      urlRedirect: producto.urlSolicitud,
      costoClic: producto.costoPorClic
    }
  });
};
```

---

### 3.3 UTM Parameters

**Estructura de URLs:**

```
Landing desde Google Ads:
https://comparador.com?utm_source=google&utm_medium=cpc&utm_campaign=credito-julio-2026

Landing desde Facebook:
https://comparador.com?utm_source=facebook&utm_medium=social&utm_campaign=compra-cartera

Redirección a entidad:
https://bancolombia.com/credito?ref=comparador&sid=sess_abc123
```

**Tracking en toda la sesión:**

```typescript
// Capturar UTM al entrar
const captureUTMParams = () => {
  const params = new URLSearchParams(window.location.search);
  
  const utmData = {
    source: params.get('utm_source'),
    medium: params.get('utm_medium'),
    campaign: params.get('utm_campaign'),
    content: params.get('utm_content'),
    term: params.get('utm_term')
  };
  
  // Guardar en localStorage para toda la sesión
  localStorage.setItem('utm_params', JSON.stringify(utmData));
  
  return utmData;
};

// Incluir en todos los eventos
const getUTMData = () => {
  const stored = localStorage.getItem('utm_params');
  return stored ? JSON.parse(stored) : {};
};
```

---

## 4. MÉTRICAS Y KPIs

### 4.1 Métricas de Tráfico

```typescript
interface MetricasTrafic {
  // Visitantes
  visitantesUnicos: number;
  visitasTotales: number;
  paginasVistas: number;
  
  // Engagement
  tiempoPromedioSitio: number; // segundos
  tasaRebote: number; // %
  paginasPromedioSesion: number;
  
  // Dispositivos
  porcentajeMobile: number;
  porcentajeDesktop: number;
  porcentajeTablet: number;
  
  // Navegadores
  distribuccionNavegadores: Record<string, number>;
  
  // Fuentes
  traficoOrganico: number;
  traficoPago: number;
  traficoDirecto: number;
  traficoReferral: number;
}
```

**Dashboard Query:**

```typescript
const getMetricasTrafic = async (fechaInicio: Date, fechaFin: Date) => {
  const eventos = await prisma.eventoTracking.findMany({
    where: {
      fecha: { gte: fechaInicio, lte: fechaFin }
    }
  });
  
  const visitantesUnicos = new Set(eventos.map(e => e.sessionId)).size;
  
  const tiempoPromedio = eventos
    .filter(e => e.tipoEvento === 'session_end')
    .reduce((sum, e) => sum + (e.metadata.duracion || 0), 0) / visitantesUnicos;
  
  return {
    visitantesUnicos,
    visitasTotales: eventos.filter(e => e.tipoEvento === 'page_view').length,
    tiempoPromedioSitio: tiempoPromedio,
    // ... más cálculos
  };
};
```

---

### 4.2 Métricas de Conversión

```typescript
interface MetricasConversion {
  // Funnel
  visitantes: number;
  iniciaronFormulario: number;
  completaronFormulario: number;
  vieronResultados: number;
  hicieronClic: number;
  
  // Tasas de conversión
  tasaFormulario: number; // % que completa formulario
  tasaClic: number; // % que hace clic en oferta
  tasaConversionGlobal: number; // visitantes → clic
  
  // Por producto
  clicsPorProducto: Record<string, number>;
  clicsPorEntidad: Record<string, number>;
  
  // Tiempo
  tiempoPromedioFormulario: number;
  tiempoPromedioDecision: number;
}
```

**Funnel de Conversión:**

```
1000 Visitantes
  ↓ 60%
600 Inician formulario
  ↓ 80%
480 Completan formulario
  ↓ 100%
480 Ven resultados
  ↓ 25%
120 Hacen clic en oferta

Conversión global: 12%
```

---

### 4.3 Métricas de Monetización

```typescript
interface MetricasMonetizacion {
  // CPC
  totalClics: number;
  ingresoCPC: number; // COP
  clicPromedio: number; // COP
  
  // Por entidad
  ingresoPorEntidad: Record<string, number>;
  clicsPorEntidad: Record<string, number>;
  
  // Proyecciones
  ingresoProyectadoMes: number;
  clicsProyectadosMes: number;
  
  // CPM efectivo
  cpmEfectivo: number; // Costo por mil visitantes
}
```

**Query Dashboard:**

```typescript
const getMetricasMonetizacion = async (mes: number, año: number) => {
  const clics = await prisma.clicTracking.findMany({
    where: {
      fecha: {
        gte: new Date(año, mes - 1, 1),
        lt: new Date(año, mes, 1)
      }
    },
    include: {
      producto: {
        include: {
          entidad: true
        }
      }
    }
  });
  
  const totalClics = clics.length;
  const ingresoCPC = clics.reduce((sum, c) => sum + Number(c.costoClic), 0);
  
  const porEntidad = clics.reduce((acc, clic) => {
    const entidad = clic.producto.entidad.nombre;
    acc[entidad] = (acc[entidad] || 0) + Number(clic.costoClic);
    return acc;
  }, {} as Record<string, number>);
  
  return {
    totalClics,
    ingresoCPC,
    clicPromedio: ingresoCPC / totalClics,
    ingresoPorEntidad: porEntidad
  };
};
```

---

### 4.4 Métricas de Producto

```typescript
interface MetricasProducto {
  // Por producto
  impresiones: number; // Veces que apareció en resultados
  clics: number;
  ctr: number; // Click-through rate
  posicionPromedio: number;
  
  // Comparación
  vecesEnTop1: number;
  vecesEnTop3: number;
  vecesEnTop5: number;
  
  // Simulaciones
  vecesSimulado: number;
}
```

---

## 5. DASHBOARD DE ANALYTICS

### 5.1 Vista Principal

```
╔════════════════════════════════════════════════╗
║        DASHBOARD ANALYTICS                     ║
╠════════════════════════════════════════════════╣
║                                                ║
║  📊 RESUMEN (Últimos 30 días)                 ║
║                                                ║
║  ┌────────────┬────────────┬────────────┐     ║
║  │ Visitantes │   Clics    │  Ingresos  │     ║
║  │   2,450    │    310     │ $1,860,000 │     ║
║  │   ↑ 15%   │   ↑ 22%    │   ↑ 18%    │     ║
║  └────────────┴────────────┴────────────┘     ║
║                                                ║
║  ──────────────────────────────────────────   ║
║                                                ║
║  📈 TRÁFICO                                   ║
║  [Gráfico de línea - últimos 30 días]        ║
║                                                ║
║  ──────────────────────────────────────────   ║
║                                                ║
║  💰 INGRESOS POR ENTIDAD                      ║
║  Bancolombia:    $620,000 (33%)               ║
║  Fintech Rápida: $558,000 (30%)               ║
║  Davivienda:     $434,000 (23%)               ║
║  Otros:          $248,000 (14%)               ║
║                                                ║
║  ──────────────────────────────────────────   ║
║                                                ║
║  🏆 TOP PRODUCTOS                             ║
║  1. Crédito Digital - Fintech (93 clics)     ║
║  2. Libre Inversión - Banco A (78 clics)     ║
║  3. Compra Cartera - Banco B (62 clics)      ║
║                                                ║
╚════════════════════════════════════════════════╝
```

---

### 5.2 Implementación del Dashboard

```tsx
// pages/admin/Analytics.tsx
const AnalyticsDashboard = () => {
  const [periodo, setPeriodo] = useState('30d');
  const [metricas, setMetricas] = useState<Metricas | null>(null);
  
  useEffect(() => {
    const fetchMetricas = async () => {
      const response = await fetch(`/api/v1/analytics/resumen?periodo=${periodo}`);
      const data = await response.json();
      setMetricas(data);
    };
    
    fetchMetricas();
  }, [periodo]);
  
  if (!metricas) return <Loading />;
  
  return (
    <DashboardLayout>
      <Header>
        <Title>Analytics</Title>
        <PeriodoSelector value={periodo} onChange={setPeriodo} />
      </Header>
      
      <MetricasGrid>
        <MetricCard
          title="Visitantes"
          value={metricas.visitantes}
          change={metricas.cambioVisitantes}
          icon="👥"
        />
        <MetricCard
          title="Clics"
          value={metricas.clics}
          change={metricas.cambioClics}
          icon="👆"
        />
        <MetricCard
          title="Ingresos"
          value={formatCurrency(metricas.ingresos)}
          change={metricas.cambioIngresos}
          icon="💰"
        />
      </MetricasGrid>
      
      <ChartSection>
        <ChartTitle>Tráfico</ChartTitle>
        <LineChart data={metricas.traficoHistorico} />
      </ChartSection>
      
      <IngresosPorEntidad data={metricas.ingres osPorEntidad} />
      
      <TopProductos productos={metricas.topProductos} />
    </DashboardLayout>
  );
};
```

---

## 6. PRÓXIMOS PASOS

✅ **Completado:** Estrategia de monetización y tracking  
📋 **Siguiente:** Requisitos de seguridad y compliance

**Documento creado por:** Sistema SDD  
**Próximo documento:** 09-seguridad-compliance.md
