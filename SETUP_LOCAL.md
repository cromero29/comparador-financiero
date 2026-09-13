# 🚀 Setup Local - Comparador Financiero

## ✅ Configuración Completada

### Servicios Docker
- ✅ PostgreSQL corriendo en `localhost:5432`
- ✅ Redis corriendo en `localhost:6379`

### Backend
- ✅ Dependencias instaladas
- ✅ Prisma Client generado
- ✅ Base de datos sincronizada
- ✅ Datos iniciales cargados (8 entidades, 5 productos, 3 configs scraping)

### Frontend
- ✅ Dependencias instaladas
- ✅ Variables de entorno configuradas

## 🏃 Cómo Levantar los Servicios

### 1️⃣ Levantar Backend (Terminal 1)
```powershell
cd backend
npm run dev
```
El backend estará disponible en: **http://localhost:4000**

### 2️⃣ Levantar Frontend (Terminal 2)
```powershell
cd frontend
npm run dev
```
El frontend estará disponible en: **http://localhost:5173**

## 🔍 Verificar que Todo Funciona

### Backend Health Check
Abre en tu navegador: http://localhost:4000/api/v1/health

Deberías ver:
```json
{
  "status": "ok",
  "timestamp": "2026-09-12T...",
  "environment": "development"
}
```

### Frontend
Abre en tu navegador: http://localhost:5173

Deberías ver la página principal del comparador.

## 📊 Datos Iniciales Cargados

### Entidades Financieras (8)
- Banco de Bogotá
- Bancolombia
- Davivienda
- BBVA Colombia
- Banco de Occidente
- Banco Caja Social
- Banco AV Villas
- Colpatria

### Productos de Ejemplo (5)
- 2 créditos de libre inversión
- 2 créditos de compra de cartera
- 1 crédito mixto

### Configuraciones de Scraping (3)
- Bancolombia (credito-libre-inversion)
- Davivienda (credito-libre-inversion)
- Banco de Bogotá (compra-cartera)

## 🗄️ Conexión a Base de Datos

### Credenciales PostgreSQL
```
Host: localhost
Port: 5432
Database: comparador_precios
User: comparador
Password: comparador_secret
```

### Conectar con pgAdmin o DBeaver
Usa las credenciales de arriba para explorar la base de datos.

### Prisma Studio (Opcional)
Para ver los datos con una interfaz visual:
```powershell
cd backend
npx prisma studio
```
Se abrirá en: http://localhost:5555

## 🛠️ Comandos Útiles

### Backend
```powershell
# Desarrollo con hot-reload
npm run dev

# Build para producción
npm run build

# Ejecutar migraciones
npm run prisma:migrate

# Regenerar Prisma Client
npm run prisma:generate

# Ver base de datos
npx prisma studio

# Ejecutar tests
npm test

# Linting
npm run lint
```

### Frontend
```powershell
# Desarrollo con hot-reload
npm run dev

# Build para producción
npm run build

# Preview del build
npm run preview

# Linting
npm run lint

# Type checking
npm run type-check
```

## 🐳 Comandos Docker

### Ver contenedores activos
```powershell
docker ps
```

### Detener contenedores
```powershell
docker stop comparador_postgres comparador_redis
```

### Iniciar contenedores detenidos
```powershell
docker start comparador_postgres comparador_redis
```

### Ver logs de PostgreSQL
```powershell
docker logs comparador_postgres
```

### Ver logs de Redis
```powershell
docker logs comparador_redis
```

## 🔧 Troubleshooting

### Backend no conecta a la base de datos
1. Verifica que PostgreSQL esté corriendo: `docker ps`
2. Verifica las credenciales en `backend/.env`
3. Revisa los logs: `docker logs comparador_postgres`

### Frontend no conecta al backend
1. Verifica que el backend esté corriendo en el puerto 4000
2. Revisa la variable `VITE_API_URL` en `frontend/.env`
3. Abre http://localhost:4000/api/v1/health en el navegador

### Puerto ocupado
Si el puerto 4000 o 5173 está ocupado:
1. Backend: cambia `PORT` en `backend/.env`
2. Frontend: cambia el puerto en `frontend/vite.config.ts`

## 📝 Próximos Pasos

1. **Probar el Comparador**
   - Accede a http://localhost:5173
   - Ingresa datos de un crédito
   - Verifica que se muestren resultados

2. **Probar el Web Scraping**
   - El scraping automático está configurado para las 3 AM
   - Para ejecutar manualmente: crear endpoint o script de prueba

3. **Explorar las APIs**
   - Documentación Swagger (si está configurada): http://localhost:4000/api/v1/docs
   - Endpoints principales:
     - GET `/entidades` - Lista de entidades
     - GET `/productos` - Lista de productos
     - POST `/comparar` - Comparar créditos
     - POST `/simular` - Simular cuotas

4. **Desarrollo**
   - Crear nuevas features
   - Agregar más entidades financieras
   - Mejorar algoritmos de comparación
   - Implementar más scrapers

## 🎯 Stack Tecnológico

### Backend
- Node.js + TypeScript
- Express.js
- Prisma ORM
- PostgreSQL
- Redis (caché)
- Puppeteer (web scraping)

### Frontend
- React 18
- TypeScript
- Vite
- TailwindCSS
- React Hook Form
- Zod (validación)
- Recharts (gráficos)

---

**¿Necesitas ayuda?** Revisa la documentación en la carpeta `/specs` o pregunta al equipo.
