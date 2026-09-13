# Seguridad y Compliance
## Plataforma de Comparación Financiera - MVP

**Proyecto:** Comparador de Productos Financieros  
**Versión:** 1.0 - MVP Simplificado  
**Fecha:** Septiembre 2026  

---

## 1. VISIÓN GENERAL

### 1.1 Filosofía de Seguridad

**Security by Design:**
- Seguridad desde la arquitectura, no como agregado
- Principio de mínimo privilegio
- Defensa en profundidad (múltiples capas)
- Transparencia con usuarios sobre uso de datos

**Balance MVP:**
- Seguridad esencial: implementada desde día 1
- Seguridad avanzada: roadmap post-MVP
- Pragmatismo: sin sobre-ingeniería

---

## 2. SEGURIDAD DE APLICACIÓN

### 2.1 HTTPS/TLS

**Implementación:**

```nginx
# Vercel/Railway manejan SSL automáticamente
# Configuración adicional en nginx (si aplica)

server {
    listen 443 ssl http2;
    server_name comparador.com;
    
    # Certificado SSL (Let's Encrypt)
    ssl_certificate /etc/letsencrypt/live/comparador.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/comparador.com/privkey.pem;
    
    # Configuración SSL moderna
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;
    
    # HSTS
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
}

# Redirigir HTTP a HTTPS
server {
    listen 80;
    server_name comparador.com;
    return 301 https://$server_name$request_uri;
}
```

**Verificación:**
```bash
# Test SSL configuration
curl -I https://comparador.com

# Esperado:
HTTP/2 200
strict-transport-security: max-age=31536000
```

---

### 2.2 Headers de Seguridad

**Implementación en Express:**

```typescript
// middleware/security-headers.ts
import helmet from 'helmet';

export const securityHeaders = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: [
        "'self'",
        "'unsafe-inline'", // Para inline scripts (minimizar)
        "https://www.googletagmanager.com",
        "https://www.google-analytics.com"
      ],
      styleSrc: [
        "'self'",
        "'unsafe-inline'", // Para Tailwind
        "https://fonts.googleapis.com"
      ],
      imgSrc: [
        "'self'",
        "data:",
        "https:", // Para logos de entidades
      ],
      connectSrc: [
        "'self'",
        "https://www.google-analytics.com"
      ],
      fontSrc: [
        "'self'",
        "https://fonts.gstatic.com"
      ],
      frameSrc: ["'none'"],
      objectSrc: ["'none'"]
    }
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  },
  noSniff: true,
  xssFilter: true,
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' }
});

// Uso en app
app.use(securityHeaders);
```

**Headers Adicionales:**

```typescript
app.use((req, res, next) => {
  // Prevenir clickjacking
  res.setHeader('X-Frame-Options', 'DENY');
  
  // Prevenir MIME sniffing
  res.setHeader('X-Content-Type-Options', 'nosniff');
  
  // XSS protection (legacy)
  res.setHeader('X-XSS-Protection', '1; mode=block');
  
  // Permissions Policy
  res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
  
  next();
});
```

---

### 2.3 CORS

**Configuración:**

```typescript
import cors from 'cors';

const corsOptions = {
  origin: (origin, callback) => {
    const allowedOrigins = [
      'https://comparador.com',
      'https://www.comparador.com'
    ];
    
    // En desarrollo
    if (process.env.NODE_ENV === 'development') {
      allowedOrigins.push('http://localhost:5173');
    }
    
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
```

---

### 2.4 Rate Limiting

**Implementación:**

```typescript
import rateLimit from 'express-rate-limit';

// Rate limiter general
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // 100 requests
  message: 'Demasiadas solicitudes, intenta más tarde',
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      error: {
        code: 'RATE_LIMIT_EXCEEDED',
        message: 'Demasiadas solicitudes. Por favor, espera un momento.',
        retryAfter: req.rateLimit.resetTime
      }
    });
  }
});

// Rate limiter específico para comparación
const comparacionLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minuto
  max: 10, // 10 comparaciones por minuto
  keyGenerator: (req) => {
    // Por IP o sessionId
    return req.ip || req.cookies.sessionId;
  }
});

// Rate limiter para scraping (admin)
const scrapingLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hora
  max: 5, // 5 ejecuciones por hora
  skipSuccessfulRequests: false
});

// Aplicar en rutas
app.use('/api/', generalLimiter);
app.use('/api/v1/comparacion', comparacionLimiter);
app.use('/api/v1/admin/scraping', scrapingLimiter);
```

---

### 2.5 Sanitización de Inputs

**Prevención de XSS:**

```typescript
import DOMPurify from 'isomorphic-dompurify';
import validator from 'validator';

// Sanitización de strings
export const sanitizeString = (input: string): string => {
  return DOMPurify.sanitize(input, {
    ALLOWED_TAGS: [], // No HTML
    ALLOWED_ATTR: []
  }).trim();
};

// Validación de inputs
export const validateComparacionInput = (data: any) => {
  const errors: string[] = [];
  
  // Monto
  if (!validator.isNumeric(String(data.montoSolicitado))) {
    errors.push('Monto inválido');
  }
  const monto = Number(data.montoSolicitado);
  if (monto < 1000000 || monto > 100000000) {
    errors.push('Monto fuera de rango');
  }
  
  // Plazo
  if (!validator.isInt(String(data.plazoMeses), { min: 6, max: 84 })) {
    errors.push('Plazo inválido');
  }
  
  // Ingresos
  if (!validator.isNumeric(String(data.ingresos))) {
    errors.push('Ingresos inválidos');
  }
  
  // Tipo empleo
  const tiposValidos = ['dependiente', 'independiente', 'pensionado'];
  if (!tiposValidos.includes(data.tipoEmpleo)) {
    errors.push('Tipo de empleo inválido');
  }
  
  if (errors.length > 0) {
    throw new ValidationError('Datos inválidos', errors);
  }
  
  return {
    montoSolicitado: monto,
    plazoMeses: Number(data.plazoMeses),
    ingresos: Number(data.ingresos),
    tipoEmpleo: sanitizeString(data.tipoEmpleo)
  };
};
```

**Prevención de SQL Injection:**

```typescript
// Prisma previene SQL injection automáticamente
// ✅ Seguro - Prisma usa prepared statements
const productos = await prisma.producto.findMany({
  where: {
    montoMinimo: { lte: monto },
    montoMaximo: { gte: monto }
  }
});

// ❌ NUNCA hacer raw queries con input de usuario
// const productos = await prisma.$queryRaw`
//   SELECT * FROM productos WHERE monto = ${monto}
// `;
```

---

### 2.6 Autenticación (Futuro - Post-MVP)

**JWT Implementation:**

```typescript
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_EXPIRES_IN = '1h';
const REFRESH_TOKEN_EXPIRES_IN = '7d';

// Generar tokens
export const generateTokens = (userId: string, email: string) => {
  const accessToken = jwt.sign(
    { userId, email, type: 'access' },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
  
  const refreshToken = jwt.sign(
    { userId, email, type: 'refresh' },
    JWT_SECRET,
    { expiresIn: REFRESH_TOKEN_EXPIRES_IN }
  );
  
  return { accessToken, refreshToken };
};

// Verificar token
export const verifyToken = (token: string): JWTPayload => {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
  } catch (error) {
    throw new UnauthorizedError('Token inválido o expirado');
  }
};

// Middleware de autenticación
export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      throw new UnauthorizedError('Token no proporcionado');
    }
    
    const payload = verifyToken(token);
    req.user = payload;
    
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      error: {
        code: 'UNAUTHORIZED',
        message: 'No autorizado'
      }
    });
  }
};

// Hash de passwords
export const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

export const comparePassword = async (
  password: string,
  hash: string
): Promise<boolean> => {
  return bcrypt.compare(password, hash);
};
```

---

### 2.7 Protección de Datos Sensibles

**Variables de Entorno:**

```bash
# .env (NUNCA commitear a git)
DATABASE_URL="postgresql://user:password@localhost:5432/comparador"
JWT_SECRET="super-secret-key-change-in-production"
ENCRYPTION_KEY="32-byte-hex-key-for-aes-256"

# API Keys
GOOGLE_ANALYTICS_ID="G-XXXXXXXXXX"
SENTRY_DSN="https://xxx@sentry.io/xxx"

# Email
SENDGRID_API_KEY="SG.xxx"

# Ambiente
NODE_ENV="production"
```

**.env.example (SÍ commitear):**

```bash
# Database
DATABASE_URL="postgresql://user:pass@localhost:5432/dbname"

# JWT
JWT_SECRET="your-secret-key-here"

# Encryption
ENCRYPTION_KEY="your-32-byte-hex-key"

# APIs
GOOGLE_ANALYTICS_ID="G-XXXXXXXXXX"

# Environment
NODE_ENV="development"
```

**Validación de env variables:**

```typescript
import { z } from 'zod';

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  JWT_SECRET: z.string().min(32),
  ENCRYPTION_KEY: z.string().length(64), // 32 bytes en hex
  NODE_ENV: z.enum(['development', 'production', 'test']),
  PORT: z.string().transform(Number).default('4000')
});

export const env = envSchema.parse(process.env);
```

---

## 3. SEGURIDAD DE BASE DE DATOS

### 3.1 Configuración PostgreSQL

```sql
-- Crear usuario con permisos limitados
CREATE USER comparador_app WITH PASSWORD 'strong-password';

-- Otorgar permisos solo a schema específico
GRANT CONNECT ON DATABASE comparador TO comparador_app;
GRANT USAGE ON SCHEMA public TO comparador_app;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO comparador_app;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO comparador_app;

-- Prevenir DROP, TRUNCATE
REVOKE CREATE ON SCHEMA public FROM comparador_app;
```

### 3.2 Backups

**Script de Backup Diario:**

```bash
#!/bin/bash
# backup-db.sh

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups"
DB_NAME="comparador"

# Crear backup
pg_dump $DATABASE_URL -F c -f "$BACKUP_DIR/backup_$DATE.dump"

# Comprimir
gzip "$BACKUP_DIR/backup_$DATE.dump"

# Mantener solo últimos 30 días
find $BACKUP_DIR -name "backup_*.dump.gz" -mtime +30 -delete

# Upload a S3 (opcional)
# aws s3 cp "$BACKUP_DIR/backup_$DATE.dump.gz" s3://bucket/backups/
```

**Cron job:**

```bash
# Ejecutar diariamente a las 3 AM
0 3 * * * /scripts/backup-db.sh
```

---

### 3.3 Encriptación de Datos Sensibles (Futuro)

**Para cuando se implementen leads:**

```typescript
import crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const KEY = Buffer.from(process.env.ENCRYPTION_KEY!, 'hex');

// Encriptar
export const encrypt = (text: string): string => {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(ALGORITHM, KEY, iv);
  
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  const authTag = cipher.getAuthTag();
  
  // Formato: iv:authTag:encrypted
  return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted}`;
};

// Desencriptar
export const decrypt = (encryptedText: string): string => {
  const [ivHex, authTagHex, encrypted] = encryptedText.split(':');
  
  const iv = Buffer.from(ivHex, 'hex');
  const authTag = Buffer.from(authTagHex, 'hex');
  
  const decipher = crypto.createDecipheriv(ALGORITHM, KEY, iv);
  decipher.setAuthTag(authTag);
  
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  
  return decrypted;
};

// Uso en modelo
class Lead {
  async create(data: LeadData) {
    return prisma.lead.create({
      data: {
        ...data,
        numeroDocumento: encrypt(data.numeroDocumento),
        telefono: encrypt(data.telefono),
        email: encrypt(data.email)
      }
    });
  }
}
```

---

## 4. COMPLIANCE Y LEGAL

### 4.1 GDPR (Reglamento General de Protección de Datos)

**Aunque es regulación europea, es buena práctica aplicarla:**

**Principios:**

1. **Licitud, lealtad y transparencia**
   - Informar claramente qué datos se recopilan
   - Para qué se usan
   - Con quién se comparten

2. **Limitación de la finalidad**
   - Usar datos solo para el propósito declarado

3. **Minimización de datos**
   - Recopilar solo lo necesario

4. **Exactitud**
   - Mantener datos actualizados

5. **Limitación del plazo de conservación**
   - No guardar datos indefinidamente

6. **Integridad y confidencialidad**
   - Proteger contra acceso no autorizado

**Implementación:**

```typescript
// Política de privacidad en DB
model PoliticaPrivacidad {
  id          String   @id @default(uuid())
  version     String
  contenido   String   @db.Text
  vigenciaDesde DateTime
  activa      Boolean  @default(true)
  createdAt   DateTime @default(now())
  
  @@map("politicas_privacidad")
}

// Consentimientos de usuario (futuro)
model Consentimiento {
  id                  String   @id @default(uuid())
  usuarioId           String
  
  aceptaTerminos      Boolean
  aceptaPrivacidad    Boolean
  aceptaMarketing     Boolean
  
  ipAddress           String
  userAgent           String
  fecha               DateTime @default(now())
  
  politicaId          String
  politica            PoliticaPrivacidad @relation(fields: [politicaId], references: [id])
  
  @@map("consentimientos")
}
```

---

### 4.2 Ley 1581 de 2012 (Colombia - Habeas Data)

**Aplicable para datos personales en Colombia:**

**Requerimientos:**

1. **Autorización**
   - Consentimiento previo, expreso e informado

2. **Finalidad**
   - Informar para qué se usan los datos

3. **Acceso y rectificación**
   - Usuarios pueden consultar y corregir sus datos

4. **Seguridad**
   - Proteger contra pérdida, consulta, uso no autorizado

**Política de Tratamiento de Datos:**

```markdown
# POLÍTICA DE TRATAMIENTO DE DATOS PERSONALES

**Responsable:** Comparador Financiero
**NIT:** XXX.XXX.XXX-X
**Dirección:** Calle XX #XX-XX, Bogotá
**Email:** privacidad@comparador.com

## 1. Datos Recopilados

En el MVP, NO recopilamos datos personales identificables.
Solo recopilamos datos anónimos de navegación:
- Tipo de dispositivo
- Navegador
- Tiempo en sitio
- Páginas visitadas

## 2. Finalidad

Los datos anónimos se usan para:
- Mejorar la experiencia de usuario
- Entender qué productos son más buscados
- Optimizar el servicio

## 3. Cookies

Usamos cookies técnicas necesarias para:
- Mantener sesión durante navegación
- Recordar preferencias

NO usamos cookies de terceros para publicidad.

## 4. Derechos

Tienes derecho a:
- Conocer qué datos tenemos
- Actualizar datos incorrectos
- Solicitar eliminación de datos
- Revocar consentimiento

Para ejercer derechos: privacidad@comparador.com

## 5. Seguridad

Implementamos medidas técnicas y organizativas
para proteger los datos contra acceso no autorizado.

## 6. Compartir Datos

NO compartimos datos personales con terceros.
Cuando hagas clic en "Solicitar", serás redirigido
al sitio de la entidad financiera.

## 7. Cambios

Notificaremos cambios en esta política mediante
aviso en el sitio web.

**Última actualización:** 12 Septiembre 2026
```

---

### 4.3 Términos y Condiciones

```markdown
# TÉRMINOS Y CONDICIONES DE USO

**Última actualización:** 12 Septiembre 2026

## 1. Aceptación

Al usar este sitio, aceptas estos términos.

## 2. Servicio

Comparador Financiero es una plataforma informativa
que compara productos financieros de diferentes entidades.

## 3. Información Mostrada

- Las tasas y condiciones son referenciales
- Obtenidas de sitios web públicos de entidades
- Actualizadas diariamente mediante scraping automático
- Pueden variar sin previo aviso

## 4. NO Somos Entidad Financiera

- NO otorgamos créditos
- NO intermediamos solicitudes
- NO garantizamos aprobación
- Solo comparamos y redirigimos

## 5. Responsabilidad

NO somos responsables por:
- Decisiones financieras tomadas
- Cambios en condiciones de entidades
- Problemas con entidades financieras
- Rechazo de solicitudes

## 6. Uso Apropiado

NO puedes:
- Hacer scraping de nuestro sitio
- Sobrecargar nuestros servidores
- Usar datos con fines comerciales
- Crear productos derivados

## 7. Propiedad Intelectual

El contenido y diseño son propiedad de Comparador Financiero.
Los logos de entidades pertenecen a sus respectivos dueños.

## 8. Disclaimer

Este sitio NO sustituye asesoría financiera profesional.
Te recomendamos consultar con un experto antes de decidir.

## 9. Ley Aplicable

Estos términos se rigen por leyes de Colombia.
Jurisdicción: Bogotá D.C.

## 10. Contacto

Para dudas: soporte@comparador.com
```

---

### 4.4 Disclaimer en UI

**En todas las páginas (footer):**

```tsx
<Disclaimer>
  ⚠️ Las tasas y condiciones son referenciales y pueden variar.
  Valida directamente con la entidad antes de solicitar.
  No somos una entidad financiera ni intermediamos créditos.
</Disclaimer>
```

**En página de resultados:**

```tsx
<DisclaimerBox>
  <Icon>ℹ️</Icon>
  <Text>
    <strong>Importante:</strong> Los cálculos son estimados. 
    La aprobación y condiciones finales dependen de cada entidad.
    Datos actualizados el: {fechaActualizacion}
  </Text>
</DisclaimerBox>
```

---

## 5. WEB SCRAPING LEGAL

### 5.1 Buenas Prácticas

**Cumplimiento:**

1. **robots.txt**
   - Respetar directivas de cada sitio
   - No scrapear áreas prohibidas

2. **Rate Limiting**
   - No sobrecargar servidores
   - Espaciar requests (2-5 segundos)
   - Horarios de bajo tráfico (madrugada)

3. **User Agent**
   - Identificarse claramente
   - Proveer contacto

4. **Datos Públicos Only**
   - Solo información pública
   - No áreas con login
   - No datos personales

**Implementación:**

```typescript
// Verificar robots.txt
import robotsParser from 'robots-parser';

const checkRobots = async (url: string): Promise<boolean> => {
  const robotsUrl = new URL('/robots.txt', url).href;
  const response = await fetch(robotsUrl);
  const robotsTxt = await response.text();
  
  const robots = robotsParser(robotsUrl, robotsTxt);
  const allowed = robots.isAllowed(url, 'ComparadorBot/1.0');
  
  if (!allowed) {
    console.warn(`❌ Robots.txt no permite scrapear: ${url}`);
  }
  
  return allowed;
};

// User Agent
const USER_AGENT = 'ComparadorBot/1.0 (+https://comparador.com/bot; soporte@comparador.com)';

// Uso
await page.setUserAgent(USER_AGENT);

// Rate limiting
await delay(randomBetween(2000, 5000)); // 2-5 segundos
```

### 5.2 Fair Use

**Argumentos legales:**

1. **Propósito:** Informativo y educativo
2. **Naturaleza:** Datos públicos (tasas publicadas)
3. **Cantidad:** Solo información necesaria
4. **Efecto:** No afecta mercado de entidades (les genera tráfico)

**Mitigación de Riesgos:**

```typescript
// Página informativa sobre bot
// https://comparador.com/bot

export const BotInfoPage = () => (
  <Layout>
    <h1>ComparadorBot</h1>
    
    <section>
      <h2>¿Qué hace?</h2>
      <p>
        Nuestro bot recopila información pública de productos
        financieros para ofrecer comparaciones a usuarios.
      </p>
    </section>
    
    <section>
      <h2>¿Qué recopilamos?</h2>
      <ul>
        <li>Tasas de interés publicadas</li>
        <li>Montos y plazos disponibles</li>
        <li>Requisitos generales</li>
      </ul>
      <p>
        NO recopilamos datos personales de usuarios
        ni información privada.
      </p>
    </section>
    
    <section>
      <h2>Frecuencia</h2>
      <p>
        Actualizamos datos una vez al día, durante
        la madrugada para minimizar impacto en servidores.
      </p>
    </section>
    
    <section>
      <h2>¿Eres una entidad financiera?</h2>
      <p>
        Si prefieres que no scrapeemos tu sitio,
        contáctanos: soporte@comparador.com
      </p>
      <p>
        También puedes bloquearnos en robots.txt:
      </p>
      <Code>
        User-agent: ComparadorBot{'\n'}
        Disallow: /
      </Code>
    </section>
    
    <section>
      <h2>Contacto</h2>
      <p>Email: soporte@comparador.com</p>
    </section>
  </Layout>
);
```

---

## 6. LOGGING Y AUDITORÍA

### 6.1 Logging Estructurado

```typescript
import winston from 'winston';

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { 
    service: 'comparador-api',
    environment: process.env.NODE_ENV
  },
  transports: [
    // Errores a archivo
    new winston.transports.File({ 
      filename: 'logs/error.log', 
      level: 'error',
      maxsize: 10485760, // 10MB
      maxFiles: 5
    }),
    
    // Todo a archivo
    new winston.transports.File({ 
      filename: 'logs/combined.log',
      maxsize: 10485760,
      maxFiles: 5
    })
  ]
});

// Console en desarrollo
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    )
  }));
}

// Uso
logger.info('Comparación realizada', {
  sessionId: 'sess_abc',
  monto: 30000000,
  plazo: 36,
  ofertas: 5,
  duracionMs: 850
});

logger.error('Error en scraping', {
  entidad: 'Bancolombia',
  error: error.message,
  stack: error.stack
});
```

### 6.2 Monitoreo de Errores

**Sentry Integration:**

```typescript
import * as Sentry from '@sentry/node';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
  
  beforeSend(event, hint) {
    // Filtrar datos sensibles
    if (event.request) {
      delete event.request.cookies;
      delete event.request.headers?.authorization;
    }
    return event;
  }
});

// Middleware
app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.errorHandler());

// Capturar errores
try {
  await compararOfertas();
} catch (error) {
  Sentry.captureException(error, {
    tags: {
      module: 'comparacion'
    },
    extra: {
      monto: 30000000,
      plazo: 36
    }
  });
  throw error;
}
```

---

## 7. DISASTER RECOVERY

### 7.1 Plan de Contingencia

**RPO (Recovery Point Objective):** 24 horas
- Backup diario de BD
- Pérdida máxima: 1 día de datos

**RTO (Recovery Time Objective):** 4 horas
- Tiempo máximo para restaurar servicio

**Procedimiento de Recuperación:**

```bash
#!/bin/bash
# disaster-recovery.sh

# 1. Restaurar BD desde backup
pg_restore -d comparador /backups/latest.dump

# 2. Verificar integridad
psql -d comparador -c "SELECT COUNT(*) FROM productos;"

# 3. Reiniciar servicios
pm2 restart all

# 4. Verificar salud
curl https://comparador.com/health

# 5. Notificar
echo "Sistema restaurado" | mail -s "DR Complete" admin@comparador.com
```

---

## 8. CHECKLIST DE SEGURIDAD

### 8.1 Pre-Launch

**Infraestructura:**
- [ ] HTTPS configurado con certificado válido
- [ ] Headers de seguridad implementados
- [ ] CORS configurado correctamente
- [ ] Rate limiting activo
- [ ] Backups automáticos configurados

**Aplicación:**
- [ ] Input validation en todas las APIs
- [ ] SQL injection prevenido (Prisma)
- [ ] XSS prevención implementada
- [ ] CSRF tokens (si aplica)
- [ ] Error handling sin exponer detalles internos

**Datos:**
- [ ] Variables de entorno seguras
- [ ] Secrets no commiteados en git
- [ ] .gitignore configurado
- [ ] Base de datos con usuario limitado

**Legal:**
- [ ] Términos y condiciones publicados
- [ ] Política de privacidad publicada
- [ ] Disclaimer visible
- [ ] Página de info del bot (/bot)

**Monitoring:**
- [ ] Logging estructurado activo
- [ ] Sentry configurado
- [ ] Alertas de errores
- [ ] Health check endpoint

### 8.2 Post-Launch

**Mensual:**
- [ ] Revisar logs de errores
- [ ] Verificar backups
- [ ] Actualizar dependencias
- [ ] Revisar vulnerabilidades (npm audit)

**Trimestral:**
- [ ] Revisar políticas de privacidad
- [ ] Actualizar términos si es necesario
- [ ] Pruebas de penetración básicas
- [ ] Revisar configuración de seguridad

---

## 9. CONTACTOS Y RESPONSABILIDADES

```typescript
// Directorio de contactos de seguridad
const SECURITY_CONTACTS = {
  responsableSeguridad: {
    nombre: 'Tu Nombre',
    email: 'seguridad@comparador.com',
    telefono: '+57 XXX XXX XXXX'
  },
  
  responsablePrivacidad: {
    nombre: 'Tu Nombre',
    email: 'privacidad@comparador.com'
  },
  
  reporteVulnerabilidades: {
    email: 'security@comparador.com',
    procedimiento: 'Enviar email con detalles. Respuesta en 48h.'
  }
};
```

---

## 10. PRÓXIMOS PASOS

✅ **Completado:** Todos los documentos de especificación SDD

### Documentos Creados:
1. ✅ Requerimientos funcionales y no funcionales
2. ✅ Arquitectura del sistema
3. ✅ Modelo de datos
4. ✅ Algoritmos de comparación
5. ✅ APIs y contratos
6. ✅ Sistema de web scraping
7. ✅ UX/UI y flujos
8. ✅ Monetización y tracking
9. ✅ Seguridad y compliance

### ¡Listo para Implementación!

**Siguiente Fase:** Desarrollo del código
- Setup de proyectos
- Implementación de scrapers
- Desarrollo de APIs
- Creación de UI
- Testing y deploy

---

**Documento creado por:** Sistema SDD  
**Estado:** Especificación completa ✅
