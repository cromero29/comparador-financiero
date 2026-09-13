# Guía de Setup - Comparador Financiero

Instrucciones paso a paso para configurar el proyecto en tu máquina local.

## 📋 Requisitos Previos

- **Node.js** >= 20.0.0 ([Descargar](https://nodejs.org/))
- **PostgreSQL** >= 15 ([Descargar](https://www.postgresql.org/download/))
- **Git** ([Descargar](https://git-scm.com/))
- Editor de código (VS Code recomendado)

## 🔧 Setup Paso a Paso

### 1. Clonar el Repositorio

```bash
git clone https://github.com/cromero29/comparador-financiero.git
cd comparador-financiero
```

### 2. Configurar PostgreSQL

#### Opción A: PostgreSQL Local

```bash
# Iniciar PostgreSQL (Windows con pg_ctl)
pg_ctl -D "C:\Program Files\PostgreSQL\15\data" start

# Crear base de datos
psql -U postgres
CREATE DATABASE comparador;
\q
```

#### Opción B: PostgreSQL con Docker

```bash
docker run --name postgres-comparador -e POSTGRES_PASSWORD=password -e POSTGRES_DB=comparador -p 5432:5432 -d postgres:15
```

### 3. Setup del Backend

```bash
cd backend

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env

# Editar .env con tus credenciales de PostgreSQL
# DATABASE_URL="postgresql://postgres:password@localhost:5432/comparador?schema=public"
```

**Editar `backend/.env`:**

```env
NODE_ENV=development
PORT=4000

# ⚠️ IMPORTANTE: Actualizar con tus credenciales de PostgreSQL
DATABASE_URL="postgresql://postgres:TU_PASSWORD@localhost:5432/comparador?schema=public"

JWT_SECRET="super-secret-jwt-key-for-development-min-32-characters-long"

ALLOWED_ORIGINS="http://localhost:5173,http://localhost:3000"

SCRAPING_ENABLED=true
SCRAPING_SCHEDULE="0 3 * * *"
SCRAPING_TIMEOUT=30000
PUPPETEER_HEADLESS=true

RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

LOG_LEVEL=info
```

```bash
# Generar cliente de Prisma
npm run prisma:generate

# Ejecutar migraciones
npm run prisma:migrate

# Poblar base de datos con datos iniciales
npm run prisma:seed

# Iniciar servidor de desarrollo
npm run dev
```

**Verificar que el backend está corriendo:**

Abrir http://localhost:4000/api/v1/health en el navegador.

Deberías ver:

```json
{
  "status": "healthy",
  "timestamp": "2026-09-12T...",
  "uptime": 123.456,
  "environment": "development",
  "database": "connected"
}
```

### 4. Setup del Frontend

Abrir **nueva terminal**:

```bash
cd frontend

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env

# El .env ya tiene la configuración correcta para desarrollo local
# VITE_API_URL=http://localhost:4000/api/v1

# Iniciar servidor de desarrollo
npm run dev
```

**Abrir en el navegador:** http://localhost:5173

### 5. Verificar Funcionalidad

1. **Landing Page** (http://localhost:5173)
   - ✅ Ver formulario de comparación
   - ✅ Completar datos de prueba
   - ✅ Click en "Comparar Ofertas"

2. **Página de Resultados**
   - ✅ Ver ofertas ordenadas
   - ✅ Ver detalles de cada oferta
   - ✅ Click en "Solicitar ahora" (debería abrir sitio de entidad)

3. **Backend APIs**
   - ✅ Health: http://localhost:4000/api/v1/health
   - ✅ Productos: http://localhost:4000/api/v1/productos
   - ✅ Estadísticas: http://localhost:4000/api/v1/productos/estadisticas

### 6. (Opcional) Ejecutar Web Scraping

```bash
# En la carpeta backend
npm run scrape

# Ver estadísticas de scraping
npm run scrape -- --stats
```

**Nota:** Los scrapers de ejemplo no funcionarán con las URLs reales hasta que configures los selectores CSS correctos para cada entidad.

## 🐛 Troubleshooting

### Error: "Cannot find module '@prisma/client'"

```bash
cd backend
npm run prisma:generate
```

### Error: "database \"comparador\" does not exist"

```bash
# Conectar a PostgreSQL
psql -U postgres

# Crear la base de datos
CREATE DATABASE comparador;
\q

# Ejecutar migraciones nuevamente
npm run prisma:migrate
```

### Error: "Port 4000 is already in use"

Cambiar el puerto en `backend/.env`:

```env
PORT=4001
```

Y actualizar en `frontend/.env`:

```env
VITE_API_URL=http://localhost:4001/api/v1
```

### Error: "CORS" en el frontend

Verificar que `backend/.env` incluya:

```env
ALLOWED_ORIGINS="http://localhost:5173,http://localhost:3000"
```

### Puppeteer falla en Windows

```bash
# Instalar manualmente
cd backend
npm install puppeteer
npx puppeteer browsers install chrome
```

### Base de datos se llena de datos de prueba

```bash
# Resetear base de datos
cd backend
npx prisma migrate reset
npm run prisma:seed
```

## 🔍 Verificar Instalación

### Checklist Backend

- [ ] PostgreSQL corriendo
- [ ] `npm install` exitoso
- [ ] Migraciones ejecutadas
- [ ] Seed data cargado
- [ ] Servidor corriendo en http://localhost:4000
- [ ] Health check responde OK
- [ ] Logs no muestran errores

### Checklist Frontend

- [ ] `npm install` exitoso
- [ ] Servidor corriendo en http://localhost:5173
- [ ] Landing page se ve correctamente
- [ ] Formulario se puede completar
- [ ] Comparación funciona (llama al backend)
- [ ] Resultados se muestran

## 📚 Próximos Pasos

Una vez que todo funciona localmente:

1. **Configurar Scrapers Reales**
   - Inspeccionar HTML de sitios web de entidades
   - Actualizar selectores CSS en base de datos
   - Probar scraping: `npm run scrape`

2. **Testing**
   - Probar con diferentes montos y plazos
   - Verificar cálculos financieros
   - Validar tracking de eventos

3. **Deploy**
   - Backend a Railway
   - Frontend a Vercel
   - Configurar variables de entorno en producción
   - Apuntar frontend a backend en Railway

## 🆘 Obtener Ayuda

Si encuentras problemas:

1. Revisar logs en `backend/logs/`
2. Verificar que PostgreSQL esté corriendo
3. Comprobar que los puertos no estén ocupados
4. Revisar la consola del navegador para errores de frontend

## 📖 Documentación Adicional

- **Backend:** Ver `backend/README.md`
- **Frontend:** Ver `frontend/README.md`
- **Web Scraping:** Ver `backend/src/scrapers/README.md`
- **Especificación Técnica:** Ver `specs/` (9 documentos SDD)

---

**¿Todo funcionando?** ✅ ¡Felicitaciones! Ahora puedes empezar a personalizar y mejorar el proyecto.
