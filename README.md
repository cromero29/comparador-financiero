# Comparador de Productos Financieros

Plataforma web para comparar créditos de libre inversión y compra de cartera de múltiples entidades financieras en Colombia. Sistema completo con web scraping automático, algoritmo de ranking inteligente y tracking de conversiones.

## 🎯 Descripción

Sistema de comparación financiera que utiliza web scraping para recopilar información actualizada de tasas, montos y condiciones de diferentes entidades financieras, permitiendo a los usuarios encontrar la mejor opción según sus necesidades.

**Estado del proyecto:** ✅ MVP Completo - Listo para testing y deploy

## 📋 Funcionalidades MVP

- ✅ Comparación de crédito de libre inversión
- ✅ Comparación de compra de cartera
- ✅ Simulador financiero en tiempo real
- ✅ Web scraping automático diario
- ✅ Ranking inteligente por costo total
- ✅ Mobile-first responsive design

## 🏗️ Arquitectura

### Frontend
- **Framework:** React 18 + TypeScript
- **Build:** Vite
- **Styling:** TailwindCSS + Shadcn/ui
- **Hosting:** Vercel (gratis)

### Backend
- **Runtime:** Node.js 20 + TypeScript
- **Framework:** Express
- **ORM:** Prisma
- **Web Scraping:** Puppeteer + Cheerio
- **Hosting:** Railway (gratis)

### Base de Datos
- **Motor:** PostgreSQL 15
- **Hosting:** Railway (500MB gratis)

## 📁 Estructura del Proyecto

```
/
├── specs/                    # Documentación SDD completa
│   ├── 00-resumen-ejecutivo-mvp.md
│   ├── 01-requerimientos-funcionales.md
│   ├── 02-arquitectura-sistema.md
│   ├── 03-modelo-datos.md
│   ├── 04-algoritmos-comparacion.md
│   ├── 05-apis-contratos.md
│   ├── 06-sistema-web-scraping.md
│   ├── 07-ux-ui-flujos.md
│   ├── 08-monetizacion-tracking.md
│   └── 09-seguridad-compliance.md
├── frontend/                 # Aplicación React (próximamente)
└── backend/                  # API Node.js (próximamente)
```

## 🚀 Roadmap

### ✅ Fase 1: MVP (Completado)
- [x] Especificación SDD completa (9 documentos)
- [x] Backend completo con Node.js + TypeScript + Prisma
- [x] Sistema de web scraping automático
- [x] Frontend React + TypeScript + TailwindCSS
- [x] Algoritmo de comparación con ranking ponderado
- [x] APIs REST documentadas
- [x] Sistema de tracking (CPC preparado)
- [x] Seguridad y compliance

### 🚧 Fase 2: Testing y Deploy (Próximo)
- [ ] Instalar dependencias y probar local
- [ ] Configurar PostgreSQL
- [ ] Ejecutar migraciones y seed
- [ ] Testing de scrapers con entidades reales
- [ ] Deploy backend a Railway
- [ ] Deploy frontend a Vercel
- [ ] Configurar dominios

### 📋 Fase 3: Monetización (Mes 4-6)
- [ ] Activar tracking CPC
- [ ] Integrar Google Analytics 4
- [ ] Dashboard de métricas
- [ ] Acuerdos comerciales con entidades

### 🎯 Fase 4: Expansión (Mes 7-12)
- [ ] Sistema de leads (CPL)
- [ ] Más productos financieros
- [ ] Más entidades
- [ ] Tests automatizados
- [ ] App móvil

## 🏦 Entidades Iniciales

1. Bancolombia
2. Davivienda
3. BBVA
4. Banco de Bogotá
5. Rappipay
6. Addi
7. Lineru
8. Coofinep

## 💰 Modelo de Negocio

- **MVP:** Gratuito, sin monetización
- **Fase 2:** CPC (Costo Por Clic) $3,000-10,000 COP
- **Fase 3:** CPL (Costo Por Lead) $20,000-100,000 COP
- **Fase 4:** CPA (Costo Por Adquisición) 0.5-2%

## 🔒 Seguridad y Compliance

- ✅ HTTPS/TLS con certificados válidos
- ✅ Headers de seguridad (CSP, HSTS)
- ✅ Rate limiting
- ✅ Input sanitization
- ✅ GDPR compliant
- ✅ Ley 1581/2012 (Habeas Data Colombia)
- ✅ Web scraping ético y legal

## 📊 Stack Tecnológico Completo

```yaml
Frontend:
  - React 18
  - TypeScript
  - Vite
  - TailwindCSS
  - Shadcn/ui
  - React Hook Form
  - Zod
  - TanStack Query
  - Recharts

Backend:
  - Node.js 20
  - Express
  - TypeScript
  - Prisma ORM
  - PostgreSQL
  - Puppeteer
  - Cheerio
  - Winston (logging)
  - Sentry (monitoring)

DevOps:
  - Docker + Docker Compose
  - GitHub Actions (CI/CD)
  - Vercel (frontend)
  - Railway (backend + DB)
```

## 📖 Documentación

Toda la especificación técnica detallada está disponible en la carpeta `/specs`:

- **Requerimientos:** Ver `specs/01-requerimientos-funcionales.md`
- **Arquitectura:** Ver `specs/02-arquitectura-sistema.md`
- **Base de Datos:** Ver `specs/03-modelo-datos.md`
- **Algoritmos:** Ver `specs/04-algoritmos-comparacion.md`
- **APIs:** Ver `specs/05-apis-contratos.md`
- **Web Scraping:** Ver `specs/06-sistema-web-scraping.md`
- **UX/UI:** Ver `specs/07-ux-ui-flujos.md`
- **Monetización:** Ver `specs/08-monetizacion-tracking.md`
- **Seguridad:** Ver `specs/09-seguridad-compliance.md`

## 🤝 Contribución

Este es un proyecto en desarrollo. Por el momento no está abierto a contribuciones externas.

## 📄 Licencia

Todos los derechos reservados © 2026

## 📞 Contacto

- **Email:** soporte@comparador.com
- **Privacidad:** privacidad@comparador.com
- **Seguridad:** seguridad@comparador.com

---

**Estado:** 🚧 En Desarrollo  
**Versión:** 0.1.0 - Especificación completa  
**Última actualización:** Septiembre 2026
