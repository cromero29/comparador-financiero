# Comparador Financiero - Backend API

API REST para el comparador de productos financieros. Incluye sistema de web scraping, algoritmos de comparación y tracking de eventos.

## 🚀 Tecnologías

- **Runtime:** Node.js 20+
- **Framework:** Express + TypeScript
- **ORM:** Prisma
- **Base de datos:** PostgreSQL 15
- **Web Scraping:** Puppeteer + Cheerio
- **Validación:** Zod
- **Logging:** Winston
- **Seguridad:** Helmet, CORS, Rate Limiting

## 📋 Requisitos Previos

- Node.js >= 20.0.0
- PostgreSQL >= 15
- npm o yarn

## 🛠️ Instalación

1. **Instalar dependencias**

```bash
npm install
```

2. **Configurar variables de entorno**

Copiar `.env.example` a `.env` y configurar:

```bash
cp .env.example .env
```

Editar `.env` con tus valores:

```env
NODE_ENV=development
PORT=4000
DATABASE_URL="postgresql://user:password@localhost:5432/comparador"
JWT_SECRET="your-super-secret-key-min-32-chars"
ALLOWED_ORIGINS="http://localhost:5173"
```

3. **Configurar base de datos**

```bash
# Generar cliente Prisma
npm run prisma:generate

# Ejecutar migraciones
npm run prisma:migrate

# Poblar con datos iniciales
npm run prisma:seed
```

## 🏃 Ejecución

### Desarrollo

```bash
npm run dev
```

El servidor se iniciará en `http://localhost:4000`

### Producción

```bash
# Compilar TypeScript
npm run build

# Iniciar servidor
npm start
```

## 📚 API Endpoints

### Health Check

```http
GET /api/v1/health
```

Verifica el estado del servidor y la conexión a la base de datos.

### Comparación

```http
POST /api/v1/comparacion
Content-Type: application/json

{
  "tipoProducto": "LIBRE_INVERSION",
  "montoSolicitado": 30000000,
  "plazoMeses": 36,
  "ingresos": 5000000,
  "edad": 35,
  "tipoEmpleo": "dependiente"
}
```

**Respuesta:**

```json
{
  "success": true,
  "data": {
    "resultado": {
      "ofertas": [
        {
          "id": "uuid",
          "entidad": {
            "nombre": "RappiPay",
            "tipo": "FINTECH"
          },
          "condiciones": {
            "tasaEfectivaAnual": 19.56,
            "plazoMeses": 36
          },
          "cuota": {
            "total": 1150000
          },
          "ranking": {
            "posicion": 1,
            "puntaje": 95.5
          }
        }
      ],
      "resumen": {
        "totalOfertas": 5,
        "mejorTasa": 19.56,
        "promedioTasa": 22.5
      }
    }
  }
}
```

### Productos

```http
# Obtener todos los productos
GET /api/v1/productos

# Productos por tipo
GET /api/v1/productos/tipo/LIBRE_INVERSION

# Producto específico
GET /api/v1/productos/:id

# Estadísticas
GET /api/v1/productos/estadisticas
```

### Tracking

```http
# Registrar evento
POST /api/v1/tracking/evento
{
  "tipoEvento": "form_complete",
  "categoria": "comparacion",
  "accion": "submit",
  "metadata": { "monto": 30000000 }
}

# Registrar clic (CPC)
POST /api/v1/tracking/clic
{
  "productoId": "uuid",
  "posicion": 1,
  "montoSolicitado": 30000000,
  "plazoMeses": 36,
  "tipoProducto": "LIBRE_INVERSION"
}

# Métricas de conversión
GET /api/v1/tracking/metricas/conversion?fechaInicio=2026-09-01&fechaFin=2026-09-30

# Métricas CPC
GET /api/v1/tracking/metricas/cpc

# Top productos
GET /api/v1/tracking/top-productos?limite=10
```

## 🗄️ Esquema de Base de Datos

### Tablas Principales

- `entidades_financieras` - Bancos, fintechs, cooperativas
- `productos` - Productos financieros con condiciones
- `scraper_configs` - Configuraciones de web scraping
- `scraping_logs` - Historial de ejecuciones de scrapers
- `eventos_tracking` - Eventos de analytics
- `clics_tracking` - Clics en ofertas (CPC)

Ver detalles completos en `prisma/schema.prisma`

## 🧪 Comandos Útiles

```bash
# Ver base de datos con Prisma Studio
npm run prisma:studio

# Ejecutar scraping manual
npm run scrape

# Ver logs
tail -f logs/combined.log
tail -f logs/error.log
```

## 📁 Estructura del Proyecto

```
backend/
├── prisma/
│   ├── schema.prisma          # Schema de base de datos
│   ├── seed.ts                # Datos iniciales
│   └── migrations/            # Migraciones
├── src/
│   ├── config/                # Configuración (DB, logger, env)
│   ├── controllers/           # Controladores de rutas
│   ├── services/              # Lógica de negocio
│   ├── repositories/          # Acceso a datos
│   ├── middleware/            # Middleware Express
│   ├── utils/                 # Utilidades (financial, validators)
│   ├── scrapers/              # Sistema de web scraping
│   ├── routes/                # Definición de rutas
│   ├── types/                 # TypeScript types
│   └── index.ts               # Punto de entrada
├── logs/                      # Archivos de log
├── package.json
├── tsconfig.json
└── .env                       # Variables de entorno (no commitear)
```

## 🔒 Seguridad

- ✅ HTTPS/TLS requerido en producción
- ✅ Helmet para headers de seguridad
- ✅ CORS configurado
- ✅ Rate limiting (100 req/15min general, 10 req/min comparación)
- ✅ Validación de inputs con Zod
- ✅ Sanitización con DOMPurify
- ✅ SQL injection prevenido (Prisma ORM)

## 📊 Algoritmo de Comparación

El sistema usa un algoritmo de ranking ponderado:

- **40%** - Costo total (menor es mejor)
- **30%** - Tasa de interés (menor es mejor)
- **20%** - Tiempo de aprobación (rápido es mejor)
- **10%** - Requisitos (menos requisitos es mejor)

Sistema de amortización: **Francés** (cuota fija)

## 🚀 Deploy

### Railway (Recomendado)

1. Crear proyecto en Railway
2. Conectar repositorio GitHub
3. Agregar PostgreSQL addon
4. Configurar variables de entorno
5. Deploy automático

Ver `specs/02-arquitectura-sistema.md` para más detalles.

## 📝 Licencia

Todos los derechos reservados © 2026

## 📞 Contacto

- Email: soporte@comparador.com
- Seguridad: seguridad@comparador.com
