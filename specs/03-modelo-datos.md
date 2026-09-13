# Modelo de Datos y Entidades
## Plataforma de Comparación Financiera

**Proyecto:** Comparador de Productos Financieros  
**Versión:** 1.0  
**Fecha:** Septiembre 2026  

---

## 1. DIAGRAMA ENTIDAD-RELACIÓN (ERD)

```
┌─────────────────┐         ┌─────────────────┐         ┌─────────────────┐
│    Usuario      │         │   Simulacion    │         │   EntidadFinan  │
│─────────────────│         │─────────────────│         │─────────────────│
│ id (PK)         │────────<│ usuarioId (FK)  │         │ id (PK)         │
│ email           │     1:N │ id (PK)         │         │ nombre          │
│ passwordHash    │         │ fecha           │         │ tipo            │
│ nombres         │         │ montoSolicitado │         │ logo            │
│ apellidos       │         │ plazoMeses      │         │ descripcion     │
│ telefono        │         │ resultado JSON  │         │ activo          │
│ tipoDocumento   │         │ ...             │         │ webhookUrl      │
│ numeroDocumento │         └─────────────────┘         │ apiKey          │
│ fechaRegistro   │                                     │ contacto        │
│ ultimoAcceso    │                                     │ direccion       │
│ rol             │                                     └────────┬────────┘
└────────┬────────┘                                              │
         │                                                       │
         │ 1:N                                                   │ 1:N
         │                                                       │
         ▼                                                       ▼
┌─────────────────┐         ┌─────────────────┐         ┌─────────────────┐
│      Lead       │         │  Producto       │         │  UsuarioEntidad │
│─────────────────│         │─────────────────│         │─────────────────│
│ id (PK)         │         │ id (PK)         │<────────│ id (PK)         │
│ usuarioId (FK)  │         │ entidadId (FK)  │  1:N    │ entidadId (FK)  │
│ entidadId (FK)  │────────>│ tipo            │         │ userId          │
│ productoId (FK) │   N:1   │ nombre          │         │ email           │
│ nombres         │         │ descripcion     │         │ rol             │
│ apellidos       │         │ montoMinimo     │         │ permisos        │
│ email           │         │ montoMaximo     │         │ activo          │
│ telefono        │         │ plazoMinimo     │         └─────────────────┘
│ numeroDocumento │         │ plazoMaximo     │
│ montoSolicitado │         │ tasaMensual     │
│ plazoMeses      │         │ tasaEA          │
│ ingresos        │         │ ingresoMinimo   │         ┌─────────────────┐
│ estado          │         │ edadMinima      │         │  CostoProducto  │
│ fechaCreacion   │         │ edadMaxima      │         │─────────────────│
│ origen          │         │ activo          │<────────│ id (PK)         │
│ modeloCobro     │         │ destacado       │  1:N    │ productoId (FK) │
│ costoLead       │         │ patrocinado     │         │ tipo            │
│ comisionEst     │         │ tiempoAprobacion│         │ nombre          │
└────────┬────────┘         │ procesoDigital  │         │ valor           │
         │                  │ ...             │         │ porcentaje      │
         │                  └────────┬────────┘         │ descripcion     │
         │                           │                  └─────────────────┘
         │ 1:N                       │ 1:N
         │                           │
         ▼                           ▼
┌─────────────────┐         ┌─────────────────┐         ┌─────────────────┐
│ EventoTracking  │         │  RequisitoProd  │         │  Configuracion  │
│─────────────────│         │─────────────────│         │─────────────────│
│ id (PK)         │         │ id (PK)         │         │ id (PK)         │
│ leadId (FK)     │         │ productoId (FK) │         │ clave           │
│ tipoEvento      │         │ tipo            │         │ valor           │
│ fecha           │         │ descripcion     │         │ descripcion     │
│ metadata JSON   │         │ obligatorio     │         │ categoria       │
│ ipAddress       │         │ orden           │         └─────────────────┘
│ userAgent       │         └─────────────────┘
└─────────────────┘

                            ┌─────────────────┐
                            │  AuditoriaLead  │
                            │─────────────────│
                            │ id (PK)         │
                            │ leadId (FK)     │
                            │ campo           │
                            │ valorAnterior   │
                            │ valorNuevo      │
                            │ fecha           │
                            │ usuarioId       │
                            └─────────────────┘
```

---

## 2. ENTIDADES PRINCIPALES

### 2.1 Usuario (Usuario Final - B2C)

**Descripción:** Persona que busca comparar y solicitar productos financieros.

```typescript
interface Usuario {
  // Identificación
  id: string;                    // UUID
  email: string;                 // Único, índice
  emailVerificado: boolean;
  passwordHash: string;          // bcrypt
  
  // Datos personales
  nombres: string;
  apellidos: string;
  tipoDocumento: 'CC' | 'CE' | 'PAS' | 'NIT';
  numeroDocumento: string;       // Encriptado, único
  fechaNacimiento?: Date;
  genero?: 'M' | 'F' | 'Otro' | 'NoEspecifica';
  
  // Contacto
  telefono: string;              // Encriptado
  ciudad?: string;
  departamento?: string;
  direccion?: string;            // Encriptado
  
  // Información financiera (opcional)
  ingresos?: number;
  tipoEmpleo?: 'dependiente' | 'independiente' | 'pensionado';
  nombreEmpresa?: string;
  cargoActual?: string;
  
  // Sistema
  rol: 'usuario' | 'admin';
  estado: 'activo' | 'inactivo' | 'bloqueado';
  fechaRegistro: Date;
  ultimoAcceso?: Date;
  
  // Preferencias
  notificacionesEmail: boolean;
  notificacionesSMS: boolean;
  
  // Consentimientos
  aceptaTerminos: boolean;
  aceptaPoliticaPrivacidad: boolean;
  aceptaUsoInformacion: boolean;
  fechaAceptacion: Date;
  
  // Metadata
  origenRegistro: string;        // utm_source
  campanaRegistro?: string;      // utm_campaign
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;              // Soft delete
}
```

**Índices:**
```sql
CREATE UNIQUE INDEX idx_usuario_email ON usuarios(email);
CREATE UNIQUE INDEX idx_usuario_documento ON usuarios(numero_documento);
CREATE INDEX idx_usuario_fecha_registro ON usuarios(fecha_registro DESC);
CREATE INDEX idx_usuario_estado ON usuarios(estado);
```

**Validaciones:**
- Email válido y único
- Password mínimo 8 caracteres
- Número de documento según tipo
- Mayor de 18 años
- Teléfono formato colombiano (3XXXXXXXXX)

---

### 2.2 EntidadFinanciera (Cliente B2B)

**Descripción:** Banco, fintech o cooperativa que ofrece productos financieros.

```typescript
interface EntidadFinanciera {
  // Identificación
  id: string;                    // UUID
  nombre: string;                // Único
  nombreComercial?: string;
  slug: string;                  // URL-friendly, único
  
  // Tipo
  tipo: 'banco' | 'fintech' | 'cooperativa' | 'compania-financiamiento';
  
  // Información corporativa
  nit: string;                   // Único
  razonSocial: string;
  
  // Branding
  logo: string;                  // URL o path
  colorPrincipal?: string;       // HEX
  descripcion: string;           // Markdown
  sitioWeb: string;
  
  // Contacto comercial
  nombreContacto: string;
  emailContacto: string;
  telefonoContacto: string;
  
  // Dirección
  direccion: string;
  ciudad: string;
  departamento: string;
  
  // Integración técnica
  webhookUrl?: string;           // Para enviar leads
  webhookSecret?: string;        // Para firmar requests
  apiKey?: string;               // Para autenticación
  apiEndpoint?: string;          // Si la entidad tiene API
  
  // Configuración de leads
  recibeLeadsPorEmail: boolean;
  emailsRecepcionLeads: string[]; // Array de emails
  recibeLeadsPorWebhook: boolean;
  recibeLeadsPorAPI: boolean;
  
  // Monetización
  presupuestoMensual?: number;   // COP
  presupuestoDisponible?: number;
  costoPorClic: number;          // COP
  costoPorLead: number;          // COP
  comisionPorDesembolso: number; // % del monto
  
  // Estado
  activo: boolean;
  verificado: boolean;           // Admin ha verificado
  destacado: boolean;            // Aparece destacado
  
  // Métricas
  totalLeadsRecibidos: number;
  totalCreditosAprobados: number;
  tasaConversion: number;        // %
  calificacionPromedio?: number; // 1-5 estrellas (futuro)
  
  // Timestamps
  fechaRegistro: Date;
  fechaActivacion?: Date;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}
```

**Índices:**
```sql
CREATE UNIQUE INDEX idx_entidad_nombre ON entidades_financieras(nombre);
CREATE UNIQUE INDEX idx_entidad_slug ON entidades_financieras(slug);
CREATE INDEX idx_entidad_activo ON entidades_financieras(activo);
CREATE INDEX idx_entidad_tipo ON entidades_financieras(tipo);
```

---

### 2.3 Producto (Producto Financiero)

**Descripción:** Producto específico ofrecido por una entidad financiera.

```typescript
interface Producto {
  // Identificación
  id: string;                    // UUID
  entidadId: string;             // FK → EntidadFinanciera
  codigo: string;                // Código interno entidad
  
  // Básico
  tipo: 'libre-inversion' | 'compra-cartera' | 'vehiculo' | 'hipotecario' | 'tarjeta';
  nombre: string;
  descripcion: string;           // Markdown
  
  // Condiciones financieras
  montoMinimo: number;           // COP
  montoMaximo: number;           // COP
  plazoMinimo: number;           // Meses
  plazoMaximo: number;           // Meses
  
  // Tasas
  tasaMensual: number;           // % Mes Vencido
  tasaEfectivaAnual: number;     // % EA
  tipoTasa: 'fija' | 'variable';
  
  // Costos adicionales
  seguroVida: number;            // % sobre saldo
  seguroDesempleo?: number;      // % sobre saldo
  comisionDesembolso?: number;   // COP o %
  comisionEstudio?: number;      // COP
  otrosCostos?: number;          // COP
  
  // Requisitos de elegibilidad
  ingresoMinimo: number;         // COP
  edadMinima: number;            // Años
  edadMaxima: number;            // Años
  
  // Score crediticio
  scoreMinimo?: number;          // 0-999
  prohibeReportes: boolean;      // Centrales de riesgo
  
  // Empleo
  tiposEmpleoPermitidos: ('dependiente' | 'independiente' | 'pensionado')[];
  antiguedadEmpleoMeses?: number;
  
  // Proceso
  tiempoAprobacion: string;      // "24 horas", "48 horas"
  tiempoDesembolso: string;      // "2 horas", "24 horas"
  procesoDigital: boolean;
  requiereFirmaFisica: boolean;
  
  // Características especiales
  preAprobado: boolean;          // Si da pre-aprobación
  desembolsoInmediato: boolean;
  periodoGracia: boolean;
  periodoGraciaMeses?: number;
  
  // Ventajas
  ventajas: string[];            // ["Sin cuota de manejo", "Tasa fija"]
  
  // Restricciones
  restricciones: string[];       // Ciudades, sectores, etc.
  
  // Marketing
  destacado: boolean;
  patrocinado: boolean;
  etiquetas: string[];           // ["Mejor tasa", "Aprobación rápida"]
  
  // Monetización
  costoPorClic: number;          // Override del de entidad
  costoPorLead: number;
  comisionPorDesembolso: number; // %
  
  // Estado
  activo: boolean;
  disponible: boolean;           // Temporalmente no disponible
  
  // Estadísticas
  vecesComparado: number;
  vecesSeleccionado: number;
  leadsGenerados: number;
  tasaConversion: number;        // %
  
  // Timestamps
  fechaCreacion: Date;
  fechaActivacion?: Date;
  createdAt: Date;
  updatedAt: Date;
}
```

**Índices:**
```sql
-- Búsqueda de productos elegibles (query más común)
CREATE INDEX idx_producto_elegibilidad 
ON productos(activo, tipo, monto_minimo, monto_maximo, tasa_mensual)
WHERE activo = true;

-- Por entidad
CREATE INDEX idx_producto_entidad ON productos(entidad_id, activo);

-- Full-text search
CREATE INDEX idx_producto_fulltext 
ON productos USING GIN(to_tsvector('spanish', nombre || ' ' || descripcion));
```

**Validaciones:**
- Monto mínimo < monto máximo
- Plazo mínimo < plazo máximo
- Tasas en rangos válidos (0.5% - 5% MV)
- Edad mínima >= 18
- Score 0-999 si está presente

---

### 2.4 CostoProducto (Costos Detallados)

**Descripción:** Desglose detallado de costos de un producto.

```typescript
interface CostoProducto {
  id: string;
  productoId: string;            // FK → Producto
  
  tipo: 'seguro' | 'comision' | 'gasto-administrativo' | 'otro';
  nombre: string;                // "Seguro de vida", "Comisión de estudio"
  descripcion?: string;
  
  // Valor
  valor?: number;                // Valor fijo en COP
  porcentaje?: number;           // % sobre monto o saldo
  baseCalculo: 'monto-inicial' | 'saldo-pendiente' | 'cuota' | 'fijo';
  
  // Aplicación
  obligatorio: boolean;
  aplicaDesde: number;           // Mes de inicio (0 = desembolso)
  aplicaHasta?: number;          // Mes final (null = todo el plazo)
  frecuencia: 'unica' | 'mensual' | 'anual';
  
  orden: number;                 // Para ordenar en UI
  visible: boolean;              // Mostrar al usuario
  
  createdAt: Date;
  updatedAt: Date;
}
```

**Ejemplo:**
```json
{
  "tipo": "seguro",
  "nombre": "Seguro de vida",
  "porcentaje": 0.054,
  "baseCalculo": "saldo-pendiente",
  "obligatorio": true,
  "frecuencia": "mensual"
}
```

---

### 2.5 RequisitoProducto (Documentos Requeridos)

**Descripción:** Documentos y requisitos necesarios para solicitar un producto.

```typescript
interface RequisitoProducto {
  id: string;
  productoId: string;            // FK → Producto
  
  tipo: 'documento' | 'requisito' | 'condicion';
  
  // Documento
  nombre: string;                // "Cédula", "Certificado laboral"
  descripcion?: string;
  categoria: 'identificacion' | 'ingresos' | 'laboral' | 'crediticia' | 'otro';
  
  // Configuración
  obligatorio: boolean;
  soloParaIndependientes: boolean;
  soloParaDependientes: boolean;
  
  // Especificaciones
  formatosAceptados?: string[];  // ["PDF", "JPG", "PNG"]
  tamanoMaximoMB?: number;
  vigenciaDias?: number;         // Documento no mayor a X días
  
  // UI
  orden: number;
  iconoSugerido?: string;
  instrucciones?: string;        // Cómo obtener el documento
  
  createdAt: Date;
  updatedAt: Date;
}
```

---

### 2.6 Lead (Solicitud de Crédito)

**Descripción:** Usuario que solicitó un producto específico.

```typescript
interface Lead {
  // Identificación
  id: string;                    // UUID
  codigo: string;                // Código visible (LD-2024-001234)
  
  // Referencias
  usuarioId?: string;            // FK → Usuario (si está registrado)
  entidadId: string;             // FK → EntidadFinanciera
  productoId: string;            // FK → Producto
  
  // Datos del solicitante (encriptados)
  nombres: string;
  apellidos: string;
  tipoDocumento: 'CC' | 'CE' | 'PAS';
  numeroDocumento: string;       // Encriptado
  email: string;                 // Encriptado
  telefono: string;              // Encriptado
  
  // Ubicación
  ciudad: string;
  departamento: string;
  direccion?: string;            // Encriptado
  
  // Información financiera
  ingresos: number;              // COP mensuales
  tipoEmpleo: 'dependiente' | 'independiente' | 'pensionado';
  nombreEmpresa?: string;
  cargoActual?: string;
  antiguedadMeses?: number;
  
  // Crédito solicitado
  tipoProducto: 'libre-inversion' | 'compra-cartera';
  montoSolicitado: number;       // COP
  plazoMeses: number;
  destinoCredito?: string;       // "Remodelación", "Educación"
  
  // Específico para compra de cartera
  cantidadDeudas?: number;
  montoTotalDeudas?: number;
  cuotaMensualActual?: number;
  entidadesAConsolidar?: string[]; // Nombres de bancos
  
  // Oferta seleccionada
  tasaOfrecida: number;          // % MV
  tasaEA: number;                // % EA
  cuotaEstimada: number;         // COP mensual
  costoTotalEstimado: number;    // COP
  ahorroEstimado?: number;       // COP vs situación actual
  
  // Estado del lead
  estado: 'nuevo' | 'enviado' | 'contactado' | 'en-evaluacion' | 
          'pre-aprobado' | 'aprobado' | 'desembolsado' | 
          'rechazado' | 'cancelado';
  
  estadoAnterior?: string;
  fechaCambioEstado?: Date;
  motivoRechazo?: string;
  notasEntidad?: string;
  
  // Tracking y origen
  origen: string;                // utm_source
  medio: string;                 // utm_medium
  campana?: string;              // utm_campaign
  contenido?: string;            // utm_content
  termino?: string;              // utm_term
  
  urlOrigen?: string;
  ipAddress: string;
  userAgent: string;
  dispositivo: 'desktop' | 'mobile' | 'tablet';
  
  // Monetización
  modeloCobro: 'CPC' | 'CPL' | 'CPA';
  costoLead: number;             // COP cobrado por este lead
  comisionEstimada: number;      // COP estimados si se aprueba
  comisionReal?: number;         // COP reales una vez aprobado
  facturado: boolean;
  fechaFacturacion?: Date;
  
  // Comunicación
  emailEnviado: boolean;
  fechaEmailEnviado?: Date;
  webhookEnviado: boolean;
  fechaWebhookEnviado?: Date;
  intentosWebhook: number;
  
  // Consentimientos
  aceptaTerminos: boolean;
  aceptaCompartirDatos: boolean;
  aceptaContacto: boolean;
  fechaConsentimiento: Date;
  ipConsentimiento: string;
  
  // Score interno (futuro)
  scoreCalidad?: number;         // 0-100 basado en completitud
  probabilidadAprobacion?: number; // 0-100 ML prediction
  
  // Timestamps
  fechaCreacion: Date;
  fechaEnvio?: Date;
  fechaContacto?: Date;
  fechaAprobacion?: Date;
  fechaDesembolso?: Date;
  
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}
```

**Índices:**
```sql
-- Búsquedas más comunes
CREATE INDEX idx_lead_entidad_fecha ON leads(entidad_id, fecha_creacion DESC);
CREATE INDEX idx_lead_usuario ON leads(usuario_id) WHERE usuario_id IS NOT NULL;
CREATE INDEX idx_lead_estado ON leads(estado, fecha_creacion DESC);
CREATE INDEX idx_lead_codigo ON leads(codigo);

-- Para métricas y reporting
CREATE INDEX idx_lead_fecha_creacion ON leads(fecha_creacion DESC);
CREATE INDEX idx_lead_facturacion ON leads(facturado, modelo_cobro);

-- Para auditoría
CREATE INDEX idx_lead_documento ON leads(numero_documento);
```

**Validaciones:**
- Email y teléfono válidos
- Monto dentro del rango del producto
- Plazo dentro del rango del producto
- Ingresos >= ingreso mínimo del producto
- Todos los consentimientos aceptados

---

### 2.7 Simulacion (Simulaciones de Crédito)

**Descripción:** Historial de simulaciones realizadas por usuarios.

```typescript
interface Simulacion {
  id: string;
  usuarioId?: string;            // FK → Usuario (opcional, puede ser anónimo)
  sessionId: string;             // Para usuarios no registrados
  
  // Parámetros de entrada
  tipoProducto: 'libre-inversion' | 'compra-cartera';
  montoSolicitado: number;
  plazoMeses: number;
  ingresos?: number;
  tipoEmpleo?: 'dependiente' | 'independiente';
  
  // Para compra de cartera
  montoTotalDeudas?: number;
  cuotaMensualActual?: number;
  
  // Resultados (JSON)
  resultado: {
    ofertasEncontradas: number;
    mejorOferta: {
      entidad: string;
      producto: string;
      tasa: number;
      cuota: number;
      costoTotal: number;
    };
    ahorroEstimado?: number;
    ofertas: any[];              // Array completo de ofertas
  };
  
  // Interacción
  ofertaSeleccionada?: string;   // productoId si seleccionó
  convirtioEnLead: boolean;
  leadId?: string;               // FK → Lead si convirtió
  
  // Tracking
  origen: string;
  ipAddress: string;
  userAgent: string;
  
  // Timestamps
  fechaSimulacion: Date;
  duracionSegundos?: number;     // Tiempo que tardó la simulación
  
  createdAt: Date;
}
```

**Índices:**
```sql
CREATE INDEX idx_simulacion_usuario ON simulaciones(usuario_id, fecha_simulacion DESC);
CREATE INDEX idx_simulacion_session ON simulaciones(session_id, fecha_simulacion DESC);
CREATE INDEX idx_simulacion_conversion ON simulaciones(convirtio_en_lead);
CREATE INDEX idx_simulacion_fecha ON simulaciones(fecha_simulacion DESC);
```

**Uso:**
- Analytics de comportamiento
- Tasas de conversión
- Productos más simulados
- Optimización de ofertas

---

### 2.8 EventoTracking (Eventos de Usuario)

**Descripción:** Tracking detallado de eventos para analytics.

```typescript
interface EventoTracking {
  id: string;
  
  // Referencias
  usuarioId?: string;            // FK → Usuario
  leadId?: string;               // FK → Lead
  sessionId: string;             // Session ID único
  
  // Evento
  tipoEvento: 'page_view' | 'click' | 'form_start' | 'form_submit' | 
              'comparison_view' | 'product_click' | 'lead_created' |
              'error' | 'custom';
  
  categoria: string;             // "comparador", "simulador", "leads"
  accion: string;                // "ver_resultados", "aplicar_filtro"
  etiqueta?: string;             // Información adicional
  valor?: number;                // Valor numérico si aplica
  
  // Metadata (JSON flexible)
  metadata: {
    productoId?: string;
    entidadId?: string;
    monto?: number;
    plazo?: number;
    [key: string]: any;
  };
  
  // Contexto
  url: string;
  urlReferrer?: string;
  ipAddress: string;
  userAgent: string;
  dispositivo: 'desktop' | 'mobile' | 'tablet';
  navegador: string;
  sistemaOperativo: string;
  
  // Ubicación (si disponible)
  pais?: string;
  ciudad?: string;
  
  // Timestamps
  fecha: Date;
  createdAt: Date;
}
```

**Índices:**
```sql
CREATE INDEX idx_evento_tipo_fecha ON eventos_tracking(tipo_evento, fecha DESC);
CREATE INDEX idx_evento_usuario ON eventos_tracking(usuario_id, fecha DESC);
CREATE INDEX idx_evento_session ON eventos_tracking(session_id, fecha DESC);
CREATE INDEX idx_evento_lead ON eventos_tracking(lead_id) WHERE lead_id IS NOT NULL;
```

**Eventos Típicos:**
```javascript
// Usuario ve resultados de comparación
{
  tipoEvento: 'comparison_view',
  categoria: 'comparador',
  accion: 'ver_resultados',
  metadata: {
    monto: 30000000,
    plazo: 36,
    ofertasEncontradas: 8
  }
}

// Usuario hace clic en una oferta
{
  tipoEvento: 'product_click',
  categoria: 'comparador',
  accion: 'clic_oferta',
  metadata: {
    productoId: 'prod_123',
    entidadId: 'ent_456',
    posicion: 1,  // Posición en resultados
    patrocinado: true
  }
}

// Usuario crea un lead
{
  tipoEvento: 'lead_created',
  categoria: 'conversion',
  accion: 'solicitud_enviada',
  valor: 30000000,  // Monto solicitado
  metadata: {
    leadId: 'lead_789',
    productoId: 'prod_123',
    tiempoDesdeSimulacion: 120  // segundos
  }
}
```

---

### 2.9 AuditoriaLead (Auditoría de Cambios)

**Descripción:** Historial completo de cambios en leads para compliance.

```typescript
interface AuditoriaLead {
  id: string;
  leadId: string;                // FK → Lead
  
  // Cambio
  campo: string;                 // Nombre del campo modificado
  valorAnterior: string;         // Valor anterior (JSON string)
  valorNuevo: string;            // Valor nuevo (JSON string)
  
  // Responsable
  usuarioId?: string;            // FK → Usuario (admin/entidad)
  tipoUsuario: 'usuario' | 'admin' | 'entidad' | 'sistema';
  email?: string;                // Email del responsable
  
  // Contexto
  accion: 'creacion' | 'actualizacion' | 'eliminacion';
  motivo?: string;               // Razón del cambio
  ipAddress: string;
  userAgent: string;
  
  // Timestamp
  fecha: Date;
  createdAt: Date;
}
```

**Índices:**
```sql
CREATE INDEX idx_auditoria_lead ON auditoria_leads(lead_id, fecha DESC);
CREATE INDEX idx_auditoria_fecha ON auditoria_leads(fecha DESC);
CREATE INDEX idx_auditoria_usuario ON auditoria_leads(usuario_id) WHERE usuario_id IS NOT NULL;
```

---

### 2.10 UsuarioEntidad (Usuarios de Entidades B2B)

**Descripción:** Usuarios que trabajan para entidades financieras y acceden al dashboard.

```typescript
interface UsuarioEntidad {
  id: string;
  entidadId: string;             // FK → EntidadFinanciera
  
  // Credenciales
  email: string;                 // Único
  passwordHash: string;
  emailVerificado: boolean;
  
  // Datos
  nombres: string;
  apellidos: string;
  cargo: string;
  telefono?: string;
  
  // Permisos
  rol: 'admin' | 'gestor' | 'viewer';
  permisos: {
    verLeads: boolean;
    editarLeads: boolean;
    exportarLeads: boolean;
    verMetricas: boolean;
    gestionarProductos: boolean;
    gestionarUsuarios: boolean;
    gestionarFacturacion: boolean;
  };
  
  // Estado
  activo: boolean;
  
  // Seguridad
  requiere2FA: boolean;
  secret2FA?: string;
  ultimoAcceso?: Date;
  intentosLoginFallidos: number;
  bloqueadoHasta?: Date;
  
  // Timestamps
  fechaCreacion: Date;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}
```

---

### 2.11 Configuracion (Configuración Global)

**Descripción:** Configuraciones del sistema.

```typescript
interface Configuracion {
  id: string;
  
  clave: string;                 // Único, ej: "tasa_maxima_permitida"
  valor: string;                 // JSON string
  tipo: 'string' | 'number' | 'boolean' | 'json';
  
  descripcion: string;
  categoria: 'general' | 'financiero' | 'integracion' | 'seguridad';
  
  editable: boolean;             // Si admin puede cambiar
  
  createdAt: Date;
  updatedAt: Date;
}
```

**Ejemplos:**
```json
{
  "clave": "tasa_maxima_permitida_mv",
  "valor": "5.0",
  "tipo": "number",
  "categoria": "financiero"
}

{
  "clave": "monto_maximo_credito",
  "valor": "100000000",
  "tipo": "number",
  "categoria": "financiero"
}

{
  "clave": "email_notificaciones",
  "valor": "[\"admin@ejemplo.com\", \"soporte@ejemplo.com\"]",
  "tipo": "json",
  "categoria": "general"
}
```

---

## 3. SCHEMA PRISMA COMPLETO

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ============================================
// USUARIOS Y AUTENTICACIÓN
// ============================================

model Usuario {
  id                    String    @id @default(uuid())
  email                 String    @unique
  emailVerificado       Boolean   @default(false)
  passwordHash          String
  
  // Datos personales
  nombres               String
  apellidos             String
  tipoDocumento         String    // CC, CE, PAS, NIT
  numeroDocumento       String    @unique // Encriptado
  fechaNacimiento       DateTime?
  genero                String?
  
  // Contacto
  telefono              String    // Encriptado
  ciudad                String?
  departamento          String?
  direccion             String?   // Encriptado
  
  // Financiero
  ingresos              Decimal?  @db.Decimal(15, 2)
  tipoEmpleo            String?
  nombreEmpresa         String?
  cargoActual           String?
  
  // Sistema
  rol                   String    @default("usuario") // usuario, admin
  estado                String    @default("activo")
  ultimoAcceso          DateTime?
  
  // Preferencias
  notificacionesEmail   Boolean   @default(true)
  notificacionesSMS     Boolean   @default(false)
  
  // Consentimientos
  aceptaTerminos        Boolean   @default(false)
  aceptaPoliticaPrivacidad Boolean @default(false)
  aceptaUsoInformacion  Boolean   @default(false)
  fechaAceptacion       DateTime?
  
  // Metadata
  origenRegistro        String?
  campanaRegistro       String?
  
  // Timestamps
  fechaRegistro         DateTime  @default(now())
  createdAt             DateTime  @default(now())
  updatedAt             DateTime  @updatedAt
  deletedAt             DateTime?
  
  // Relaciones
  leads                 Lead[]
  simulaciones          Simulacion[]
  eventosTracking       EventoTracking[]
  
  @@index([email])
  @@index([numeroDocumento])
  @@index([estado])
  @@map("usuarios")
}

// ============================================
// ENTIDADES FINANCIERAS
// ============================================

model EntidadFinanciera {
  id                      String   @id @default(uuid())
  nombre                  String   @unique
  nombreComercial         String?
  slug                    String   @unique
  
  tipo                    String   // banco, fintech, cooperativa
  nit                     String   @unique
  razonSocial             String
  
  // Branding
  logo                    String
  colorPrincipal          String?
  descripcion             String   @db.Text
  sitioWeb                String
  
  // Contacto
  nombreContacto          String
  emailContacto           String
  telefonoContacto        String
  direccion               String
  ciudad                  String
  departamento            String
  
  // Integración
  webhookUrl              String?
  webhookSecret           String?
  apiKey                  String?
  apiEndpoint             String?
  
  // Configuración leads
  recibeLeadsPorEmail     Boolean  @default(true)
  emailsRecepcionLeads    String[]
  recibeLeadsPorWebhook   Boolean  @default(false)
  recibeLeadsPorAPI       Boolean  @default(false)
  
  // Monetización
  presupuestoMensual      Decimal? @db.Decimal(15, 2)
  presupuestoDisponible   Decimal? @db.Decimal(15, 2)
  costoPorClic            Decimal  @db.Decimal(10, 2)
  costoPorLead            Decimal  @db.Decimal(10, 2)
  comisionPorDesembolso   Decimal  @db.Decimal(5, 4) // % decimal
  
  // Estado
  activo                  Boolean  @default(true)
  verificado              Boolean  @default(false)
  destacado               Boolean  @default(false)
  
  // Métricas
  totalLeadsRecibidos     Int      @default(0)
  totalCreditosAprobados  Int      @default(0)
  tasaConversion          Decimal  @default(0) @db.Decimal(5, 2)
  calificacionPromedio    Decimal? @db.Decimal(3, 2)
  
  // Timestamps
  fechaRegistro           DateTime @default(now())
  fechaActivacion         DateTime?
  createdAt               DateTime @default(now())
  updatedAt               DateTime @updatedAt
  deletedAt               DateTime?
  
  // Relaciones
  productos               Producto[]
  leads                   Lead[]
  usuariosEntidad         UsuarioEntidad[]
  
  @@index([activo])
  @@index([tipo])
  @@index([slug])
  @@map("entidades_financieras")
}

// ============================================
// PRODUCTOS
// ============================================

model Producto {
  id                      String   @id @default(uuid())
  entidadId               String
  codigo                  String
  
  tipo                    String   // libre-inversion, compra-cartera
  nombre                  String
  descripcion             String   @db.Text
  
  // Condiciones
  montoMinimo             Decimal  @db.Decimal(15, 2)
  montoMaximo             Decimal  @db.Decimal(15, 2)
  plazoMinimo             Int
  plazoMaximo             Int
  
  // Tasas
  tasaMensual             Decimal  @db.Decimal(5, 4) // % mes vencido
  tasaEfectivaAnual       Decimal  @db.Decimal(5, 4) // % EA
  tipoTasa                String   @default("fija")
  
  // Costos
  seguroVida              Decimal  @default(0) @db.Decimal(5, 4)
  seguroDesempleo         Decimal? @db.Decimal(5, 4)
  comisionDesembolso      Decimal? @db.Decimal(10, 2)
  comisionEstudio         Decimal? @db.Decimal(10, 2)
  otrosCostos             Decimal? @db.Decimal(10, 2)
  
  // Elegibilidad
  ingresoMinimo           Decimal  @db.Decimal(15, 2)
  edadMinima              Int      @default(18)
  edadMaxima              Int      @default(70)
  scoreMinimo             Int?
  prohibeReportes         Boolean  @default(false)
  
  // Empleo
  tiposEmpleoPermitidos   String[]
  antiguedadEmpleoMeses   Int?
  
  // Proceso
  tiempoAprobacion        String
  tiempoDesembolso        String
  procesoDigital          Boolean  @default(true)
  requiereFirmaFisica     Boolean  @default(false)
  
  // Características
  preAprobado             Boolean  @default(false)
  desembolsoInmediato     Boolean  @default(false)
  periodoGracia           Boolean  @default(false)
  periodoGraciaMeses      Int?
  
  ventajas                String[]
  restricciones           String[]
  
  // Marketing
  destacado               Boolean  @default(false)
  patrocinado             Boolean  @default(false)
  etiquetas               String[]
  
  // Monetización
  costoPorClic            Decimal  @db.Decimal(10, 2)
  costoPorLead            Decimal  @db.Decimal(10, 2)
  comisionPorDesembolso   Decimal  @db.Decimal(5, 4)
  
  // Estado
  activo                  Boolean  @default(true)
  disponible              Boolean  @default(true)
  
  // Estadísticas
  vecesComparado          Int      @default(0)
  vecesSeleccionado       Int      @default(0)
  leadsGenerados          Int      @default(0)
  tasaConversion          Decimal  @default(0) @db.Decimal(5, 2)
  
  // Timestamps
  fechaCreacion           DateTime @default(now())
  fechaActivacion         DateTime?
  createdAt               DateTime @default(now())
  updatedAt               DateTime @updatedAt
  
  // Relaciones
  entidad                 EntidadFinanciera @relation(fields: [entidadId], references: [id])
  costos                  CostoProducto[]
  requisitos              RequisitoProducto[]
  leads                   Lead[]
  
  @@index([entidadId, activo])
  @@index([activo, tipo, montoMinimo, montoMaximo, tasaMensual])
  @@map("productos")
}

model CostoProducto {
  id              String   @id @default(uuid())
  productoId      String
  
  tipo            String   // seguro, comision, gasto-administrativo
  nombre          String
  descripcion     String?
  
  valor           Decimal? @db.Decimal(15, 2)
  porcentaje      Decimal? @db.Decimal(5, 4)
  baseCalculo     String   // monto-inicial, saldo-pendiente, cuota, fijo
  
  obligatorio     Boolean  @default(true)
  aplicaDesde     Int      @default(0)
  aplicaHasta     Int?
  frecuencia      String   // unica, mensual, anual
  
  orden           Int      @default(0)
  visible         Boolean  @default(true)
  
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  
  producto        Producto @relation(fields: [productoId], references: [id], onDelete: Cascade)
  
  @@index([productoId])
  @@map("costos_productos")
}

model RequisitoProducto {
  id                      String   @id @default(uuid())
  productoId              String
  
  tipo                    String   // documento, requisito, condicion
  nombre                  String
  descripcion             String?
  categoria               String   // identificacion, ingresos, laboral
  
  obligatorio             Boolean  @default(true)
  soloParaIndependientes  Boolean  @default(false)
  soloParaDependientes    Boolean  @default(false)
  
  formatosAceptados       String[]
  tamanoMaximoMB          Int?
  vigenciaDias            Int?
  
  orden                   Int      @default(0)
  iconoSugerido           String?
  instrucciones           String?  @db.Text
  
  createdAt               DateTime @default(now())
  updatedAt               DateTime @updatedAt
  
  producto                Producto @relation(fields: [productoId], references: [id], onDelete: Cascade)
  
  @@index([productoId])
  @@map("requisitos_productos")
}

// ============================================
// LEADS
// ============================================

model Lead {
  id                      String   @id @default(uuid())
  codigo                  String   @unique
  
  usuarioId               String?
  entidadId               String
  productoId              String
  
  // Datos solicitante (encriptados)
  nombres                 String
  apellidos               String
  tipoDocumento           String
  numeroDocumento         String   // Encriptado
  email                   String   // Encriptado
  telefono                String   // Encriptado
  
  ciudad                  String
  departamento            String
  direccion               String?  // Encriptado
  
  // Financiero
  ingresos                Decimal  @db.Decimal(15, 2)
  tipoEmpleo              String
  nombreEmpresa           String?
  cargoActual             String?
  antiguedadMeses         Int?
  
  // Crédito
  tipoProducto            String
  montoSolicitado         Decimal  @db.Decimal(15, 2)
  plazoMeses              Int
  destinoCredito          String?
  
  // Compra de cartera
  cantidadDeudas          Int?
  montoTotalDeudas        Decimal? @db.Decimal(15, 2)
  cuotaMensualActual      Decimal? @db.Decimal(15, 2)
  entidadesAConsolidar    String[]
  
  // Oferta seleccionada
  tasaOfrecida            Decimal  @db.Decimal(5, 4)
  tasaEA                  Decimal  @db.Decimal(5, 4)
  cuotaEstimada           Decimal  @db.Decimal(15, 2)
  costoTotalEstimado      Decimal  @db.Decimal(15, 2)
  ahorroEstimado          Decimal? @db.Decimal(15, 2)
  
  // Estado
  estado                  String   @default("nuevo")
  estadoAnterior          String?
  fechaCambioEstado       DateTime?
  motivoRechazo           String?
  notasEntidad            String?  @db.Text
  
  // Tracking
  origen                  String
  medio                   String
  campana                 String?
  contenido               String?
  termino                 String?
  urlOrigen               String?
  ipAddress               String
  userAgent               String
  dispositivo             String
  
  // Monetización
  modeloCobro             String
  costoLead               Decimal  @db.Decimal(10, 2)
  comisionEstimada        Decimal  @db.Decimal(15, 2)
  comisionReal            Decimal? @db.Decimal(15, 2)
  facturado               Boolean  @default(false)
  fechaFacturacion        DateTime?
  
  // Comunicación
  emailEnviado            Boolean  @default(false)
  fechaEmailEnviado       DateTime?
  webhookEnviado          Boolean  @default(false)
  fechaWebhookEnviado     DateTime?
  intentosWebhook         Int      @default(0)
  
  // Consentimientos
  aceptaTerminos          Boolean
  aceptaCompartirDatos    Boolean
  aceptaContacto          Boolean
  fechaConsentimiento     DateTime
  ipConsentimiento        String
  
  // Score
  scoreCalidad            Int?
  probabilidadAprobacion  Int?
  
  // Timestamps
  fechaCreacion           DateTime @default(now())
  fechaEnvio              DateTime?
  fechaContacto           DateTime?
  fechaAprobacion         DateTime?
  fechaDesembolso         DateTime?
  
  createdAt               DateTime @default(now())
  updatedAt               DateTime @updatedAt
  deletedAt               DateTime?
  
  // Relaciones
  usuario                 Usuario? @relation(fields: [usuarioId], references: [id])
  entidad                 EntidadFinanciera @relation(fields: [entidadId], references: [id])
  producto                Producto @relation(fields: [productoId], references: [id])
  eventosTracking         EventoTracking[]
  auditorias              AuditoriaLead[]
  
  @@index([entidadId, fechaCreacion])
  @@index([usuarioId])
  @@index([estado, fechaCreacion])
  @@index([codigo])
  @@index([numeroDocumento])
  @@index([facturado, modeloCobro])
  @@map("leads")
}

// ============================================
// SIMULACIONES Y TRACKING
// ============================================

model Simulacion {
  id                  String   @id @default(uuid())
  usuarioId           String?
  sessionId           String
  
  tipoProducto        String
  montoSolicitado     Decimal  @db.Decimal(15, 2)
  plazoMeses          Int
  ingresos            Decimal? @db.Decimal(15, 2)
  tipoEmpleo          String?
  
  montoTotalDeudas    Decimal? @db.Decimal(15, 2)
  cuotaMensualActual  Decimal? @db.Decimal(15, 2)
  
  resultado           Json
  
  ofertaSeleccionada  String?
  convirtioEnLead     Boolean  @default(false)
  leadId              String?
  
  origen              String
  ipAddress           String
  userAgent           String
  
  fechaSimulacion     DateTime @default(now())
  duracionSegundos    Int?
  
  createdAt           DateTime @default(now())
  
  usuario             Usuario? @relation(fields: [usuarioId], references: [id])
  
  @@index([usuarioId, fechaSimulacion])
  @@index([sessionId, fechaSimulacion])
  @@index([convirtioEnLead])
  @@index([fechaSimulacion])
  @@map("simulaciones")
}

model EventoTracking {
  id                String   @id @default(uuid())
  
  usuarioId         String?
  leadId            String?
  sessionId         String
  
  tipoEvento        String
  categoria         String
  accion            String
  etiqueta          String?
  valor             Int?
  
  metadata          Json
  
  url               String
  urlReferrer       String?
  ipAddress         String
  userAgent         String
  dispositivo       String
  navegador         String
  sistemaOperativo  String
  
  pais              String?
  ciudad            String?
  
  fecha             DateTime @default(now())
  createdAt         DateTime @default(now())
  
  usuario           Usuario? @relation(fields: [usuarioId], references: [id])
  lead              Lead?    @relation(fields: [leadId], references: [id])
  
  @@index([tipoEvento, fecha])
  @@index([usuarioId, fecha])
  @@index([sessionId, fecha])
  @@index([leadId])
  @@map("eventos_tracking")
}

model AuditoriaLead {
  id              String   @id @default(uuid())
  leadId          String
  
  campo           String
  valorAnterior   String?
  valorNuevo      String?
  
  usuarioId       String?
  tipoUsuario     String
  email           String?
  
  accion          String
  motivo          String?
  ipAddress       String
  userAgent       String
  
  fecha           DateTime @default(now())
  createdAt       DateTime @default(now())
  
  lead            Lead     @relation(fields: [leadId], references: [id])
  
  @@index([leadId, fecha])
  @@index([fecha])
  @@index([usuarioId])
  @@map("auditoria_leads")
}

// ============================================
// USUARIOS ENTIDADES (B2B)
// ============================================

model UsuarioEntidad {
  id                      String   @id @default(uuid())
  entidadId               String
  
  email                   String   @unique
  passwordHash            String
  emailVerificado         Boolean  @default(false)
  
  nombres                 String
  apellidos               String
  cargo                   String
  telefono                String?
  
  rol                     String   // admin, gestor, viewer
  permisos                Json
  
  activo                  Boolean  @default(true)
  
  requiere2FA             Boolean  @default(false)
  secret2FA               String?
  ultimoAcceso            DateTime?
  intentosLoginFallidos   Int      @default(0)
  bloqueadoHasta          DateTime?
  
  fechaCreacion           DateTime @default(now())
  createdAt               DateTime @default(now())
  updatedAt               DateTime @updatedAt
  deletedAt               DateTime?
  
  entidad                 EntidadFinanciera @relation(fields: [entidadId], references: [id])
  
  @@index([entidadId])
  @@index([email])
  @@map("usuarios_entidades")
}

// ============================================
// CONFIGURACIÓN
// ============================================

model Configuracion {
  id          String   @id @default(uuid())
  
  clave       String   @unique
  valor       String   @db.Text
  tipo        String   // string, number, boolean, json
  
  descripcion String
  categoria   String
  
  editable    Boolean  @default(true)
  
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  @@map("configuraciones")
}
```

---

## 4. MIGRACIONES Y SEEDS

### 4.1 Datos Iniciales (Seed)

```typescript
// prisma/seed.ts

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // 1. Configuraciones iniciales
  await prisma.configuracion.createMany({
    data: [
      {
        clave: 'tasa_maxima_permitida_mv',
        valor: '5.0',
        tipo: 'number',
        descripcion: 'Tasa máxima mensual vencida permitida',
        categoria: 'financiero'
      },
      {
        clave: 'monto_maximo_credito',
        valor: '100000000',
        tipo: 'number',
        descripcion: 'Monto máximo de crédito en COP',
        categoria: 'financiero'
      },
      {
        clave: 'monto_minimo_credito',
        valor: '1000000',
        tipo: 'number',
        descripcion: 'Monto mínimo de crédito en COP',
        categoria: 'financiero'
      }
    ]
  });

  // 2. Usuario administrador
  const adminPassword = await bcrypt.hash('Admin123!', 10);
  const admin = await prisma.usuario.create({
    data: {
      email: 'admin@comparador.com',
      passwordHash: adminPassword,
      emailVerificado: true,
      nombres: 'Administrador',
      apellidos: 'Sistema',
      tipoDocumento: 'CC',
      numeroDocumento: '1234567890', // Debería encriptarse
      telefono: '3001234567', // Debería encriptarse
      rol: 'admin',
      aceptaTerminos: true,
      aceptaPoliticaPrivacidad: true,
      aceptaUsoInformacion: true,
      fechaAceptacion: new Date()
    }
  });

  // 3. Entidades financieras de ejemplo
  const bancoA = await prisma.entidadFinanciera.create({
    data: {
      nombre: 'Banco Ejemplo A',
      slug: 'banco-ejemplo-a',
      tipo: 'banco',
      nit: '800001111',
      razonSocial: 'Banco Ejemplo A S.A.',
      logo: '/logos/banco-a.png',
      descripcion: 'Banco tradicional con amplia cobertura nacional',
      sitioWeb: 'https://www.bancoa.com',
      nombreContacto: 'Juan Pérez',
      emailContacto: 'comercial@bancoa.com',
      telefonoContacto: '3101234567',
      direccion: 'Carrera 7 # 100-50',
      ciudad: 'Bogotá',
      departamento: 'Cundinamarca',
      emailsRecepcionLeads: ['leads@bancoa.com'],
      costoPorClic: 5000,
      costoPorLead: 50000,
      comisionPorDesembolso: 0.01,
      activo: true,
      verificado: true
    }
  });

  const fintechB = await prisma.entidadFinanciera.create({
    data: {
      nombre: 'Fintech Rápida',
      slug: 'fintech-rapida',
      tipo: 'fintech',
      nit: '900002222',
      razonSocial: 'Fintech Rápida S.A.S.',
      logo: '/logos/fintech-b.png',
      descripcion: 'Fintech 100% digital con aprobación en minutos',
      sitioWeb: 'https://www.fintechrapida.com',
      nombreContacto: 'María García',
      emailContacto: 'comercial@fintechrapida.com',
      telefonoContacto: '3209876543',
      direccion: 'Calle 80 # 50-30',
      ciudad: 'Medellín',
      departamento: 'Antioquia',
      emailsRecepcionLeads: ['leads@fintechrapida.com'],
      costoPorClic: 3000,
      costoPorLead: 30000,
      comisionPorDesembolso: 0.015,
      activo: true,
      verificado: true,
      destacado: true
    }
  });

  // 4. Productos de ejemplo
  await prisma.producto.create({
    data: {
      entidadId: bancoA.id,
      codigo: 'CLI-001',
      tipo: 'libre-inversion',
      nombre: 'Crédito Libre Inversión',
      descripcion: 'Crédito de libre inversión con tasa competitiva',
      montoMinimo: 1000000,
      montoMaximo: 50000000,
      plazoMinimo: 12,
      plazoMaximo: 60,
      tasaMensual: 0.015,
      tasaEfectivaAnual: 0.1956,
      seguroVida: 0.00054,
      ingresoMinimo: 2000000,
      tiposEmpleoPermitidos: ['dependiente', 'independiente'],
      tiempoAprobacion: '48 horas',
      tiempoDesembolso: '24 horas',
      procesoDigital: true,
      ventajas: ['Tasa fija', 'Sin cuota de manejo', 'Pre-aprobación en línea'],
      costoPorClic: 5000,
      costoPorLead: 50000,
      comisionPorDesembolso: 0.01,
      activo: true
    }
  });

  await prisma.producto.create({
    data: {
      entidadId: fintechB.id,
      codigo: 'CC-001',
      tipo: 'compra-cartera',
      nombre: 'Compra de Cartera Digital',
      descripcion: 'Consolida tus deudas con la mejor tasa del mercado',
      montoMinimo: 5000000,
      montoMaximo: 100000000,
      plazoMinimo: 24,
      plazoMaximo: 84,
      tasaMensual: 0.012,
      tasaEfectivaAnual: 0.1539,
      seguroVida: 0.00054,
      ingresoMinimo: 3000000,
      tiposEmpleoPermitidos: ['dependiente'],
      tiempoAprobacion: '2 horas',
      tiempoDesembolso: '24 horas',
      procesoDigital: true,
      desembolsoInmediato: true,
      ventajas: ['Aprobación inmediata', '100% digital', 'Sin documentos físicos'],
      costoPorClic: 3000,
      costoPorLead: 30000,
      comisionPorDesembolso: 0.015,
      activo: true,
      destacado: true
    }
  });

  console.log('✅ Seed completado exitosamente');
}

main()
  .catch((e) => {
    console.error('❌ Error en seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

---

## 5. ESTRATEGIA DE DATOS

### 5.1 Encriptación de Datos Sensibles

**Campos a Encriptar:**
- `Usuario.numeroDocumento`
- `Usuario.telefono`
- `Usuario.direccion`
- `Lead.numeroDocumento`
- `Lead.email`
- `Lead.telefono`
- `Lead.direccion`

**Implementación:**
```typescript
// Usar crypto nativo de Node.js con AES-256-GCM
// Almacenar: iv:authTag:encryptedData
// Key almacenada en variable de entorno
```

### 5.2 Índices de Performance

**Queries Más Frecuentes:**
1. Buscar productos elegibles → Índice compuesto
2. Listar leads por entidad → Índice en `entidadId + fecha`
3. Buscar usuario por email → Índice único
4. Tracking de eventos por session → Índice en `sessionId + fecha`

### 5.3 Particionamiento (Futuro)

**Tablas Candidatas:**
- `eventos_tracking` - Por mes
- `simulaciones` - Por mes
- `auditoria_leads` - Por año

### 5.4 Retención de Datos

| Tabla | Retención | Estrategia |
|-------|-----------|------------|
| `usuarios` | Indefinida | Soft delete |
| `leads` | 7 años | Legal requirement |
| `simulaciones` | 2 años | Agregación después |
| `eventos_tracking` | 1 año | Archiving |
| `auditoria_leads` | 10 años | Compliance |

---

## 6. PRÓXIMOS PASOS

✅ **Completado:** Modelo de datos completo  
📋 **Siguiente:** Algoritmos de comparación y simulación

**Documento creado por:** Sistema SDD  
**Próximo documento:** 04-algoritmos-comparacion.md
