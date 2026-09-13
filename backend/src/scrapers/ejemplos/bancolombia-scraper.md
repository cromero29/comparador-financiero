# Ejemplo de Configuración de Scraper - Bancolombia

## Configuración en BD

```json
{
  "entidadId": "uuid-bancolombia",
  "tipo": "LIBRE_INVERSION",
  "url": "https://www.bancolombia.com/personas/creditos/credito-libre-inversion",
  "estrategia": "DYNAMIC",
  "selectores": {
    "tasaMensual": ".credito-tasa-mensual",
    "tasaAnual": ".credito-tasa-anual",
    "montoMinimo": ".credito-monto-minimo",
    "montoMaximo": ".credito-monto-maximo",
    "plazoMinimo": ".credito-plazo-minimo",
    "plazoMaximo": ".credito-plazo-maximo"
  },
  "waitForSelector": ".credito-tasa-mensual",
  "timeout": 30000
}
```

## Ejemplo de HTML a scrapear

```html
<div class="producto-credito">
  <h2>Crédito de Libre Inversión</h2>
  
  <div class="tasas">
    <span class="credito-tasa-mensual">1.8%</span>
    <span class="credito-tasa-anual">21.6%</span>
  </div>
  
  <div class="condiciones">
    <p>Monto: 
      <span class="credito-monto-minimo">$1,000,000</span> - 
      <span class="credito-monto-maximo">$100,000,000</span>
    </p>
    <p>Plazo: 
      <span class="credito-plazo-minimo">12</span> - 
      <span class="credito-plazo-maximo">84</span> meses
    </p>
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
      "nombre": "Crédito de Libre Inversión",
      "tasaNominalMensual": 1.8,
      "tasaNominalAnual": 21.6,
      "montoMinimo": 1000000,
      "montoMaximo": 100000000,
      "plazoMinimoMeses": 12,
      "plazoMaximoMeses": 84
    }
  ],
  "duracionMs": 2500
}
```

## Notas

- Bancolombia usa JavaScript para cargar contenido → DYNAMIC (Puppeteer)
- Esperar a que `.credito-tasa-mensual` esté visible
- Los selectores son ejemplos, deben ajustarse al HTML real
- Validar en entorno de desarrollo antes de producción
