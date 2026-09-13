# UX/UI y Flujos de Usuario
## Plataforma de Comparación Financiera - MVP

**Proyecto:** Comparador de Productos Financieros  
**Versión:** 1.0 - MVP Simplificado  
**Fecha:** Septiembre 2026  

---

## 1. PRINCIPIOS DE DISEÑO

### 1.1 Filosofía UX

**Simplicidad Primero:**
- Menos es más: eliminar fricción innecesaria
- Claridad sobre complejidad
- Guiar al usuario paso a paso
- Feedback inmediato en cada acción

**Mobile First:**
- Diseñar primero para móvil (320px+)
- Touch-friendly (botones grandes, espaciado generoso)
- Scroll natural (nativo del dispositivo)
- Minimizar texto, maximizar visualización

**Confianza y Transparencia:**
- Mostrar fecha de actualización de datos
- Explicar cómo se calculan los resultados
- Términos financieros claros y simples
- Disclaimer visible pero no intrusivo

**Performance Percibido:**
- Loading states atractivos
- Skeleton screens
- Optimistic UI updates
- Transiciones suaves

---

## 2. MAPA DE NAVEGACIÓN

```
┌─────────────────────────────────────────────────┐
│            LANDING PAGE (/)                      │
│                                                  │
│  • Hero con CTA principal                       │
│  • "¿Qué crédito necesitas?"                    │
│  • Explicación breve del servicio               │
│  • Testimonios/confianza                        │
└──────────┬──────────────────────────────────────┘
           │
           │ [Seleccionar tipo]
           │
     ┌─────┴─────┐
     │           │
     ▼           ▼
┌─────────┐  ┌─────────┐
│ Libre   │  │ Compra  │
│ Inversión│  │ Cartera │
└────┬────┘  └────┬────┘
     │            │
     └──────┬─────┘
            │
            ▼
┌───────────────────────────────────────────┐
│      FORMULARIO (/comparar)               │
│                                           │
│  • Monto (slider + input)                │
│  • Plazo (slider + input)                │
│  • Ingresos                              │
│  • Tipo de empleo                        │
│  [+ Campos específicos compra cartera]   │
│                                           │
│  [Comparar Ofertas]                      │
└──────────────┬────────────────────────────┘
               │
               │ [Submit]
               │
               ▼
┌───────────────────────────────────────────┐
│      RESULTADOS (/resultados)             │
│                                           │
│  🥇 #1 - MEJOR OPCIÓN                    │
│  🥈 #2                                   │
│  🥉 #3                                   │
│     #4                                   │
│     #5                                   │
│                                           │
│  Cada card:                              │
│  • [Ver Detalles] → Modal               │
│  • [Solicitar] → Site entidad           │
└──────────────┬────────────────────────────┘
               │
               ├──→ [Ver Detalles]
               │    ↓
               │   ┌──────────────────┐
               │   │  MODAL DETALLE   │
               │   │  • Desglose      │
               │   │  • Requisitos    │
               │   │  • Tabla amort.  │
               │   └──────────────────┘
               │
               └──→ [Solicitar]
                    ↓
               ┌──────────────────────┐
               │  NUEVA PESTAÑA       │
               │  Sitio web entidad   │
               └──────────────────────┘
```

---

## 3. PANTALLAS PRINCIPALES

### 3.1 Landing Page (Home)

**Objetivo:** Captar atención y explicar valor → llevar a comparación

**Secciones:**

```
╔════════════════════════════════════════════╗
║           HEADER / NAVBAR                   ║
║  [Logo] Compara Crédito    [Blog] [FAQs]   ║
╚════════════════════════════════════════════╝

┌────────────────────────────────────────────┐
│         HERO SECTION                       │
│                                            │
│  Encuentra el crédito perfecto            │
│  para ti en minutos                        │
│                                            │
│  Compara tasas de 8+ entidades            │
│  financieras en un solo lugar             │
│                                            │
│  ┌──────────────────────────────────┐     │
│  │  ¿Qué tipo de crédito necesitas? │     │
│  │                                   │     │
│  │  [Crédito de Libre Inversión]    │     │
│  │  [Compra de Cartera]             │     │
│  └──────────────────────────────────┘     │
│                                            │
│  🔒 Sin registro • 📊 Datos actualizados   │
│  ⚡ Resultados en segundos                 │
└────────────────────────────────────────────┘

┌────────────────────────────────────────────┐
│         CÓMO FUNCIONA                      │
│                                            │
│  1️⃣ Ingresa tus datos                     │
│     Monto, plazo, ingresos                │
│                                            │
│  2️⃣ Compara ofertas                       │
│     Ve las 5 mejores opciones             │
│                                            │
│  3️⃣ Elige y solicita                      │
│     Directo al banco elegido              │
└────────────────────────────────────────────┘

┌────────────────────────────────────────────┐
│         ENTIDADES CONFIABLES               │
│                                            │
│  [Logo Bancolombia] [Logo Davivienda]     │
│  [Logo BBVA] [Logo Fintech] ...           │
└────────────────────────────────────────────┘

┌────────────────────────────────────────────┐
│         POR QUÉ CONFIAR EN NOSOTROS        │
│                                            │
│  ✓ Datos actualizados diariamente         │
│  ✓ 100% gratis, sin costos ocultos        │
│  ✓ Comparación transparente e imparcial   │
│  ✓ Sin afectar tu historial crediticio    │
└────────────────────────────────────────────┘

╔════════════════════════════════════════════╗
║                FOOTER                       ║
║  Sobre nosotros | Términos | Privacidad    ║
║  © 2026 ComparaCredito                     ║
╚════════════════════════════════════════════╝
```

**Componentes React:**
```tsx
<LandingPage>
  <Header />
  <HeroSection>
    <Heading />
    <ProductSelector />
    <TrustBadges />
  </HeroSection>
  <HowItWorks />
  <EntitiesShowcase />
  <WhyTrustUs />
  <Footer />
</LandingPage>
```

---

### 3.2 Formulario de Comparación

**Objetivo:** Capturar datos necesarios con mínima fricción

**Versión Mobile (320px - 768px):**

```
╔════════════════════════════════════╗
║  ← [Logo] Crédito Libre Inversión  ║
╚════════════════════════════════════╝

┌──────────────────────────────────┐
│  ¿Cuánto dinero necesitas?       │
│                                  │
│  $30.000.000                     │
│  ────────●────────────           │
│  $1M              $100M          │
│                                  │
│  [  $30,000,000  ] COP           │
└──────────────────────────────────┘

┌──────────────────────────────────┐
│  ¿En cuánto tiempo?              │
│                                  │
│  36 meses                        │
│  ──────────●──────────           │
│  6         36        84          │
│                                  │
│  [ 36 ] meses                    │
└──────────────────────────────────┘

┌──────────────────────────────────┐
│  ¿Cuánto ganas al mes?           │
│                                  │
│  [ $5,000,000 ] COP              │
│  💡 Para calcular tu capacidad   │
└──────────────────────────────────┘

┌──────────────────────────────────┐
│  ¿Cómo trabajas?                 │
│                                  │
│  ( ) Empleado (dependiente)      │
│  (•) Independiente               │
│  ( ) Pensionado                  │
└──────────────────────────────────┘

┌──────────────────────────────────┐
│  Tu cuota estimada: $980.000/mes │
│  (19.6% de tus ingresos) ✅      │
└──────────────────────────────────┘

╔══════════════════════════════════╗
║  [Comparar Ofertas →]            ║
╚══════════════════════════════════╝

🔒 Seguro • No afecta tu historial
```

**Formulario Compra de Cartera (Campos adicionales):**

```
┌──────────────────────────────────┐
│  ¿Cuántas deudas tienes?         │
│                                  │
│  [ 3 ] deudas                    │
└──────────────────────────────────┘

┌──────────────────────────────────┐
│  ¿Cuánto debes en total?         │
│                                  │
│  [ $25,000,000 ] COP             │
└──────────────────────────────────┘

┌──────────────────────────────────┐
│  ¿Cuánto pagas actualmente?      │
│                                  │
│  [ $1,500,000 ] COP/mes          │
│  💡 Para calcular tu ahorro      │
└──────────────────────────────────┘
```

**Validaciones en Tiempo Real:**
```tsx
// Mostrar al usuario mientras escribe
- ✅ Monto válido
- ⚠️ El plazo mínimo es 12 meses
- ❌ La cuota supera el 50% de tus ingresos
- 💡 Sugerencia: aumenta el plazo a 48 meses
```

**Componentes React:**
```tsx
<FormularioComparacion>
  <ProgressBar step={1} total={1} />
  
  <FormField>
    <Label>¿Cuánto dinero necesitas?</Label>
    <SliderInput 
      value={monto}
      min={1000000}
      max={100000000}
      onChange={handleMontoChange}
    />
    <CurrencyInput value={monto} />
  </FormField>
  
  <FormField>
    <Label>¿En cuánto tiempo?</Label>
    <SliderInput 
      value={plazo}
      min={6}
      max={84}
      onChange={handlePlazoChange}
    />
    <NumberInput value={plazo} suffix="meses" />
  </FormField>
  
  <CapacidadPagoIndicator 
    cuota={cuotaEstimada}
    ingresos={ingresos}
  />
  
  <SubmitButton>
    Comparar Ofertas →
  </SubmitButton>
</FormularioComparacion>
```

---

### 3.3 Página de Resultados

**Objetivo:** Mostrar las 5 mejores ofertas de forma clara y accionable

**Layout Mobile:**

```
╔════════════════════════════════════╗
║  ← Resultados                      ║
╚════════════════════════════════════╝

┌──────────────────────────────────┐
│  Encontramos 5 ofertas para:     │
│                                  │
│  💰 $30.000.000                  │
│  📅 36 meses                     │
│  💼 Empleado, $5.000.000/mes     │
│                                  │
│  [Ajustar] 🔄                    │
└──────────────────────────────────┘

╔════════════════════════════════════╗
║  🥇 #1 - MEJOR OPCIÓN              ║
╠════════════════════════════════════╣
║  [Logo]                            ║
║  FINTECH RÁPIDA                    ║
║  Crédito Digital                   ║
║                                    ║
║  Tasa: 1.2% MV | 15.4% EA          ║
║  ────────────────────────────      ║
║                                    ║
║  💵 Cuota mensual                  ║
║  $980.000                          ║
║                                    ║
║  💰 Total a pagar                  ║
║  $35.280.000                       ║
║                                    ║
║  ⏱️ Aprobación: 2 horas            ║
║  📋 Requisitos: 2 documentos       ║
║                                    ║
║  ✨ Tasa más baja                  ║
║  ✨ 100% digital                   ║
║  ✨ Aprobación rápida              ║
║                                    ║
║  [Ver Detalles] [Solicitar →]     ║
╚════════════════════════════════════╝

╔════════════════════════════════════╗
║  🥈 #2                             ║
╠════════════════════════════════════╣
║  [Logo] BANCOLOMBIA                ║
║  Cuota: $1.042.000                 ║
║  Total: $37.512.000                ║
║  ⏱️ 48 horas                       ║
║  [Ver Detalles] [Solicitar →]     ║
╚════════════════════════════════════╝

╔════════════════════════════════════╗
║  🥉 #3                             ║
╠════════════════════════════════════╣
║  [Logo] DAVIVIENDA                 ║
║  Cuota: $1.056.000                 ║
║  Total: $38.016.000                ║
║  [Ver Detalles] [Solicitar →]     ║
╚════════════════════════════════════╝

[Mostrar más ofertas]

┌──────────────────────────────────┐
│  📊 Comparación Rápida           │
│                                  │
│  Cuota más baja: $980.000        │
│  Cuota más alta: $1.098.000      │
│  Ahorras hasta: $118.000/mes     │
└──────────────────────────────────┘

┌──────────────────────────────────┐
│  📅 Datos actualizados el:       │
│  12 Sep 2026 - 2:05 AM           │
│  🤖 Actualización automática     │
└──────────────────────────────────┘
```

**Card de Oferta - Componente:**

```tsx
<OfertaCard rank={1} isBest={true}>
  <RankBadge rank={1} />
  <BestBadge />
  
  <EntidadHeader>
    <Logo src={oferta.entidad.logo} />
    <EntidadName>{oferta.entidad.nombre}</EntidadName>
    <ProductName>{oferta.producto.nombre}</ProductName>
  </EntidadHeader>
  
  <TasaSection>
    <TasaLabel>Tasa:</TasaLabel>
    <TasaMV>{oferta.tasaMensual}% MV</TasaMV>
    <TasaEA>{oferta.tasaEA}% EA</TasaEA>
  </TasaSection>
  
  <MainMetrics>
    <Metric>
      <Label>💵 Cuota mensual</Label>
      <Value>{formatCurrency(oferta.cuotaMensual)}</Value>
    </Metric>
    
    <Metric>
      <Label>💰 Total a pagar</Label>
      <Value>{formatCurrency(oferta.costoTotal)}</Value>
    </Metric>
  </MainMetrics>
  
  <SecondaryInfo>
    <Info>⏱️ Aprobación: {oferta.tiempoAprobacion}</Info>
    <Info>📋 Requisitos: {oferta.requisitos.length} documentos</Info>
  </SecondaryInfo>
  
  <BadgeList>
    {oferta.badges.map(badge => (
      <Badge key={badge}>{badge}</Badge>
    ))}
  </BadgeList>
  
  {oferta.ahorro && (
    <AhorroSection>
      <AhorroText>
        💰 Ahorras {formatCurrency(oferta.ahorro.mensual)}/mes
      </AhorroText>
    </AhorroSection>
  )}
  
  <ActionButtons>
    <SecondaryButton onClick={openModal}>
      Ver Detalles
    </SecondaryButton>
    <PrimaryButton onClick={handleSolicitar}>
      Solicitar →
    </PrimaryButton>
  </ActionButtons>
</OfertaCard>
```

---

### 3.4 Modal de Detalle

**Objetivo:** Mostrar información completa de la oferta sin salir de la página

```
╔════════════════════════════════════╗
║  [X]  Detalle de Oferta            ║
╠════════════════════════════════════╣
║                                    ║
║  [Logo] FINTECH RÁPIDA             ║
║  Crédito Digital                   ║
║                                    ║
║  ──────────────────────────────    ║
║                                    ║
║  📊 DESGLOSE DE COSTOS             ║
║                                    ║
║  Capital solicitado: $30.000.000   ║
║  Intereses totales:   $5.504.000   ║
║  Seguros:               $292.000   ║
║  Otros costos:               $0   ║
║  ──────────────────────────────    ║
║  TOTAL A PAGAR:     $35.796.000   ║
║                                    ║
║  ──────────────────────────────    ║
║                                    ║
║  📋 REQUISITOS                     ║
║                                    ║
║  ✓ Cédula de ciudadanía           ║
║  ✓ Certificado laboral            ║
║                                    ║
║  ──────────────────────────────    ║
║                                    ║
║  📈 TABLA DE AMORTIZACIÓN          ║
║  (Primeras 3 cuotas)               ║
║                                    ║
║  Cuota | Capital | Interés | Saldo║
║  ──────┼─────────┼─────────┼──────║
║    1   | 620K    | 360K    | 29.3M║
║    2   | 627K    | 353K    | 28.7M║
║    3   | 635K    | 345K    | 28.1M║
║                                    ║
║  [Ver tabla completa]              ║
║                                    ║
║  ──────────────────────────────    ║
║                                    ║
║  ✨ VENTAJAS                       ║
║                                    ║
║  • 100% digital                    ║
║  • Sin cuota de manejo             ║
║  • Aprobación en 2 horas           ║
║                                    ║
║  ──────────────────────────────    ║
║                                    ║
║  [Solicitar en Fintech Rápida →]  ║
║                                    ║
╚════════════════════════════════════╝
```

**Componente:**
```tsx
<Modal isOpen={isOpen} onClose={onClose}>
  <ModalHeader>
    <CloseButton onClick={onClose} />
    <Title>Detalle de Oferta</Title>
  </ModalHeader>
  
  <ModalBody>
    <EntidadInfo>
      <Logo />
      <Names />
    </EntidadInfo>
    
    <Section title="📊 Desglose de Costos">
      <CostBreakdown>
        <CostItem label="Capital" value={capital} />
        <CostItem label="Intereses" value={intereses} />
        <CostItem label="Seguros" value={seguros} />
        <Divider />
        <CostItem label="TOTAL" value={total} bold />
      </CostBreakdown>
    </Section>
    
    <Section title="📋 Requisitos">
      <RequisitosList items={requisitos} />
    </Section>
    
    <Section title="📈 Tabla de Amortización">
      <AmortizationTable 
        data={tablaAmortizacion.slice(0, 3)} 
      />
      <ExpandButton>Ver tabla completa</ExpandButton>
    </Section>
    
    <Section title="✨ Ventajas">
      <VentajasList items={ventajas} />
    </Section>
  </ModalBody>
  
  <ModalFooter>
    <PrimaryButton onClick={handleSolicitar}>
      Solicitar en {entidad} →
    </PrimaryButton>
  </ModalFooter>
</Modal>
```

---

## 4. SIMULADOR EN TIEMPO REAL

**Objetivo:** Permitir ajustes de monto/plazo y ver cambios instantáneamente

**UI del Simulador (sticky en resultados):**

```
┌──────────────────────────────────┐
│  🔄 Ajustar Simulación           │
├──────────────────────────────────┤
│                                  │
│  Monto: $30.000.000             │
│  ────────●───────────            │
│                                  │
│  Plazo: 36 meses                │
│  ──────●─────────────            │
│                                  │
│  [Recalcular]                    │
│  ⚡ Actualización automática     │
└──────────────────────────────────┘
```

**Comportamiento:**
- Sliders actualizan el valor al moverlos
- Debounce de 500ms antes de recalcular
- Skeleton screen mientras recalcula
- Transición suave entre resultados

```tsx
const [simulacion, setSimulacion] = useState({
  monto: 30000000,
  plazo: 36
});

const [ofertas, setOfertas] = useState([]);
const [isCalculating, setIsCalculating] = useState(false);

// Debounced recalculation
const debouncedRecalculate = useMemo(
  () => debounce(async (monto, plazo) => {
    setIsCalculating(true);
    const nuevasOfertas = await compararOfertas({ monto, plazo });
    setOfertas(nuevasOfertas);
    setIsCalculating(false);
  }, 500),
  []
);

const handleMontoChange = (nuevoMonto) => {
  setSimulacion(prev => ({ ...prev, monto: nuevoMonto }));
  debouncedRecalculate(nuevoMonto, simulacion.plazo);
};

return (
  <>
    <Simulador
      monto={simulacion.monto}
      plazo={simulacion.plazo}
      onMontoChange={handleMontoChange}
      onPlazoChange={handlePlazoChange}
    />
    
    {isCalculating ? (
      <SkeletonCards count={5} />
    ) : (
      <OfertasList ofertas={ofertas} />
    )}
  </>
);
```

---

## 5. ESTADOS DE LOADING

### 5.1 Skeleton Screen (Resultados)

```
╔════════════════════════════════════╗
║  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓             ║
║                                    ║
║  ▓▓▓▓▓▓▓                           ║
║  ▓▓▓▓▓▓▓▓▓▓▓▓                      ║
║                                    ║
║  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓                   ║
║  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓                ║
║                                    ║
║  ▓▓▓▓▓▓▓▓▓   ▓▓▓▓▓▓▓▓              ║
╚════════════════════════════════════╝
```

```tsx
<SkeletonCard>
  <SkeletonHeader />
  <SkeletonText lines={2} />
  <SkeletonMetrics count={2} />
  <SkeletonButtons count={2} />
</SkeletonCard>
```

### 5.2 Loading Spinner

```tsx
<LoadingOverlay>
  <Spinner />
  <LoadingText>Comparando ofertas...</LoadingText>
  <SubText>Esto tomará solo unos segundos</SubText>
</LoadingOverlay>
```

### 5.3 Empty State

```
┌──────────────────────────────────┐
│          😕                      │
│                                  │
│  No encontramos ofertas          │
│  para tu perfil                  │
│                                  │
│  Intenta ajustar:                │
│  • Aumentar el plazo             │
│  • Reducir el monto              │
│  • Verificar tus ingresos        │
│                                  │
│  [Ajustar búsqueda]              │
└──────────────────────────────────┘
```

---

## 6. RESPONSIVE DESIGN

### 6.1 Breakpoints

```css
/* Mobile first */
:root {
  --mobile: 320px;    /* Móvil pequeño */
  --tablet: 768px;    /* Tablet */
  --desktop: 1024px;  /* Desktop */
  --wide: 1440px;     /* Desktop wide */
}
```

### 6.2 Layout por Dispositivo

**Mobile (320px - 767px):**
- Stack vertical
- Cards ocupan 100% width
- Navegación hamburger
- Formulario en una sola columna
- Botones full-width

**Tablet (768px - 1023px):**
- 2 columnas en resultados
- Formulario en 2 columnas
- Navegación horizontal
- Sidebar opcional

**Desktop (1024px+):**
- 3 columnas en resultados (o 2 wide cards)
- Formulario en 3 columnas
- Sidebar con filtros
- Comparación lado a lado

```tsx
<ResponsiveGrid>
  {/* Mobile: 1 columna, Tablet: 2 columnas, Desktop: 3 columnas */}
  <GridContainer 
    columns={{ mobile: 1, tablet: 2, desktop: 3 }}
    gap="1rem"
  >
    {ofertas.map(oferta => (
      <OfertaCard key={oferta.id} oferta={oferta} />
    ))}
  </GridContainer>
</ResponsiveGrid>
```

---

## 7. INTERACCIONES Y ANIMACIONES

### 7.1 Transiciones

```css
/* Smooth transitions */
.card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0,0,0,0.1);
}

/* Slide in de abajo hacia arriba */
@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.oferta-card {
  animation: slideUp 0.3s ease forwards;
  animation-delay: calc(var(--index) * 0.1s);
}
```

### 7.2 Micro-interacciones

```tsx
// Haptic feedback en móvil
const handleSliderChange = (value) => {
  if (navigator.vibrate) {
    navigator.vibrate(10);
  }
  setValue(value);
};

// Confetti al encontrar mejor oferta
const showConfetti = () => {
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 }
  });
};

// Success feedback
<Button onClick={() => {
  handleSolicitar();
  showToast('¡Redirigiendo al banco!', 'success');
}}>
  Solicitar
</Button>
```

---

## 8. ACCESIBILIDAD (A11Y)

### 8.1 Contraste y Colores

```css
/* WCAG AA compliant */
:root {
  --primary: #2563eb;        /* Blue 600 */
  --primary-dark: #1e40af;   /* Ratio 4.5:1 */
  
  --success: #059669;        /* Green 600 */
  --warning: #d97706;        /* Amber 600 */
  --error: #dc2626;          /* Red 600 */
  
  --text: #111827;           /* Gray 900 */
  --text-secondary: #6b7280; /* Gray 500 */
}
```

### 8.2 Navegación por Teclado

```tsx
// Todos los botones navegables con Tab
<Button 
  tabIndex={0}
  onKeyPress={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      handleClick();
    }
  }}
>
  Comparar
</Button>

// Focus visible
.button:focus-visible {
  outline: 2px solid var(--primary);
  outline-offset: 2px;
}
```

### 8.3 ARIA Labels

```tsx
<OfertaCard 
  aria-label={`Oferta número ${rank} de ${entidad}`}
  role="article"
>
  <TasaSection aria-label="Información de tasas">
    <span aria-label="Tasa mensual vencida">
      {tasaMensual}% MV
    </span>
  </TasaSection>
  
  <Button 
    aria-label={`Solicitar crédito en ${entidad}`}
  >
    Solicitar
  </Button>
</OfertaCard>
```

### 8.4 Screen Reader Support

```tsx
// Anuncios para cambios dinámicos
<LiveRegion aria-live="polite" aria-atomic="true">
  {isCalculating && "Recalculando ofertas..."}
  {ofertas.length > 0 && `Se encontraron ${ofertas.length} ofertas`}
</LiveRegion>
```

---

## 9. SISTEMA DE DISEÑO

### 9.1 Paleta de Colores

```css
:root {
  /* Primary */
  --blue-50: #eff6ff;
  --blue-500: #3b82f6;
  --blue-600: #2563eb;
  --blue-700: #1d4ed8;
  
  /* Success */
  --green-50: #f0fdf4;
  --green-500: #22c55e;
  --green-600: #16a34a;
  
  /* Warning */
  --amber-50: #fffbeb;
  --amber-500: #f59e0b;
  --amber-600: #d97706;
  
  /* Error */
  --red-50: #fef2f2;
  --red-500: #ef4444;
  --red-600: #dc2626;
  
  /* Grays */
  --gray-50: #f9fafb;
  --gray-100: #f3f4f6;
  --gray-200: #e5e7eb;
  --gray-500: #6b7280;
  --gray-900: #111827;
}
```

### 9.2 Tipografía

```css
/* Inter font family */
:root {
  --font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  --font-mono: 'Fira Code', monospace;
}

/* Type scale */
.text-xs { font-size: 0.75rem; }    /* 12px */
.text-sm { font-size: 0.875rem; }   /* 14px */
.text-base { font-size: 1rem; }     /* 16px */
.text-lg { font-size: 1.125rem; }   /* 18px */
.text-xl { font-size: 1.25rem; }    /* 20px */
.text-2xl { font-size: 1.5rem; }    /* 24px */
.text-3xl { font-size: 1.875rem; }  /* 30px */
.text-4xl { font-size: 2.25rem; }   /* 36px */
```

### 9.3 Espaciado

```css
/* Consistent spacing scale */
:root {
  --space-1: 0.25rem;  /* 4px */
  --space-2: 0.5rem;   /* 8px */
  --space-3: 0.75rem;  /* 12px */
  --space-4: 1rem;     /* 16px */
  --space-6: 1.5rem;   /* 24px */
  --space-8: 2rem;     /* 32px */
  --space-12: 3rem;    /* 48px */
  --space-16: 4rem;    /* 64px */
}
```

### 9.4 Componentes Base

```tsx
// Button variants
<Button variant="primary">Solicitar</Button>
<Button variant="secondary">Ver Detalles</Button>
<Button variant="ghost">Cancelar</Button>

// Badge variants
<Badge variant="success">Mejor opción</Badge>
<Badge variant="info">100% digital</Badge>
<Badge variant="warning">Patrocinado</Badge>

// Input components
<Input type="currency" />
<Input type="percentage" />
<Slider min={0} max={100} />
<RadioGroup />
<Select />
```

---

## 10. MENSAJES Y COPY

### 10.1 Tono de Voz

- **Conversacional:** Como hablar con un amigo
- **Claro:** Sin jerga innecesaria
- **Confiable:** Serio pero cercano
- **Motivador:** Positivo y empoderador

### 10.2 Mensajes Clave

**CTAs:**
- ✅ "Comparar ofertas" (no "Buscar" o "Calcular")
- ✅ "Solicitar ahora" (no "Aplicar")
- ✅ "Ver detalles" (no "Más información")

**Explicaciones:**
- ✅ "Tu cuota mensual sería de..." (no "La cuota calculada es...")
- ✅ "Ahorras $450.000 cada mes" (no "Ahorro mensual: $450.000")
- ✅ "Necesitas 2 documentos" (no "Requisitos: 2")

**Errores:**
- ✅ "La cuota supera tus ingresos. Intenta con un plazo más largo"
- ✅ "No encontramos ofertas. Ajusta el monto o el plazo"
- ❌ "Error: INSUFFICIENT_INCOME"

---

## 11. PRÓXIMOS PASOS

✅ **Completado:** Especificación completa de UX/UI  
📋 **Siguiente:** Estrategia de monetización y tracking

**Documento creado por:** Sistema SDD  
**Próximo documento:** 08-monetizacion-tracking.md
