# Comparador Financiero - Frontend

Frontend web desarrollado con React, TypeScript, Vite y TailwindCSS para el comparador de productos financieros.

## 🚀 Tecnologías

- **Framework:** React 18
- **Lenguaje:** TypeScript
- **Build Tool:** Vite
- **Styling:** TailwindCSS
- **Routing:** React Router DOM
- **State Management:** TanStack Query (React Query)
- **Forms:** React Hook Form + Zod
- **HTTP Client:** Axios

## 📋 Requisitos

- Node.js >= 18.0.0
- npm o yarn

## 🛠️ Instalación

```bash
# Instalar dependencias
npm install

# Copiar variables de entorno
cp .env.example .env

# Editar .env con la URL del backend
```

## 🏃 Ejecución

### Desarrollo

```bash
npm run dev
```

El sitio estará disponible en `http://localhost:5173`

### Producción

```bash
# Build para producción
npm run build

# Preview del build
npm run preview
```

## 📁 Estructura del Proyecto

```
frontend/
├── public/                 # Assets estáticos
├── src/
│   ├── components/        # Componentes React
│   │   ├── ui/           # Componentes UI base (Button, Input, Card)
│   │   ├── ComparacionForm.tsx
│   │   └── OfertaCard.tsx
│   ├── pages/            # Páginas principales
│   │   ├── LandingPage.tsx
│   │   └── ResultadosPage.tsx
│   ├── hooks/            # Custom hooks
│   │   └── useAnalytics.ts
│   ├── services/         # Cliente API
│   │   └── api.ts
│   ├── types/            # TypeScript types
│   │   └── index.ts
│   ├── utils/            # Utilidades
│   │   ├── format.ts
│   │   └── helpers.ts
│   ├── config/           # Configuración
│   │   └── constants.ts
│   ├── App.tsx           # Componente principal
│   ├── main.tsx          # Punto de entrada
│   └── index.css         # Estilos globales
├── index.html
├── package.json
├── vite.config.ts
├── tailwind.config.js
└── tsconfig.json
```

## 🎨 Componentes UI

### Button

```tsx
import { Button } from '@components/ui/Button';

<Button variant="primary" size="md" onClick={handleClick}>
  Comparar
</Button>
```

**Variants:** `primary`, `secondary`, `success`, `danger`, `ghost`  
**Sizes:** `sm`, `md`, `lg`

### Input

```tsx
import { Input } from '@components/ui/Input';

<Input
  label="Monto"
  type="number"
  placeholder="30000000"
  error={errors.monto?.message}
/>
```

### Card

```tsx
import { Card, CardHeader, CardTitle, CardContent } from '@components/ui/Card';

<Card>
  <CardHeader>
    <CardTitle>Título</CardTitle>
  </CardHeader>
  <CardContent>
    Contenido
  </CardContent>
</Card>
```

### Badge

```tsx
import { Badge } from '@components/ui/Badge';

<Badge variant="success">Mejor opción</Badge>
```

## 🔌 Servicios API

### Comparar ofertas

```tsx
import { compararOfertas } from '@services/api';

const resultado = await compararOfertas({
  tipoProducto: 'LIBRE_INVERSION',
  montoSolicitado: 30000000,
  plazoMeses: 36,
  ingresos: 5000000,
  edad: 35,
  tipoEmpleo: 'dependiente',
});
```

### Tracking

```tsx
import { trackEvento, trackClic } from '@services/api';

// Evento genérico
await trackEvento({
  tipoEvento: 'form_complete',
  categoria: 'comparacion',
  accion: 'submit',
  metadata: { monto: 30000000 },
});

// Clic en oferta (CPC)
await trackClic({
  productoId: 'uuid',
  posicion: 1,
  montoSolicitado: 30000000,
  plazoMeses: 36,
  tipoProducto: 'LIBRE_INVERSION',
});
```

## 🎯 Utilidades

### Formateo

```tsx
import { formatCurrency, formatPercentage, formatPlazo } from '@utils/format';

formatCurrency(30000000);           // "$30,000,000"
formatPercentage(19.56);            // "19.56%"
formatPlazo(36);                    // "3 años"
```

### Helpers

```tsx
import { cn, debounce, isMobile } from '@utils/helpers';

// Combinar clases Tailwind
const classes = cn('btn', 'btn-primary', isActive && 'active');

// Debounce
const debouncedSearch = debounce(handleSearch, 500);

// Detectar móvil
if (isMobile()) {
  // ...
}
```

## 🚀 Deploy

### Vercel (Recomendado)

1. Conectar repositorio GitHub
2. Configurar variables de entorno:
   - `VITE_API_URL` = URL del backend en Railway
3. Deploy automático

```bash
# CLI de Vercel
npm install -g vercel
vercel
```

### Netlify

```bash
# Build command
npm run build

# Publish directory
dist
```

## 🎨 Personalización

### Colores (tailwind.config.js)

```js
colors: {
  primary: {
    500: '#0ea5e9',
    600: '#0284c7',
    // ...
  },
}
```

### Fuentes

Editar en `index.html`:

```html
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
```

## 🧪 Testing (Futuro)

```bash
# Instalar Vitest
npm install -D vitest @testing-library/react

# Ejecutar tests
npm run test
```

## 📱 Mobile-First

El diseño está optimizado para móviles primero:

- **Mobile:** < 640px
- **Tablet:** 640px - 1024px
- **Desktop:** > 1024px

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
  {/* Responsive grid */}
</div>
```

## ♿ Accesibilidad

- Contraste WCAG AA compliant
- Navegación por teclado
- ARIA labels
- Screen reader friendly
- Focus visible

## 🔧 Comandos Útiles

```bash
# Instalar dependencias
npm install

# Desarrollo
npm run dev

# Build
npm run build

# Preview
npm run preview

# Lint
npm run lint

# Type check
npm run type-check
```

## 🐛 Troubleshooting

### Proxy no funciona

Verificar `vite.config.ts`:

```ts
server: {
  proxy: {
    '/api': 'http://localhost:4000'
  }
}
```

### Tipos TypeScript

Si hay errores de tipos, regenerar:

```bash
npm run type-check
```

### CORS errors

Verificar que el backend tenga CORS configurado para `http://localhost:5173`

## 📝 Licencia

Todos los derechos reservados © 2026

## 📞 Contacto

- Email: soporte@comparador.com
