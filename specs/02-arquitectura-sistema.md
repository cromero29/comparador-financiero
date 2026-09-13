# Arquitectura del Sistema
## Plataforma de Comparación Financiera

**Proyecto:** Comparador de Productos Financieros  
**Versión:** 1.0  
**Fecha:** Septiembre 2026  

---

## 1. VISIÓN GENERAL DE ARQUITECTURA

### 1.1 Principios de Diseño

**Arquitectura Objetivo:**
- **Modular:** Componentes independientes y reutilizables
- **Escalable:** Preparada para crecimiento horizontal
- **Resiliente:** Tolerante a fallos con circuit breakers
- **Mantenible:** Código limpio, bien documentado y testeado
- **Segura:** Security by design en todas las capas

**Patrones Arquitectónicos:**
- **Frontend:** Component-based architecture (React)
- **Backend:** Layered architecture (Controller → Service → Repository)
- **Comunicación:** RESTful APIs con versionado
- **Datos:** Event sourcing para tracking (futuro)
- **Despliegue:** Containerización con Docker

---

## 2. ARQUITECTURA DE ALTO NIVEL

```
┌─────────────────────────────────────────────────────────────────┐
│                         USUARIOS FINALES                         │
│                    (Web Browser / Mobile)                        │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             │ HTTPS
                             │
┌────────────────────────────▼────────────────────────────────────┐
│                          CDN / WAF                               │
│                   (CloudFlare / AWS CloudFront)                  │
└────────────────────────────┬────────────────────────────────────┘
                             │
        ┌────────────────────┼────────────────────┐
        │                    │                    │
        ▼                    ▼                    ▼
┌───────────────┐   ┌───────────────┐   ┌───────────────┐
│   Frontend    │   │  Static Site  │   │   Admin Web   │
│   (React)     │   │   (Landing)   │   │   Dashboard   │
│               │   │               │   │               │
│  Port: 5173   │   │  Port: 3001   │   │  Port: 3002   │
└───────┬───────┘   └───────────────┘   └───────┬───────┘
        │                                        │
        │                                        │
        └────────────────┬───────────────────────┘
                         │ REST API
                         │
                         ▼
        ┌────────────────────────────────────────┐
        │        API Gateway / Load Balancer     │
        │            (NGINX / Kong)              │
        │         Rate Limiting / Auth           │
        └────────────────┬───────────────────────┘
                         │
        ┌────────────────┼────────────────────┐
        │                │                    │
        ▼                ▼                    ▼
┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│   Backend    │ │   Backend    │ │   Backend    │
│  Instance 1  │ │  Instance 2  │ │  Instance N  │
│              │ │              │ │              │
│ Port: 4000   │ │ Port: 4001   │ │ Port: 400N   │
└──────┬───────┘ └──────┬───────┘ └──────┬───────┘
       │                │                │
       └────────────────┼────────────────┘
                        │
        ┌───────────────┼───────────────────┐
        │               │                   │
        ▼               ▼                   ▼
┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│  PostgreSQL  │ │    Redis     │ │    S3 /      │
│   Database   │ │    Cache     │ │  File Store  │
│              │ │              │ │              │
│  Port: 5432  │ │  Port: 6379  │ │              │
└──────────────┘ └──────────────┘ └──────────────┘
        │
        ▼
┌──────────────┐
│  Backup /    │
│  Replication │
└──────────────┘


┌─────────────────────────────────────────────────────────────────┐
│                    SERVICIOS EXTERNOS                            │
├─────────────────────────────────────────────────────────────────┤
│  • Email Service (SendGrid / AWS SES)                           │
│  • SMS Service (Twilio)                                         │
│  • Analytics (Google Analytics / Mixpanel)                      │
│  • Monitoring (Datadog / New Relic)                             │
│  • Error Tracking (Sentry)                                      │
│  • Payment Gateway (Stripe - futuro)                            │
└─────────────────────────────────────────────────────────────────┘


┌─────────────────────────────────────────────────────────────────┐
│                    ENTIDADES FINANCIERAS                         │
│                    (Webhooks / APIs)                             │
└─────────────────────────────────────────────────────────────────┘
```

---

## 3. STACK TECNOLÓGICO

### 3.1 Frontend

| Componente | Tecnología | Versión | Justificación |
|------------|------------|---------|---------------|
| **Framework** | React | 18.3+ | Ecosistema maduro, performance, comunidad |
| **Build Tool** | Vite | 5.0+ | Rápido, modern, mejor DX que CRA |
| **Lenguaje** | TypeScript | 5.0+ | Type safety, mejor mantenibilidad |
| **Estado Global** | Zustand | 4.5+ | Simple, sin boilerplate, performance |
| **Routing** | React Router | 6.20+ | Estándar de facto, nested routes |
| **Forms** | React Hook Form | 7.50+ | Performance, validación, UX |
| **UI Library** | Tailwind CSS | 3.4+ | Utility-first, responsive, customizable |
| **Components** | Shadcn/ui | Latest | Componentes accesibles, copiables |
| **Icons** | Lucide React | Latest | Moderno, tree-shakeable |
| **Charts** | Recharts | 2.10+ | Declarativo, responsive |
| **HTTP Client** | Axios | 1.6+ | Interceptors, mejor manejo de errores |
| **Validación** | Zod | 3.22+ | Type-safe schema validation |
| **Fechas** | date-fns | 3.0+ | Ligero vs moment.js |
| **Testing** | Vitest + Testing Library | Latest | Rápido, compatible con Vite |

**Estructura de Directorios Frontend:**
```
frontend/
├── public/
│   ├── favicon.ico
│   └── robots.txt
├── src/
│   ├── app/                    # App setup
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── router.tsx
│   ├── components/             # Componentes reutilizables
│   │   ├── ui/                 # Componentes base (shadcn)
│   │   ├── layout/             # Layout components
│   │   ├── forms/              # Form components
│   │   └── shared/             # Shared components
│   ├── features/               # Features por módulo
│   │   ├── comparador/
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   ├── services/
│   │   │   └── types.ts
│   │   ├── simulador/
│   │   └── solicitud/
│   ├── pages/                  # Page components
│   │   ├── HomePage.tsx
│   │   ├── ComparadorPage.tsx
│   │   ├── ResultadosPage.tsx
│   │   └── SolicitudPage.tsx
│   ├── services/               # API services
│   │   ├── api/
│   │   └── http.ts
│   ├── store/                  # Global state (Zustand)
│   ├── hooks/                  # Custom hooks
│   ├── utils/                  # Utilities
│   ├── types/                  # TypeScript types
│   ├── constants/              # Constants
│   └── styles/                 # Global styles
├── tests/
├── .env.example
├── package.json
├── tsconfig.json
├── vite.config.ts
└── tailwind.config.js
```

---

### 3.2 Backend

| Componente | Tecnología | Versión | Justificación |
|------------|------------|---------|---------------|
| **Runtime** | Node.js | 20 LTS | Estable, async I/O, gran ecosistema |
| **Framework** | Express | 4.18+ | Minimalista, flexible, probado |
| **Lenguaje** | TypeScript | 5.0+ | Type safety, mejor DX |
| **ORM** | Prisma | 5.8+ | Type-safe, migrations, great DX |
| **Validación** | Zod | 3.22+ | Compartido con frontend |
| **Autenticación** | Passport.js + JWT | Latest | Flexible, estrategias múltiples |
| **Encriptación** | bcrypt | 5.1+ | Hashing de passwords |
| **Rate Limiting** | express-rate-limit | 7.0+ | Protección contra abuse |
| **CORS** | cors | 2.8+ | Configuración de CORS |
| **Logging** | Winston | 3.11+ | Logs estructurados |
| **Validación Env** | dotenv + zod | Latest | Validación de variables de entorno |
| **Testing** | Jest + Supertest | Latest | Testing unitario e integración |
| **API Docs** | Swagger / OpenAPI | 3.0 | Documentación automática |
| **Cron Jobs** | node-cron | 3.0+ | Tareas programadas |
| **Email** | Nodemailer | 6.9+ | Envío de emails |

**Estructura de Directorios Backend:**
```
backend/
├── src/
│   ├── config/                 # Configuraciones
│   │   ├── database.ts
│   │   ├── env.ts
│   │   └── logger.ts
│   ├── modules/                # Módulos por dominio
│   │   ├── creditos/
│   │   │   ├── controllers/
│   │   │   ├── services/
│   │   │   ├── repositories/
│   │   │   ├── validators/
│   │   │   ├── types.ts
│   │   │   └── routes.ts
│   │   ├── entidades/
│   │   ├── leads/
│   │   ├── usuarios/
│   │   └── simulaciones/
│   ├── shared/                 # Código compartido
│   │   ├── middleware/
│   │   ├── utils/
│   │   ├── types/
│   │   └── errors/
│   ├── database/               # Database setup
│   │   ├── prisma/
│   │   │   ├── schema.prisma
│   │   │   ├── migrations/
│   │   │   └── seed.ts
│   │   └── client.ts
│   ├── jobs/                   # Cron jobs
│   ├── app.ts                  # Express app
│   └── server.ts               # Server entry point
├── tests/
│   ├── unit/
│   ├── integration/
│   └── fixtures/
├── docs/
│   └── swagger.yaml
├── scripts/
├── .env.example
├── package.json
├── tsconfig.json
└── jest.config.js
```

---

### 3.3 Base de Datos

| Componente | Tecnología | Justificación |
|------------|------------|---------------|
| **Principal** | PostgreSQL 15+ | Relacional, robusto, ACID |
| **Cache** | Redis 7+ | In-memory, rápido, pub/sub |
| **Búsqueda** | PostgreSQL Full-Text | Suficiente para MVP |
| **Files** | AWS S3 / Local | Almacenamiento de archivos |

**Características PostgreSQL:**
- JSONB para flexibilidad
- Índices compuestos para queries complejas
- Particionamiento preparado
- Replicación read replicas (futuro)

---

### 3.4 Infraestructura y DevOps

| Componente | Tecnología | Justificación |
|------------|------------|---------------|
| **Containerización** | Docker | Portabilidad, consistencia |
| **Orquestación** | Docker Compose (MVP) | Simple para empezar |
| **CI/CD** | GitHub Actions | Gratuito, integrado |
| **Cloud Provider** | AWS / DigitalOcean | Escalable, servicios variados |
| **CDN** | CloudFlare | Gratuito, rápido, DDoS protection |
| **Monitoring** | Datadog / New Relic | Métricas, alertas |
| **Error Tracking** | Sentry | Tracking de errores en prod |
| **Analytics** | Google Analytics 4 | Análisis de comportamiento |

---

## 4. ARQUITECTURA POR CAPAS - BACKEND

### 4.1 Capa de Presentación (Controllers)

**Responsabilidades:**
- Recibir requests HTTP
- Validar input básico
- Llamar a servicios
- Retornar responses
- Manejo de errores HTTP

**Ejemplo:**
```typescript
// src/modules/creditos/controllers/comparacion.controller.ts

export class ComparacionController {
  constructor(private comparacionService: ComparacionService) {}

  async compararOfertas(req: Request, res: Response): Promise<void> {
    try {
      // 1. Validar input
      const input = solicitudSchema.parse(req.body);
      
      // 2. Llamar servicio
      const ofertas = await this.comparacionService.compararOfertas(input);
      
      // 3. Retornar respuesta
      res.json({
        success: true,
        data: ofertas,
        meta: {
          total: ofertas.length,
          timestamp: new Date().toISOString()
        }
      });
    } catch (error) {
      // 4. Manejo de errores
      next(error);
    }
  }
}
```

---

### 4.2 Capa de Lógica de Negocio (Services)

**Responsabilidades:**
- Lógica de negocio compleja
- Orquestación de repositorios
- Cálculos y algoritmos
- Validaciones de negocio
- Eventos y notificaciones

**Ejemplo:**
```typescript
// src/modules/creditos/services/comparacion.service.ts

export class ComparacionService {
  constructor(
    private productoRepo: ProductoRepository,
    private entidadRepo: EntidadRepository,
    private calculadoraService: CalculadoraService,
    private rankingService: RankingService
  ) {}

  async compararOfertas(solicitud: SolicitudCredito): Promise<Oferta[]> {
    // 1. Obtener productos elegibles
    const productos = await this.productoRepo.findElegibles({
      monto: solicitud.montoSolicitado,
      plazo: solicitud.plazoMeses,
      ingresos: solicitud.ingresos
    });

    // 2. Calcular oferta para cada producto
    const ofertas = await Promise.all(
      productos.map(producto => this.calcularOferta(producto, solicitud))
    );

    // 3. Rankear ofertas
    const ofertasRankeadas = this.rankingService.rankear(ofertas);

    // 4. Retornar top ofertas
    return ofertasRankeadas.slice(0, 10);
  }

  private async calcularOferta(
    producto: Producto,
    solicitud: SolicitudCredito
  ): Promise<Oferta> {
    // Cálculos financieros
    const cuotaMensual = this.calculadoraService.calcularCuota({
      capital: solicitud.montoSolicitado,
      tasa: producto.tasaMensual,
      plazo: solicitud.plazoMeses
    });

    const costoTotal = this.calculadoraService.calcularCostoTotal({
      cuota: cuotaMensual,
      plazo: solicitud.plazoMeses,
      seguros: producto.seguros,
      comisiones: producto.comisiones
    });

    return {
      productoId: producto.id,
      entidad: await this.entidadRepo.findById(producto.entidadId),
      tasaMensual: producto.tasaMensual,
      tasaEfectiva: producto.tasaEfectivaAnual,
      cuotaMensual,
      costoTotal,
      // ... más campos
    };
  }
}
```

---

### 4.3 Capa de Acceso a Datos (Repositories)

**Responsabilidades:**
- CRUD operations
- Queries complejas
- Transacciones
- Manejo de conexiones
- Optimización de queries

**Ejemplo:**
```typescript
// src/modules/creditos/repositories/producto.repository.ts

export class ProductoRepository {
  constructor(private prisma: PrismaClient) {}

  async findElegibles(criteria: ElegibilityCriteria): Promise<Producto[]> {
    return this.prisma.producto.findMany({
      where: {
        activo: true,
        montoMinimo: { lte: criteria.monto },
        montoMaximo: { gte: criteria.monto },
        plazoMinimo: { lte: criteria.plazo },
        plazoMaximo: { gte: criteria.plazo },
        ingresoMinimo: { lte: criteria.ingresos }
      },
      include: {
        entidad: true,
        costos: true
      },
      orderBy: {
        tasaMensual: 'asc'
      }
    });
  }

  async findById(id: string): Promise<Producto | null> {
    return this.prisma.producto.findUnique({
      where: { id },
      include: {
        entidad: true,
        costos: true,
        requisitos: true
      }
    });
  }
}
```

---

## 5. PATRONES DE DISEÑO APLICADOS

### 5.1 Dependency Injection
- Inyección de dependencias en servicios
- Facilita testing con mocks
- Desacoplamiento de componentes

### 5.2 Repository Pattern
- Abstracción de acceso a datos
- Facilita cambio de ORM/DB
- Centraliza queries

### 5.3 Service Layer Pattern
- Separación de lógica de negocio
- Reutilización de lógica
- Testing independiente

### 5.4 Factory Pattern
- Creación de objetos complejos
- Ejemplo: OfertaFactory, LeadFactory

### 5.5 Strategy Pattern
- Diferentes algoritmos de ranking
- Diferentes métodos de cálculo
- Ejemplo: RankingStrategy, CalculadoraStrategy

### 5.6 Observer Pattern
- Eventos de negocio
- Ejemplo: LeadCreatedEvent → EmailNotification, WebhookNotification

---

## 6. SEGURIDAD

### 6.1 Autenticación y Autorización

```typescript
// JWT-based authentication

// Estructura del JWT
interface JWTPayload {
  userId: string;
  email: string;
  role: 'user' | 'admin' | 'entity';
  permissions: string[];
  iat: number;
  exp: number;
}

// Middleware de autenticación
const authenticate = async (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

// Middleware de autorización
const authorize = (...roles: string[]) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    next();
  };
};
```

### 6.2 Protección de Datos Sensibles

```typescript
// Encriptación de datos sensibles
class EncryptionService {
  private algorithm = 'aes-256-gcm';
  private key = Buffer.from(process.env.ENCRYPTION_KEY, 'hex');

  encrypt(text: string): string {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(this.algorithm, this.key, iv);
    
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    const authTag = cipher.getAuthTag();
    
    return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted}`;
  }

  decrypt(encryptedText: string): string {
    const [ivHex, authTagHex, encrypted] = encryptedText.split(':');
    const iv = Buffer.from(ivHex, 'hex');
    const authTag = Buffer.from(authTagHex, 'hex');
    
    const decipher = crypto.createDecipheriv(this.algorithm, this.key, iv);
    decipher.setAuthTag(authTag);
    
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  }
}

// Uso en modelo
class Lead {
  @Encrypted()
  numeroDocumento: string;
  
  @Encrypted()
  telefono: string;
  
  @Encrypted()
  email: string;
}
```

### 6.3 Rate Limiting

```typescript
// Rate limiting por IP y por usuario
import rateLimit from 'express-rate-limit';

// Límite general
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // 100 requests
  message: 'Demasiadas solicitudes, intente más tarde'
});

// Límite para comparación (más estricto)
const comparacionLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minuto
  max: 10, // 10 comparaciones
  message: 'Límite de comparaciones alcanzado'
});

// Límite para creación de leads (muy estricto)
const leadLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 3,
  message: 'Límite de solicitudes alcanzado'
});
```

### 6.4 Validación y Sanitización

```typescript
import { z } from 'zod';
import DOMPurify from 'isomorphic-dompurify';

// Schema de validación
const solicitudSchema = z.object({
  montoSolicitado: z.number()
    .min(1000000, 'Monto mínimo: $1.000.000')
    .max(100000000, 'Monto máximo: $100.000.000'),
  
  plazoMeses: z.number()
    .int()
    .min(6, 'Plazo mínimo: 6 meses')
    .max(84, 'Plazo máximo: 84 meses'),
  
  numeroDocumento: z.string()
    .regex(/^\d{7,10}$/, 'Número de documento inválido')
    .transform(val => DOMPurify.sanitize(val)),
  
  email: z.string()
    .email('Email inválido')
    .transform(val => val.toLowerCase().trim()),
  
  telefono: z.string()
    .regex(/^3\d{9}$/, 'Teléfono inválido')
});
```

---

## 7. ESCALABILIDAD

### 7.1 Estrategias de Cache

```typescript
// Cache en Redis
class CacheService {
  constructor(private redis: Redis) {}

  async cacheProductos(key: string, data: any, ttl: number = 3600) {
    await this.redis.setex(key, ttl, JSON.stringify(data));
  }

  async getProductos(key: string): Promise<any | null> {
    const cached = await this.redis.get(key);
    return cached ? JSON.parse(cached) : null;
  }
}

// Uso en servicio
async compararOfertas(solicitud: SolicitudCredito): Promise<Oferta[]> {
  const cacheKey = `ofertas:${solicitud.montoSolicitado}:${solicitud.plazoMeses}`;
  
  // Intentar obtener de cache
  const cached = await this.cache.get(cacheKey);
  if (cached) return cached;
  
  // Si no está en cache, calcular
  const ofertas = await this.calcularOfertas(solicitud);
  
  // Guardar en cache por 1 hora
  await this.cache.set(cacheKey, ofertas, 3600);
  
  return ofertas;
}
```

### 7.2 Queue System (Futuro)

```typescript
// Para procesamiento asíncrono de leads
interface LeadQueue {
  addLead(lead: Lead): Promise<void>;
  processLead(lead: Lead): Promise<void>;
}

// Worker que procesa leads
class LeadWorker {
  async process(lead: Lead) {
    // 1. Validar lead
    // 2. Enviar a entidad financiera
    // 3. Enviar notificación al usuario
    // 4. Actualizar métricas
  }
}
```

### 7.3 Database Optimization

```sql
-- Índices críticos

-- Búsqueda de productos elegibles
CREATE INDEX idx_productos_elegibilidad 
ON productos(activo, monto_minimo, monto_maximo, tasa_mensual);

-- Búsqueda de leads por entidad
CREATE INDEX idx_leads_entidad_fecha 
ON leads(entidad_id, fecha_creacion DESC);

-- Búsqueda de leads por estado
CREATE INDEX idx_leads_estado 
ON leads(estado, fecha_creacion DESC);

-- Full-text search en productos
CREATE INDEX idx_productos_fulltext 
ON productos USING GIN(to_tsvector('spanish', nombre || ' ' || descripcion));
```

---

## 8. MONITOREO Y OBSERVABILIDAD

### 8.1 Logging

```typescript
// Winston logger configurado
import winston from 'winston';

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'comparador-api' },
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});

// Logging estructurado
logger.info('Lead created', {
  leadId: lead.id,
  entidadId: lead.entidadId,
  monto: lead.montoSolicitado,
  userId: req.user?.id,
  ip: req.ip
});
```

### 8.2 Métricas

```typescript
// Métricas custom con Prometheus (futuro)
const httpRequestDuration = new prometheus.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code']
});

const leadsCreated = new prometheus.Counter({
  name: 'leads_created_total',
  help: 'Total number of leads created',
  labelNames: ['entidad', 'producto']
});
```

### 8.3 Health Checks

```typescript
// Endpoint de health check
app.get('/health', async (req, res) => {
  const checks = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    services: {
      database: await checkDatabase(),
      redis: await checkRedis(),
      external: await checkExternalAPIs()
    }
  };

  const isHealthy = Object.values(checks.services).every(s => s.status === 'up');
  
  res.status(isHealthy ? 200 : 503).json(checks);
});
```

---

## 9. INTEGRACIONES EXTERNAS

### 9.1 Webhooks para Entidades Financieras

```typescript
// Sistema de webhooks
class WebhookService {
  async enviarLead(lead: Lead, webhook: WebhookConfig): Promise<void> {
    try {
      const signature = this.generarSignature(lead, webhook.secret);
      
      const response = await axios.post(webhook.url, {
        event: 'lead.created',
        data: this.sanitizeLead(lead),
        timestamp: new Date().toISOString()
      }, {
        headers: {
          'X-Webhook-Signature': signature,
          'Content-Type': 'application/json'
        },
        timeout: 10000
      });

      await this.logWebhook(lead.id, webhook.url, response.status);
    } catch (error) {
      await this.handleWebhookError(lead.id, webhook.url, error);
      // Implementar retry logic con exponential backoff
    }
  }

  private generarSignature(data: any, secret: string): string {
    return crypto
      .createHmac('sha256', secret)
      .update(JSON.stringify(data))
      .digest('hex');
  }
}
```

### 9.2 Email Service

```typescript
// Servicio de emails con templates
class EmailService {
  async enviarConfirmacionLead(lead: Lead): Promise<void> {
    const template = this.templates.confirmacionLead({
      nombre: lead.nombres,
      monto: formatCurrency(lead.montoSolicitado),
      entidad: lead.entidad.nombre,
      tiempoRespuesta: lead.producto.tiempoAprobacion
    });

    await this.send({
      to: lead.email,
      subject: 'Solicitud recibida - Comparador Financiero',
      html: template
    });
  }
}
```

---

## 10. DEPLOYMENT Y CI/CD

### 10.1 Docker Compose (MVP)

```yaml
version: '3.8'

services:
  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    environment:
      - VITE_API_URL=http://localhost:4000/api
    depends_on:
      - backend

  backend:
    build: ./backend
    ports:
      - "4000:4000"
    environment:
      - DATABASE_URL=postgresql://user:pass@postgres:5432/comparador
      - REDIS_URL=redis://redis:6379
      - JWT_SECRET=${JWT_SECRET}
    depends_on:
      - postgres
      - redis

  postgres:
    image: postgres:15-alpine
    environment:
      - POSTGRES_DB=comparador
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=pass
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

volumes:
  postgres_data:
  redis_data:
```

### 10.2 CI/CD Pipeline

```yaml
# .github/workflows/ci-cd.yml
name: CI/CD Pipeline

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main, develop ]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run tests
        run: npm test
      
      - name: Run linter
        run: npm run lint

  build:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Build Docker images
        run: docker-compose build
      
      - name: Push to registry
        run: docker-compose push

  deploy:
    needs: build
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - name: Deploy to production
        run: |
          # Deploy commands
```

---

## 11. DECISIONES ARQUITECTÓNICAS (ADRs)

### ADR-001: Por qué React sobre Vue/Angular
**Decisión:** Usar React 18 con TypeScript  
**Contexto:** Necesitamos framework frontend moderno  
**Razones:**
- Mayor ecosistema y comunidad
- Mejor performance con Concurrent Mode
- Experiencia del equipo
- Server Components (futuro)

### ADR-002: Por qué PostgreSQL sobre MongoDB
**Decisión:** PostgreSQL como base de datos principal  
**Contexto:** Datos financieros requieren consistencia  
**Razones:**
- ACID compliance crítico
- Relaciones complejas entre entidades
- JSONB da flexibilidad cuando se necesita
- Mejor para reporting y analytics

### ADR-003: Monolito modular vs Microservicios
**Decisión:** Empezar con monolito modular  
**Contexto:** MVP con equipo pequeño  
**Razones:**
- Menos complejidad operacional
- Deploy más simple
- Refactoring a microservicios cuando escale
- Módulos bien separados facilitan futura migración

---

## 12. PRÓXIMOS PASOS

**Fase Actual:** Diseño de arquitectura ✅  
**Siguiente:** Modelado de datos y esquemas de BD

**Documento creado por:** Sistema SDD  
**Próximo documento:** 03-modelo-datos.md
