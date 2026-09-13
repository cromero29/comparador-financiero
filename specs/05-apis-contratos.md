# APIs y Contratos de Servicios
## Plataforma de Comparación Financiera

**Proyecto:** Comparador de Productos Financieros  
**Versión:** 1.0  
**Fecha:** Septiembre 2026  

---

## 1. VISIÓN GENERAL DE APIs

### 1.1 Principios de Diseño

- **RESTful:** Seguir convenciones REST estándar
- **Versionado:** URLs versionadas (/api/v1/)
- **Consistencia:** Formatos de respuesta uniformes
- **Documentación:** OpenAPI/Swagger completo
- **Seguridad:** Autenticación JWT, rate limiting
- **Performance:** Cache, paginación, compresión

### 1.2 Base URL

```
Desarrollo:  http://localhost:4000/api/v1
Staging:     https://staging-api.comparador.com/api/v1
Producción:  https://api.comparador.com/api/v1
```

### 1.3 Formato de Respuestas

**Respuesta Exitosa:**
```typescript
{
  "success": true,
  "data": { ... },
  "meta": {
    "timestamp": "2026-09-12T10:30:00Z",
    "requestId": "req_abc123"
  }
}
```

**Respuesta con Error:**
```typescript
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Monto solicitado fuera de rango",
    "details": [
      {
        "field": "montoSolicitado",
        "message": "Debe estar entre $1.000.000 y $100.000.000"
      }
    ]
  },
  "meta": {
    "timestamp": "2026-09-12T10:30:00Z",
    "requestId": "req_abc123"
  }
}
```

### 1.4 Códigos de Estado HTTP

| Código | Significado | Uso |
|--------|-------------|-----|
| 200 | OK | Operación exitosa |
| 201 | Created | Recurso creado |
| 400 | Bad Request | Error de validación |
| 401 | Unauthorized | No autenticado |
| 403 | Forbidden | No autorizado |
| 404 | Not Found | Recurso no encontrado |
| 422 | Unprocessable Entity | Error de negocio |
| 429 | Too Many Requests | Rate limit excedido |
| 500 | Internal Server Error | Error del servidor |
| 503 | Service Unavailable | Servicio no disponible |

---

## 2. AUTENTICACIÓN Y AUTORIZACIÓN

### 2.1 Registro de Usuario

**POST** `/api/v1/auth/register`

```typescript
// Request
{
  "email": "usuario@ejemplo.com",
  "password": "Password123!",
  "nombres": "Juan",
  "apellidos": "Pérez",
  "tipoDocumento": "CC",
  "numeroDocumento": "1234567890",
  "telefono": "3001234567",
  "aceptaTerminos": true,
  "aceptaPoliticaPrivacidad": true
}

// Response 201
{
  "success": true,
  "data": {
    "usuario": {
      "id": "usr_abc123",
      "email": "usuario@ejemplo.com",
      "nombres": "Juan",
      "apellidos": "Pérez",
      "rol": "usuario",
      "fechaRegistro": "2026-09-12T10:30:00Z"
    },
    "token": {
      "accessToken": "eyJhbGciOiJIUzI1NiIs...",
      "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
      "expiresIn": 3600,
      "tokenType": "Bearer"
    }
  }
}

// Response 400 - Email ya existe
{
  "success": false,
  "error": {
    "code": "EMAIL_ALREADY_EXISTS",
    "message": "El email ya está registrado"
  }
}
```

### 2.2 Login

**POST** `/api/v1/auth/login`

```typescript
// Request
{
  "email": "usuario@ejemplo.com",
  "password": "Password123!"
}

// Response 200
{
  "success": true,
  "data": {
    "usuario": {
      "id": "usr_abc123",
      "email": "usuario@ejemplo.com",
      "nombres": "Juan",
      "apellidos": "Pérez",
      "rol": "usuario"
    },
    "token": {
      "accessToken": "eyJhbGciOiJIUzI1NiIs...",
      "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
      "expiresIn": 3600,
      "tokenType": "Bearer"
    }
  }
}

// Response 401 - Credenciales inválidas
{
  "success": false,
  "error": {
    "code": "INVALID_CREDENTIALS",
    "message": "Email o contraseña incorrectos"
  }
}
```

### 2.3 Refresh Token

**POST** `/api/v1/auth/refresh`

```typescript
// Request
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}

// Response 200
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
    "expiresIn": 3600
  }
}
```

### 2.4 Headers de Autenticación

```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

---

## 3. API DE COMPARACIÓN

### 3.1 Comparar Ofertas

**POST** `/api/v1/comparacion/comparar`

Endpoint principal para comparar ofertas de crédito.

**Rate Limit:** 10 requests/minuto

```typescript
// Request
{
  "tipoProducto": "libre-inversion",
  "montoSolicitado": 30000000,
  "plazoMeses": 36,
  "ingresos": 5000000,
  "tipoEmpleo": "dependiente",
  "edad": 35,
  "ciudad": "Bogotá"
}

// Response 200
{
  "success": true,
  "data": {
    "solicitud": {
      "tipoProducto": "libre-inversion",
      "montoSolicitado": 30000000,
      "plazoMeses": 36,
      "ingresos": 5000000
    },
    "ofertas": [
      {
        "id": "oferta_1",
        "posicion": 1,
        "producto": {
          "id": "prod_abc123",
          "nombre": "Crédito Digital",
          "tipo": "libre-inversion",
          "descripcion": "Crédito 100% digital..."
        },
        "entidad": {
          "id": "ent_xyz789",
          "nombre": "Fintech Rápida",
          "logo": "/logos/fintech-rapida.png",
          "tipo": "fintech"
        },
        "condiciones": {
          "tasaMensual": 1.2,
          "tasaEfectivaAnual": 15.39,
          "cuotaMensual": 986000,
          "cuotaMensualTotal": 994120,
          "costoTotal": 35796000,
          "tiempoAprobacion": "2 horas",
          "tiempoDesembolso": "24 horas"
        },
        "desglose": {
          "capital": 30000000,
          "intereses": 5504320,
          "seguros": 291680,
          "comisiones": 0,
          "total": 35796000
        },
        "analisis": {
          "relacionCuotaIngreso": 19.9,
          "procesoDigital": true,
          "requiereFirmaFisica": false
        },
        "scores": {
          "total": 92.5,
          "costo": 100,
          "tasa": 100,
          "tiempo": 100,
          "requisitos": 85
        },
        "badges": [
          "Mejor Opción",
          "Tasa Más Baja",
          "100% Digital",
          "Aprobación Rápida"
        ]
      },
      {
        "id": "oferta_2",
        "posicion": 2,
        "producto": { ... },
        "entidad": { ... },
        // ...
      }
    ],
    "resumen": {
      "totalOfertasEncontradas": 8,
      "rangoTasas": {
        "minima": 1.2,
        "maxima": 1.8
      },
      "rangoCuotas": {
        "minima": 986000,
        "maxima": 1098000
      },
      "ahorroVsMasCara": 2032000,
      "tiempoPromedioAprobacion": "24 horas"
    },
    "metadata": {
      "fechaConsulta": "2026-09-12T10:30:00Z",
      "vigenciaHoras": 48,
      "sessionId": "sess_abc123"
    }
  }
}

// Response 400 - Validación
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Errores de validación",
    "details": [
      {
        "field": "montoSolicitado",
        "message": "Debe estar entre $1.000.000 y $100.000.000"
      }
    ]
  }
}

// Response 422 - Sin ofertas
{
  "success": false,
  "error": {
    "code": "NO_OFFERS_FOUND",
    "message": "No se encontraron ofertas elegibles para tu perfil",
    "details": [
      {
        "reason": "insufficient_income",
        "message": "Los ingresos no cumplen con el mínimo requerido"
      }
    ]
  }
}
```

### 3.2 Comparar Compra de Cartera

**POST** `/api/v1/comparacion/compra-cartera`

Endpoint específico para consolidación de deudas.

```typescript
// Request
{
  "montoSolicitado": 25000000,
  "plazoMeses": 48,
  "ingresos": 4000000,
  "tipoEmpleo": "dependiente",
  "deudaActual": {
    "cantidadDeudas": 3,
    "montoTotal": 25000000,
    "cuotaMensualActual": 1500000,
    "entidades": [
      "Banco A - Tarjeta",
      "Banco B - Crédito",
      "Fintech C - Crédito"
    ]
  }
}

// Response 200
{
  "success": true,
  "data": {
    "ofertas": [
      {
        "id": "oferta_1",
        "posicion": 1,
        // ... campos estándar
        "ahorro": {
          "haAhorro": true,
          "cuotaActual": 1500000,
          "cuotaNueva": 1050000,
          "ahorroMensual": 450000,
          "ahorroPorcentual": 30,
          "ahorroTotal": 21600000,
          "mensaje": "Ahorrarás $450.000 mensuales (30%)"
        }
      }
    ],
    "resumen": {
      "mejorAhorro": 450000,
      "ahorroPromedio": 420000,
      "recomendacion": "La consolidación es altamente recomendable"
    }
  }
}
```

### 3.3 Simular Escenarios

**POST** `/api/v1/comparacion/simular`

Simular diferentes montos y plazos sin guardar.

```typescript
// Request
{
  "escenarios": [
    {
      "monto": 30000000,
      "plazo": 36
    },
    {
      "monto": 30000000,
      "plazo": 48
    },
    {
      "monto": 25000000,
      "plazo": 36
    }
  ],
  "tipoProducto": "libre-inversion",
  "ingresos": 5000000,
  "tipoEmpleo": "dependiente"
}

// Response 200
{
  "success": true,
  "data": {
    "comparacion": [
      {
        "escenario": {
          "monto": 30000000,
          "plazo": 36
        },
        "mejorOferta": {
          "entidad": "Fintech Rápida",
          "cuotaMensual": 994120,
          "costoTotal": 35796000
        },
        "ofertasDisponibles": 8
      },
      {
        "escenario": {
          "monto": 30000000,
          "plazo": 48
        },
        "mejorOferta": {
          "entidad": "Fintech Rápida",
          "cuotaMensual": 789250,
          "costoTotal": 37884000
        },
        "ofertasDisponibles": 7
      }
    ],
    "recomendacion": {
      "mejorEscenario": {
        "monto": 30000000,
        "plazo": 36
      },
      "razon": "Menor costo total y cuota manejable (19.9% de ingresos)"
    }
  }
}
```

### 3.4 Obtener Detalle de Oferta

**GET** `/api/v1/comparacion/ofertas/{ofertaId}`

```typescript
// Response 200
{
  "success": true,
  "data": {
    "oferta": {
      // ... datos completos de oferta
      "tablaAmortizacion": [
        {
          "cuota": 1,
          "saldoInicial": 30000000,
          "capital": 592224,
          "interes": 450000,
          "seguro": 16200,
          "cuotaTotal": 1058424,
          "saldoFinal": 29407776
        },
        // ... más cuotas
      ],
      "requisitos": [
        {
          "nombre": "Cédula de ciudadanía",
          "tipo": "documento",
          "obligatorio": true,
          "formatosAceptados": ["PDF", "JPG"],
          "instrucciones": "Ambas caras del documento"
        }
      ]
    }
  }
}
```

---

## 4. API DE PRODUCTOS

### 4.1 Listar Productos

**GET** `/api/v1/productos`

```typescript
// Query params
?tipo=libre-inversion
&entidadId=ent_xyz789
&activo=true
&page=1
&limit=20
&sort=tasaMensual:asc

// Response 200
{
  "success": true,
  "data": {
    "productos": [
      {
        "id": "prod_abc123",
        "nombre": "Crédito Digital",
        "tipo": "libre-inversion",
        "entidad": {
          "id": "ent_xyz789",
          "nombre": "Fintech Rápida",
          "logo": "/logos/fintech-rapida.png"
        },
        "condiciones": {
          "montoMinimo": 1000000,
          "montoMaximo": 50000000,
          "plazoMinimo": 12,
          "plazoMaximo": 60,
          "tasaMensual": 1.2,
          "tasaEfectivaAnual": 15.39
        },
        "caracteristicas": {
          "procesoDigital": true,
          "tiempoAprobacion": "2 horas",
          "destacado": true,
          "patrocinado": false
        }
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 45,
      "totalPages": 3,
      "hasNext": true,
      "hasPrev": false
    }
  }
}
```

### 4.2 Obtener Producto

**GET** `/api/v1/productos/{productoId}`

```typescript
// Response 200
{
  "success": true,
  "data": {
    "producto": {
      "id": "prod_abc123",
      "nombre": "Crédito Digital",
      "descripcion": "Crédito 100% digital...",
      "tipo": "libre-inversion",
      // ... datos completos
      "costos": [
        {
          "tipo": "seguro",
          "nombre": "Seguro de vida",
          "porcentaje": 0.054,
          "obligatorio": true
        }
      ],
      "requisitos": [
        {
          "nombre": "Cédula de ciudadanía",
          "tipo": "documento",
          "obligatorio": true
        }
      ],
      "ventajas": [
        "Tasa fija durante todo el plazo",
        "Sin cuota de manejo",
        "Desembolso en 24 horas"
      ],
      "estadisticas": {
        "vecesComparado": 1250,
        "vecesSeleccionado": 387,
        "tasaConversion": 30.96,
        "calificacionPromedio": 4.7
      }
    }
  }
}
```

---

## 5. API DE ENTIDADES FINANCIERAS

### 5.1 Listar Entidades

**GET** `/api/v1/entidades`

```typescript
// Query params
?tipo=fintech
&activo=true
&destacado=true

// Response 200
{
  "success": true,
  "data": {
    "entidades": [
      {
        "id": "ent_xyz789",
        "nombre": "Fintech Rápida",
        "nombreComercial": "Fintech Rápida",
        "slug": "fintech-rapida",
        "tipo": "fintech",
        "logo": "/logos/fintech-rapida.png",
        "descripcion": "Fintech 100% digital...",
        "sitioWeb": "https://www.fintechrapida.com",
        "estadisticas": {
          "totalProductos": 3,
          "tasaConversionPromedio": 32.5,
          "calificacionPromedio": 4.6,
          "tiempoPromedioAprobacion": "4 horas"
        },
        "destacado": true
      }
    ]
  }
}
```

### 5.2 Obtener Entidad

**GET** `/api/v1/entidades/{entidadId}`

```typescript
// Response 200
{
  "success": true,
  "data": {
    "entidad": {
      "id": "ent_xyz789",
      "nombre": "Fintech Rápida",
      // ... datos completos
      "productos": [
        {
          "id": "prod_abc123",
          "nombre": "Crédito Digital",
          "tipo": "libre-inversion"
        }
      ],
      "estadisticas": {
        "totalLeadsRecibidos": 2450,
        "totalCreditosAprobados": 789,
        "tasaConversion": 32.2
      }
    }
  }
}
```

---

## 6. API DE LEADS

### 6.1 Crear Lead (Solicitar Crédito)

**POST** `/api/v1/leads`

**Rate Limit:** 3 requests/minuto

```typescript
// Request
{
  "productoId": "prod_abc123",
  
  // Datos personales
  "nombres": "Juan",
  "apellidos": "Pérez",
  "tipoDocumento": "CC",
  "numeroDocumento": "1234567890",
  "email": "juan.perez@ejemplo.com",
  "telefono": "3001234567",
  "ciudad": "Bogotá",
  "departamento": "Cundinamarca",
  
  // Datos financieros
  "ingresos": 5000000,
  "tipoEmpleo": "dependiente",
  "nombreEmpresa": "Empresa XYZ",
  "cargoActual": "Ingeniero",
  
  // Crédito
  "montoSolicitado": 30000000,
  "plazoMeses": 36,
  "destinoCredito": "Remodelación de vivienda",
  
  // Consentimientos (obligatorios)
  "aceptaTerminos": true,
  "aceptaCompartirDatos": true,
  "aceptaContacto": true,
  
  // Tracking
  "origen": "google",
  "campana": "credito-julio-2026"
}

// Response 201
{
  "success": true,
  "data": {
    "lead": {
      "id": "lead_abc123",
      "codigo": "LD-2026-001234",
      "estado": "nuevo",
      "fechaCreacion": "2026-09-12T10:30:00Z",
      "producto": {
        "id": "prod_abc123",
        "nombre": "Crédito Digital"
      },
      "entidad": {
        "id": "ent_xyz789",
        "nombre": "Fintech Rápida",
        "logo": "/logos/fintech-rapida.png"
      },
      "montoSolicitado": 30000000,
      "plazoMeses": 36,
      "cuotaEstimada": 994120,
      "tiempoRespuestaEstimado": "2 horas"
    },
    "mensaje": "Tu solicitud ha sido enviada exitosamente a Fintech Rápida. Te contactaremos en menos de 2 horas."
  }
}

// Response 400 - Validación
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Errores de validación",
    "details": [
      {
        "field": "email",
        "message": "El email no es válido"
      },
      {
        "field": "aceptaTerminos",
        "message": "Debes aceptar los términos y condiciones"
      }
    ]
  }
}

// Response 422 - No elegible
{
  "success": false,
  "error": {
    "code": "NOT_ELIGIBLE",
    "message": "No cumples con los requisitos para este producto",
    "details": [
      {
        "reason": "insufficient_income",
        "message": "Los ingresos mínimos requeridos son $3.000.000"
      }
    ]
  }
}
```

### 6.2 Obtener Mis Leads

**GET** `/api/v1/leads/mis-solicitudes`

**Autenticación:** Requerida

```typescript
// Query params
?estado=nuevo,enviado
&page=1
&limit=10

// Response 200
{
  "success": true,
  "data": {
    "leads": [
      {
        "id": "lead_abc123",
        "codigo": "LD-2026-001234",
        "estado": "contactado",
        "fechaCreacion": "2026-09-12T10:30:00Z",
        "fechaContacto": "2026-09-12T11:15:00Z",
        "producto": {
          "nombre": "Crédito Digital"
        },
        "entidad": {
          "nombre": "Fintech Rápida",
          "logo": "/logos/fintech-rapida.png"
        },
        "montoSolicitado": 30000000,
        "plazoMeses": 36,
        "cuotaEstimada": 994120,
        "timeline": [
          {
            "fecha": "2026-09-12T10:30:00Z",
            "estado": "nuevo",
            "descripcion": "Solicitud creada"
          },
          {
            "fecha": "2026-09-12T10:31:00Z",
            "estado": "enviado",
            "descripcion": "Enviado a Fintech Rápida"
          },
          {
            "fecha": "2026-09-12T11:15:00Z",
            "estado": "contactado",
            "descripcion": "Fintech Rápida te ha contactado"
          }
        ]
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 3,
      "totalPages": 1
    }
  }
}
```

### 6.3 Obtener Detalle de Lead

**GET** `/api/v1/leads/{leadId}`

**Autenticación:** Requerida (solo el propietario o entidad)

```typescript
// Response 200
{
  "success": true,
  "data": {
    "lead": {
      "id": "lead_abc123",
      "codigo": "LD-2026-001234",
      "estado": "en-evaluacion",
      // ... datos completos
      "notasEntidad": "Documentos recibidos, en proceso de validación",
      "proximoPaso": "Esperar validación de documentos (24-48 horas)"
    }
  }
}
```

---

## 7. API PARA ENTIDADES FINANCIERAS (B2B)

### 7.1 Dashboard - Resumen

**GET** `/api/v1/entidad/dashboard`

**Autenticación:** Requerida (usuario de entidad)

```typescript
// Response 200
{
  "success": true,
  "data": {
    "resumen": {
      "periodo": "mes-actual",
      "leadsRecibidos": 150,
      "leadsContactados": 120,
      "leadsAprobados": 45,
      "tasaConversion": 30,
      "montoTotalSolicitado": 4500000000,
      "montoTotalDesembolsado": 1350000000
    },
    "por producto": [
      {
        "productoId": "prod_abc123",
        "nombre": "Crédito Digital",
        "leadsRecibidos": 87,
        "leadsAprobados": 28,
        "tasaConversion": 32.2
      }
    ],
    "tendencia": {
      "leadsVsMesAnterior": 12.5,
      "conversionVsMesAnterior": -2.3
    }
  }
}
```

### 7.2 Listar Leads Recibidos

**GET** `/api/v1/entidad/leads`

**Autenticación:** Requerida (usuario de entidad)

```typescript
// Query params
?estado=nuevo,contactado
&productoId=prod_abc123
&fechaDesde=2026-09-01
&fechaHasta=2026-09-30
&page=1
&limit=20
&sort=fechaCreacion:desc

// Response 200
{
  "success": true,
  "data": {
    "leads": [
      {
        "id": "lead_abc123",
        "codigo": "LD-2026-001234",
        "estado": "nuevo",
        "fechaCreacion": "2026-09-12T10:30:00Z",
        "solicitante": {
          "nombres": "Juan",
          "apellidos": "Pérez",
          "email": "juan.perez@ejemplo.com",
          "telefono": "3001234567",
          "ciudad": "Bogotá"
        },
        "credito": {
          "producto": "Crédito Digital",
          "montoSolicitado": 30000000,
          "plazoMeses": 36,
          "ingresos": 5000000,
          "tipoEmpleo": "dependiente"
        },
        "scoring": {
          "calidad": 85,
          "probabilidadAprobacion": 78
        }
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 150,
      "totalPages": 8
    }
  }
}
```

### 7.3 Actualizar Estado de Lead

**PATCH** `/api/v1/entidad/leads/{leadId}/estado`

**Autenticación:** Requerida (usuario de entidad)

```typescript
// Request
{
  "estado": "en-evaluacion",
  "notas": "Documentos recibidos, iniciando evaluación crediticia"
}

// Response 200
{
  "success": true,
  "data": {
    "lead": {
      "id": "lead_abc123",
      "estado": "en-evaluacion",
      "fechaCambioEstado": "2026-09-12T14:30:00Z",
      "notasEntidad": "Documentos recibidos, iniciando evaluación crediticia"
    }
  }
}
```

### 7.4 Exportar Leads

**POST** `/api/v1/entidad/leads/exportar`

**Autenticación:** Requerida (usuario de entidad)

```typescript
// Request
{
  "formato": "xlsx",
  "filtros": {
    "estado": ["nuevo", "contactado"],
    "fechaDesde": "2026-09-01",
    "fechaHasta": "2026-09-30"
  },
  "campos": [
    "codigo",
    "fechaCreacion",
    "nombres",
    "email",
    "telefono",
    "montoSolicitado",
    "estado"
  ]
}

// Response 200
{
  "success": true,
  "data": {
    "archivo": {
      "url": "https://storage.ejemplo.com/exports/leads_2026-09-12.xlsx",
      "nombre": "leads_2026-09-12.xlsx",
      "expiraEn": "2026-09-12T18:30:00Z"
    }
  }
}
```

---

## 8. API DE SIMULACIONES

### 8.1 Guardar Simulación

**POST** `/api/v1/simulaciones`

```typescript
// Request
{
  "tipoProducto": "libre-inversion",
  "montoSolicitado": 30000000,
  "plazoMeses": 36,
  "ingresos": 5000000,
  "resultado": {
    "ofertasEncontradas": 8,
    "mejorOferta": {
      "entidad": "Fintech Rápida",
      "tasa": 1.2,
      "cuota": 994120
    }
  }
}

// Response 201
{
  "success": true,
  "data": {
    "simulacion": {
      "id": "sim_abc123",
      "sessionId": "sess_xyz789",
      "fechaSimulacion": "2026-09-12T10:30:00Z"
    }
  }
}
```

### 8.2 Obtener Mis Simulaciones

**GET** `/api/v1/simulaciones/historial`

**Autenticación:** Opcional (retorna simulaciones del usuario o sesión)

```typescript
// Response 200
{
  "success": true,
  "data": {
    "simulaciones": [
      {
        "id": "sim_abc123",
        "fechaSimulacion": "2026-09-12T10:30:00Z",
        "montoSolicitado": 30000000,
        "plazoMeses": 36,
        "mejorOferta": {
          "entidad": "Fintech Rápida",
          "cuota": 994120,
          "costoTotal": 35796000
        },
        "convirtioEnLead": false
      }
    ]
  }
}
```

---

## 9. API DE TRACKING

### 9.1 Registrar Evento

**POST** `/api/v1/tracking/evento`

```typescript
// Request
{
  "tipoEvento": "product_click",
  "categoria": "comparador",
  "accion": "clic_oferta",
  "etiqueta": "Fintech Rápida - Crédito Digital",
  "metadata": {
    "productoId": "prod_abc123",
    "entidadId": "ent_xyz789",
    "posicion": 1,
    "patrocinado": false
  }
}

// Response 201
{
  "success": true,
  "data": {
    "eventoId": "evt_abc123"
  }
}
```

### 9.2 Registrar Clic en Oferta (CPC)

**POST** `/api/v1/tracking/clic`

Endpoint especial para registrar clics (monetización CPC).

```typescript
// Request
{
  "productoId": "prod_abc123",
  "sessionId": "sess_xyz789",
  "posicion": 1
}

// Response 201
{
  "success": true,
  "data": {
    "registrado": true,
    "costoClic": 5000
  }
}
```

---

## 10. API DE UTILIDADES

### 10.1 Calculadora de Cuota

**POST** `/api/v1/utilidades/calcular-cuota`

```typescript
// Request
{
  "capital": 30000000,
  "tasaMensual": 1.5,
  "plazo": 36
}

// Response 200
{
  "success": true,
  "data": {
    "cuotaMensual": 1042224,
    "totalPagado": 37520064,
    "interesesTotales": 7520064
  }
}
```

### 10.2 Convertir Tasas

**POST** `/api/v1/utilidades/convertir-tasa`

```typescript
// Request
{
  "tipo": "ea-a-mv",
  "valor": 19.5618
}

// Response 200
{
  "success": true,
  "data": {
    "tasaOriginal": 19.5618,
    "tipoOriginal": "EA",
    "tasaConvertida": 1.5,
    "tipoConvertido": "MV"
  }
}
```

### 10.3 Validar Elegibilidad

**POST** `/api/v1/utilidades/validar-elegibilidad`

```typescript
// Request
{
  "productoId": "prod_abc123",
  "monto": 30000000,
  "plazo": 36,
  "ingresos": 5000000,
  "tipoEmpleo": "dependiente"
}

// Response 200
{
  "success": true,
  "data": {
    "elegible": true,
    "errores": [],
    "advertencias": [],
    "cuotaEstimada": 994120,
    "relacionCuotaIngreso": 19.9
  }
}

// Response 200 - No elegible
{
  "success": true,
  "data": {
    "elegible": false,
    "errores": [
      "Los ingresos mínimos requeridos son $3.000.000"
    ],
    "advertencias": [],
    "cuotaEstimada": null,
    "relacionCuotaIngreso": null
  }
}
```

---

## 11. WEBHOOKS (Para Entidades Financieras)

### 11.1 Lead Creado

**POST** `{entidad.webhookUrl}`

Enviado cuando un nuevo lead es creado.

```typescript
// Headers
X-Webhook-Signature: sha256=abc123...
Content-Type: application/json

// Body
{
  "event": "lead.created",
  "timestamp": "2026-09-12T10:30:00Z",
  "data": {
    "lead": {
      "id": "lead_abc123",
      "codigo": "LD-2026-001234",
      "fechaCreacion": "2026-09-12T10:30:00Z",
      "solicitante": {
        "nombres": "Juan",
        "apellidos": "Pérez",
        "email": "juan.perez@ejemplo.com",
        "telefono": "3001234567",
        "tipoDocumento": "CC",
        "numeroDocumento": "1234567890",
        "ciudad": "Bogotá"
      },
      "credito": {
        "producto": {
          "id": "prod_abc123",
          "nombre": "Crédito Digital"
        },
        "montoSolicitado": 30000000,
        "plazoMeses": 36,
        "ingresos": 5000000,
        "tipoEmpleo": "dependiente",
        "destinoCredito": "Remodelación"
      },
      "consentimientos": {
        "aceptaTerminos": true,
        "aceptaCompartirDatos": true,
        "aceptaContacto": true,
        "fechaConsentimiento": "2026-09-12T10:30:00Z"
      }
    }
  }
}

// Response esperada de la entidad
200 OK
{
  "received": true,
  "leadId": "lead_abc123"
}
```

### 11.2 Verificación de Firma

```typescript
// La entidad debe verificar la firma del webhook
const crypto = require('crypto');

function verificarWebhook(body, signature, secret) {
  const hash = crypto
    .createHmac('sha256', secret)
    .update(JSON.stringify(body))
    .digest('hex');
  
  const expectedSignature = `sha256=${hash}`;
  
  return signature === expectedSignature;
}
```

---

## 12. RATE LIMITING

### 12.1 Límites por Endpoint

| Endpoint | Límite | Ventana |
|----------|--------|---------|
| POST `/auth/register` | 5 | 1 hora |
| POST `/auth/login` | 10 | 15 minutos |
| POST `/comparacion/*` | 10 | 1 minuto |
| POST `/leads` | 3 | 1 minuto |
| GET `/productos` | 100 | 1 minuto |
| GET `/entidad/*` | 60 | 1 minuto |

### 12.2 Headers de Rate Limit

```http
X-RateLimit-Limit: 10
X-RateLimit-Remaining: 7
X-RateLimit-Reset: 1694520600
```

### 12.3 Response cuando se excede

```typescript
// Response 429
{
  "success": false,
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Has excedido el límite de solicitudes",
    "retryAfter": 45
  }
}
```

---

## 13. PAGINACIÓN

### 13.1 Query Parameters

```
?page=1          # Página (default: 1)
&limit=20        # Items por página (default: 20, max: 100)
&sort=campo:asc  # Ordenamiento (asc/desc)
```

### 13.2 Response Format

```typescript
{
  "data": { ... },
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "totalPages": 8,
    "hasNext": true,
    "hasPrev": false,
    "links": {
      "first": "/api/v1/productos?page=1&limit=20",
      "prev": null,
      "next": "/api/v1/productos?page=2&limit=20",
      "last": "/api/v1/productos?page=8&limit=20"
    }
  }
}
```

---

## 14. FILTROS Y BÚSQUEDA

### 14.1 Operadores

```
# Igualdad
?tipo=libre-inversion

# Rango
?montoMinimo[gte]=1000000
?montoMaximo[lte]=50000000

# Fecha
?fechaCreacion[gte]=2026-09-01
?fechaCreacion[lte]=2026-09-30

# In
?estado[in]=nuevo,enviado,contactado

# Búsqueda texto
?search=crédito digital

# Múltiples filtros
?tipo=libre-inversion&activo=true&destacado=true
```

---

## 15. CÓDIGOS DE ERROR

### 15.1 Catálogo de Errores

```typescript
enum ErrorCode {
  // Autenticación
  INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',
  TOKEN_EXPIRED = 'TOKEN_EXPIRED',
  TOKEN_INVALID = 'TOKEN_INVALID',
  EMAIL_ALREADY_EXISTS = 'EMAIL_ALREADY_EXISTS',
  
  // Validación
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  REQUIRED_FIELD = 'REQUIRED_FIELD',
  INVALID_FORMAT = 'INVALID_FORMAT',
  OUT_OF_RANGE = 'OUT_OF_RANGE',
  
  // Negocio
  NOT_ELIGIBLE = 'NOT_ELIGIBLE',
  NO_OFFERS_FOUND = 'NO_OFFERS_FOUND',
  PRODUCT_NOT_AVAILABLE = 'PRODUCT_NOT_AVAILABLE',
  INSUFFICIENT_INCOME = 'INSUFFICIENT_INCOME',
  
  // Recursos
  NOT_FOUND = 'NOT_FOUND',
  ALREADY_EXISTS = 'ALREADY_EXISTS',
  
  // Permisos
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  
  // Sistema
  INTERNAL_ERROR = 'INTERNAL_ERROR',
  SERVICE_UNAVAILABLE = 'SERVICE_UNAVAILABLE',
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED'
}
```

---

## 16. VERSIONADO DE API

### 16.1 Estrategia

- **URL Versioning:** `/api/v1/`, `/api/v2/`
- **Deprecación:** Mínimo 6 meses de aviso
- **Compatibilidad:** Cambios no breaking en misma versión

### 16.2 Changelog

```
v1.0.0 (2026-09-01)
- Release inicial
- Endpoints de comparación
- Endpoints de leads
- Endpoints de productos

v1.1.0 (Futuro)
- Agregar endpoint de pre-aprobación
- Agregar webhook de actualización de estado
```

---

## 17. DOCUMENTACIÓN INTERACTIVA

### 17.1 Swagger UI

```
Desarrollo:  http://localhost:4000/api-docs
Producción:  https://api.comparador.com/api-docs
```

### 17.2 OpenAPI Spec

```yaml
# openapi.yaml
openapi: 3.0.0
info:
  title: Comparador Financiero API
  version: 1.0.0
  description: API para comparación de productos financieros
  
servers:
  - url: https://api.comparador.com/api/v1
    description: Production
  - url: http://localhost:4000/api/v1
    description: Development

# ... ver archivo completo en docs/openapi.yaml
```

---

## 18. TESTING DE APIs

### 18.1 Postman Collection

```json
{
  "info": {
    "name": "Comparador Financiero API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Autenticación",
      "item": [
        {
          "name": "Register",
          "request": {
            "method": "POST",
            "url": "{{baseUrl}}/auth/register"
          }
        }
      ]
    }
  ]
}
```

### 18.2 Ejemplos de cURL

```bash
# Login
curl -X POST https://api.comparador.com/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "usuario@ejemplo.com",
    "password": "Password123!"
  }'

# Comparar ofertas
curl -X POST https://api.comparador.com/api/v1/comparacion/comparar \
  -H "Content-Type: application/json" \
  -d '{
    "tipoProducto": "libre-inversion",
    "montoSolicitado": 30000000,
    "plazoMeses": 36,
    "ingresos": 5000000,
    "tipoEmpleo": "dependiente"
  }'

# Crear lead (autenticado)
curl -X POST https://api.comparador.com/api/v1/leads \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..." \
  -H "Content-Type: application/json" \
  -d '{
    "productoId": "prod_abc123",
    "nombres": "Juan",
    "apellidos": "Pérez",
    ...
  }'
```

---

## 19. MEJORES PRÁCTICAS

### 19.1 Principios

1. **Idempotencia:** POST para crear, PUT/PATCH para actualizar
2. **Caché:** Usar headers `Cache-Control`, `ETag`
3. **Compresión:** Soportar `gzip`, `br`
4. **CORS:** Configurar correctamente para frontend
5. **HTTPS:** Obligatorio en producción
6. **Logs:** Loguear todas las requests con requestId

### 19.2 Performance

- Usar paginación siempre
- Implementar cache en Redis
- Índices optimizados en DB
- Compresión de responses
- CDN para assets

---

## 20. PRÓXIMOS PASOS

✅ **Completado:** APIs y contratos de servicios completos  
📋 **Siguiente:** Especificación de UX/UI y flujos de usuario

**Documento creado por:** Sistema SDD  
**Próximo documento:** 06-ux-ui-flujos.md
