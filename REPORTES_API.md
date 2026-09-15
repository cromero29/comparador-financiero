# 📊 API de Reportes y Analytics

Sistema completo de reportes para visualizar datos de búsquedas, clics y comportamiento de usuarios.

## 🔗 Endpoints Disponibles

### Base URL
```
http://localhost:4000/api/v1/reportes
```

---

## 1. Resumen General

**Endpoint:** `GET /api/v1/reportes/resumen`

**Descripción:** Vista general de toda la actividad en el periodo especificado.

**Query Parameters:**
- `dias` (opcional): Número de días hacia atrás. Default: 30

**Ejemplo:**
```bash
GET http://localhost:4000/api/v1/reportes/resumen?dias=7
```

**Respuesta:**
```json
{
  "success": true,
  "data": {
    "periodo": {
      "dias": 30,
      "desde": "2026-08-16T01:55:21.694Z",
      "hasta": "2026-09-15T01:55:21.774Z"
    },
    "actividad": {
      "sesiones": 20,
      "busquedas": 14,
      "clics": 3,
      "eventos": 40
    },
    "conversion": {
      "busquedasConClics": 6,
      "tasaConversion": "42.86%",
      "clicsPorBusqueda": "0.21"
    },
    "promedios": {
      "monto": "$16.428.571",
      "edad": "48 años",
      "ingresos": "$4.964.286"
    },
    "tiposProducto": {
      "libreInversion": 14,
      "compraCartera": 0
    },
    "tiposEmpleo": {
      "dependiente": 2,
      "independiente": 9,
      "pensionado": 3
    }
  }
}
```

---

## 2. Búsquedas Detalladas

**Endpoint:** `GET /api/v1/reportes/busquedas-detalle`

**Descripción:** Listado detallado de todas las búsquedas con contexto completo.

**Query Parameters:**
- `dias` (opcional): Número de días hacia atrás. Default: 30
- `limite` (opcional): Número máximo de registros. Default: 100

**Ejemplo:**
```bash
GET http://localhost:4000/api/v1/reportes/busquedas-detalle?dias=7&limite=50
```

**Respuesta:**
```json
{
  "success": true,
  "data": {
    "total": 14,
    "busquedas": [
      {
        "id": "uuid",
        "fecha": "2026-09-14T20:30:00.000Z",
        "parametros": {
          "tipoProducto": "LIBRE_INVERSION",
          "monto": "$10.000.000",
          "plazo": "24 meses",
          "edad": "35 años",
          "ingresos": "$5.000.000",
          "tipoEmpleo": "dependiente"
        },
        "resultados": {
          "ofertasEncontradas": 10,
          "mejorTasa": "18.19%",
          "mejorCuota": "$450.000"
        },
        "engagement": {
          "tiempoEnResultados": "120s",
          "ofertasExpandidas": 3
        },
        "conversion": {
          "generoClic": true,
          "clicsGenerados": 1
        },
        "contexto": {
          "dispositivo": "mobile",
          "navegador": "chrome",
          "ubicacion": "Bogotá, Colombia",
          "origen": "google"
        }
      }
    ]
  }
}
```

**Casos de Uso:**
- Exportar a Excel para análisis detallado
- Identificar patrones de búsqueda
- Segmentar por origen de tráfico (UTM)
- Analizar engagement por dispositivo

---

## 3. Clics por Entidad

**Endpoint:** `GET /api/v1/reportes/clics-por-entidad`

**Descripción:** Clics agrupados por banco/fintech con métricas detalladas.

**Query Parameters:**
- `dias` (opcional): Número de días hacia atrás. Default: 30

**Ejemplo:**
```bash
GET http://localhost:4000/api/v1/reportes/clics-por-entidad?dias=30
```

**Respuesta:**
```json
{
  "success": true,
  "data": {
    "periodo": {
      "dias": 30,
      "desde": "2026-08-16T01:55:28.424Z",
      "hasta": "2026-09-15T01:55:28.441Z"
    },
    "totalClics": 3,
    "entidades": [
      {
        "entidad": "Bancolombia",
        "tipo": "BANCO",
        "totalClics": 2,
        "clicsPorPosicion": {
          "1": 0,
          "2": 1,
          "3": 0,
          "8": 1
        },
        "promedios": {
          "tasa": "23.87%",
          "cuota": "$787.500",
          "monto": "$17.500.000",
          "ingresos": "$8.000.000",
          "edad": "45 años"
        },
        "posicionMasClickeada": "2"
      }
    ]
  }
}
```

**Valor para Bancos:**
- Ver cuántos clics reciben vs competencia
- Identificar en qué posiciones del ranking reciben más clics
- Entender el perfil de usuarios que los clickean (edad, ingresos)
- Calcular CPL (Costo Por Lead) promedio

---

## 4. Funnel de Conversión

**Endpoint:** `GET /api/v1/reportes/funnel-conversion`

**Descripción:** Análisis del embudo desde sesión hasta clic.

**Query Parameters:**
- `dias` (opcional): Número de días hacia atrás. Default: 30

**Ejemplo:**
```bash
GET http://localhost:4000/api/v1/reportes/funnel-conversion
```

**Respuesta:**
```json
{
  "success": true,
  "data": {
    "periodo": {
      "dias": 30,
      "desde": "2026-08-16T01:55:28.424Z",
      "hasta": "2026-09-15T01:55:28.441Z"
    },
    "funnel": [
      {
        "etapa": "1. Sesiones iniciadas",
        "cantidad": 20,
        "porcentaje": "100%",
        "descripcion": "Usuarios que visitaron la plataforma"
      },
      {
        "etapa": "2. Búsquedas realizadas",
        "cantidad": 14,
        "porcentaje": "70%",
        "descripcion": "Usuarios que completaron el formulario"
      },
      {
        "etapa": "3. Con engagement",
        "cantidad": 10,
        "porcentaje": "71.43%",
        "descripcion": "Usuarios que expandieron ofertas"
      },
      {
        "etapa": "4. Generaron clic",
        "cantidad": 6,
        "porcentaje": "42.86%",
        "descripcion": "Usuarios que clickearon 'Solicitar ahora'"
      }
    ],
    "tasas": {
      "sesionABusqueda": "70%",
      "busquedaAEngagement": "71.43%",
      "busquedaAClic": "42.86%"
    }
  }
}
```

**Insights:**
- Identificar dónde se pierden usuarios
- Optimizar etapas con baja conversión
- Benchmarking contra industria

---

## 5. Segmentación

**Endpoint:** `GET /api/v1/reportes/segmentacion`

**Descripción:** Segmentación de usuarios por edad e ingresos con tasas de conversión.

**Query Parameters:**
- `dias` (opcional): Número de días hacia atrás. Default: 30

**Ejemplo:**
```bash
GET http://localhost:4000/api/v1/reportes/segmentacion
```

**Respuesta:**
```json
{
  "success": true,
  "data": {
    "periodo": {
      "dias": 30,
      "desde": "2026-08-16T01:55:28.424Z",
      "hasta": "2026-09-15T01:55:28.441Z"
    },
    "segmentacionEdad": [
      {
        "rangoEdad": "25-34",
        "busquedas": 3,
        "clics": 1,
        "tasaConversion": "33.33%"
      },
      {
        "rangoEdad": "35-44",
        "busquedas": 5,
        "clics": 3,
        "tasaConversion": "60.00%"
      },
      {
        "rangoEdad": "45-54",
        "busquedas": 4,
        "clics": 1,
        "tasaConversion": "25.00%"
      },
      {
        "rangoEdad": "55+",
        "busquedas": 2,
        "clics": 1,
        "tasaConversion": "50.00%"
      }
    ],
    "segmentacionIngresos": [
      {
        "rangoIngresos": "< 2M",
        "busquedas": 1,
        "clics": 0,
        "tasaConversion": "0%"
      },
      {
        "rangoIngresos": "2M-5M",
        "busquedas": 6,
        "clics": 3,
        "tasaConversion": "50.00%"
      },
      {
        "rangoIngresos": "5M-10M",
        "busquedas": 5,
        "clics": 2,
        "tasaConversion": "40.00%"
      },
      {
        "rangoIngresos": "> 10M",
        "busquedas": 2,
        "clics": 1,
        "tasaConversion": "50.00%"
      }
    ]
  }
}
```

**Valor:**
- Identificar segmentos más rentables
- Personalizar ofertas por segmento
- Pricing diferenciado (cobrar más por leads de ingresos altos)
- Campañas de marketing segmentadas

---

## 💰 Monetización de Estos Datos

### Para Vender a Bancos:

**1. Reporte de Desempeño Mensual**
- Cuántos clics recibieron vs competencia
- Perfil de usuarios que los clickearon
- Posición promedio en ranking
- **Precio:** $2M-$5M COP/mes

**2. Leads Calificados (CPL)**
- Datos completos de usuarios que clickearon
- Segmentados por probabilidad de aprobación
- Con contexto de engagement
- **Precio:** $30K-$80K COP/lead

**3. Insights de Mercado**
- Demanda por rangos de monto
- Plazos más buscados
- Segmentos desatendidos
- **Precio:** Incluido en paquete mensual

**4. Benchmarking**
- Posición vs competencia
- Share of clicks
- Tasas competitivas
- **Precio:** $1M-$3M COP/mes adicional

---

## 🔐 Seguridad (Próximamente)

Para producción, estos endpoints deben:
- ✅ Requerir autenticación (JWT)
- ✅ Limitar por rol (solo admin/reportes)
- ✅ Rate limiting
- ✅ Logs de acceso
- ✅ Caché de queries pesadas

---

## 📈 Próximas Mejoras

- [ ] Exportar a Excel/PDF
- [ ] Gráficos visuales (Chart.js)
- [ ] Dashboard web interactivo
- [ ] Alertas automatizadas (email)
- [ ] API para bancos (autenticada)
- [ ] Comparación período vs período
- [ ] Proyecciones con ML

---

## 🧪 Generar Más Datos de Prueba

```bash
cd backend
npx tsx scripts/generar-datos-prueba.ts
```

Este script genera:
- 20 sesiones con contexto variado
- ~14 búsquedas con parámetros realistas
- ~3-6 clics distribuidos
- ~40 eventos de tracking

Puedes ejecutarlo múltiples veces para acumular más datos.
