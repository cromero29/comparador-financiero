# Ejemplo de Configuración de Scraper - RappiPay

## Configuración en BD

```json
{
  "entidadId": "uuid-rappipay",
  "tipo": "LIBRE_INVERSION",
  "url": "https://www.rappipay.com/prestamos",
  "estrategia": "DYNAMIC",
  "selectores": {
    "tasaMensual": "[data-testid='monthly-rate']",
    "tasaAnual": "[data-testid='annual-rate']",
    "montoMaximo": "[data-testid='max-amount']",
    "plazoMaximo": "[data-testid='max-term']"
  },
  "waitForSelector": "[data-testid='monthly-rate']",
  "timeout": 25000
}
```

## Ejemplo de HTML (React/Next.js)

```html
<div class="prestamo-info">
  <h2>Préstamo Personal</h2>
  
  <div class="tasas">
    <div data-testid="monthly-rate">1.5%</div>
    <div data-testid="annual-rate">18.0%</div>
  </div>
  
  <div class="limites">
    <div data-testid="max-amount">$15,000,000</div>
    <div data-testid="max-term">36 meses</div>
  </div>
</div>
```

## Resultado Esperado

```json
{
  "exitoso": true,
  "productosEncontrados": 1,
  "productos": [
    {
      "nombre": "Préstamo Personal",
      "tasaNominalMensual": 1.5,
      "tasaNominalAnual": 18.0,
      "montoMaximo": 15000000,
      "plazoMaximoMeses": 36
    }
  ],
  "duracionMs": 1800
}
```

## Notas

- RappiPay es SPA (Single Page App) → DYNAMIC requerido
- Usa data-testid attributes (buena práctica para scraping)
- Fintech típicamente tiene mejor UX y más rápido
- Validar que el monto esté en COP, no USD
