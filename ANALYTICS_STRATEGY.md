# Estrategia de Analytics y Monetización

## 📊 Datos que Capturamos

### 1. Sesiones de Usuario
- **Identificación**: Fingerprint del navegador, IP
- **Geolocalización**: País, ciudad
- **Dispositivo**: Desktop/Mobile/Tablet
- **Navegador y SO**: Chrome, Firefox, Windows, iOS, etc.
- **Origen de tráfico**: UTM parameters (source, medium, campaign, content, term)
- **Referrer**: De dónde vienen los usuarios

### 2. Búsquedas Completas
**Parámetros financieros:**
- Tipo de producto (Libre inversión / Compra cartera)
- Monto solicitado
- Plazo en meses
- Ingresos mensuales
- Edad
- Tipo de empleo (dependiente/independiente/pensionado)
- Deuda actual (para compra cartera)
- Cuota actual (para compra cartera)
- Tasa actual (para compra cartera)

**Resultados:**
- Cantidad de ofertas encontradas
- Mejor tasa ofrecida
- Mejor cuota encontrada
- Top 3 entidades mostradas

**Engagement:**
- Tiempo viendo resultados
- Ofertas expandidas (cuántas tarjetas abrieron)
- Si generó clic o no

### 3. Clics en Ofertas (CPC)
**Del clic:**
- Producto y entidad clickeados
- Posición en ranking (1-10)
- Página de resultados (1 o 2)
- Tasa y cuota ofrecidas

**Del usuario:**
- Edad, ingresos, tipo empleo (para segmentación)
- Monto y plazo solicitados

**Monetización:**
- Costo por clic (CPC)
- Si fue conversión (si aplicó realmente)
- Valor de conversión (CPL)

### 4. Eventos Generales
- `form_start`: Usuario empieza a llenar formulario
- `form_complete`: Usuario completa búsqueda
- `offer_view`: Ve una oferta específica
- `offer_expand`: Expande detalles de oferta
- `offer_click`: Click en "Solicitar ahora"
- `pagination_click`: Cambio de página
- `navigation`: Movimiento entre páginas
- `error`: Errores encontrados

---

## 🎯 Datos Adicionales Sugeridos para Capturar

### Información del Usuario (sin PII)
- **Nivel educativo** (opcional en formulario)
- **Estado civil** (opcional)
- **Cantidad de dependientes** (opcional)
- **Sector económico** (para independientes)
- **Antigüedad laboral** (rangos: <1 año, 1-3, 3-5, >5)

### Comportamiento en la Plataforma
- **Tiempo en formulario**: Cuánto tarda en completar
- **Campos modificados**: Si cambian valores antes de buscar
- **Búsquedas por sesión**: Cuántas veces buscan
- **Patrones de búsqueda**: 
  - ¿Buscan montos mayores después?
  - ¿Ajustan plazos?
  - ¿Comparan diferentes productos?

### Preferencias Detectadas
- **Entidades más vistas**: Aunque no hagan clic
- **Tiempo por oferta**: Cuánto tiempo miran cada una
- **Orden de visualización**: En qué orden ven las ofertas
- **Filtros aplicados** (si los agregas después)

### Contexto de Conversión
- **Hora del día**: Cuándo buscan y cuándo clickean
- **Día de la semana**
- **Tiempo desde búsqueda hasta clic**: Inmediato vs meditado
- **Ofertas comparadas**: Cuántas vieron antes de decidir

### Datos de Calidad de Lead
- **Score de calidad**: Basado en completitud y coherencia de datos
- **Probabilidad de aprobación**: Estimado automático
- **Riesgo estimado**: Bajo/Medio/Alto (para vender leads segmentados)

---

## 📈 Consultas SQL Útiles para Reportes

### 1. Dashboard Diario
```sql
-- Resumen del día
SELECT 
  DATE(fecha) as fecha,
  COUNT(DISTINCT sesion_id) as usuarios_unicos,
  COUNT(*) as busquedas_totales,
  SUM(CASE WHEN genero_clic THEN 1 ELSE 0 END) as conversiones,
  ROUND(AVG(monto_solicitado), 2) as monto_promedio,
  ROUND(AVG(edad), 0) as edad_promedio
FROM busquedas
WHERE fecha >= CURRENT_DATE
GROUP BY DATE(fecha);
```

### 2. Desempeño por Entidad
```sql
-- Clics por banco/día
SELECT 
  e.nombre as entidad,
  DATE(c.fecha) as fecha,
  COUNT(*) as total_clics,
  ROUND(AVG(c.tasa_ofrecida), 2) as tasa_promedio,
  ROUND(AVG(c.monto_solicitado), 2) as monto_promedio,
  SUM(c.costo_clic) as ingresos_cpc
FROM clics_tracking c
JOIN entidades_financieras e ON c.entidad_id = e.id
WHERE c.fecha >= CURRENT_DATE - INTERVAL '7 days'
GROUP BY e.nombre, DATE(c.fecha)
ORDER BY fecha DESC, total_clics DESC;
```

### 3. Funnel de Conversión
```sql
-- Desde búsqueda hasta clic
SELECT 
  COUNT(DISTINCT s.id) as sesiones_totales,
  COUNT(DISTINCT b.id) as busquedas_realizadas,
  COUNT(DISTINCT b.id) FILTER (WHERE b.ofertas_expandidas > 0) as con_engagement,
  COUNT(DISTINCT c.sesion_id) as con_clics,
  ROUND(100.0 * COUNT(DISTINCT c.sesion_id) / COUNT(DISTINCT b.id), 2) as tasa_conversion
FROM sesiones s
LEFT JOIN busquedas b ON s.id = b.sesion_id
LEFT JOIN clics_tracking c ON s.id = c.sesion_id
WHERE s.inicio_sesion >= CURRENT_DATE - INTERVAL '30 days';
```

### 4. Segmentación por Perfil
```sql
-- Análisis por edad e ingresos
SELECT 
  CASE 
    WHEN edad < 25 THEN '18-24'
    WHEN edad < 35 THEN '25-34'
    WHEN edad < 45 THEN '35-44'
    WHEN edad < 55 THEN '45-54'
    ELSE '55+'
  END as rango_edad,
  CASE 
    WHEN ingresos < 2000000 THEN '< 2M'
    WHEN ingresos < 5000000 THEN '2M-5M'
    WHEN ingresos < 10000000 THEN '5M-10M'
    ELSE '> 10M'
  END as rango_ingresos,
  COUNT(*) as busquedas,
  ROUND(AVG(monto_solicitado), 2) as monto_promedio,
  SUM(CASE WHEN genero_clic THEN 1 ELSE 0 END) as conversiones,
  ROUND(100.0 * SUM(CASE WHEN genero_clic THEN 1 ELSE 0 END) / COUNT(*), 2) as tasa_conversion
FROM busquedas
WHERE fecha >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY rango_edad, rango_ingresos
ORDER BY busquedas DESC;
```

### 5. Mejores Horarios
```sql
-- Horarios con más actividad y conversión
SELECT 
  EXTRACT(HOUR FROM fecha) as hora,
  COUNT(DISTINCT sesion_id) as usuarios,
  COUNT(*) as busquedas,
  SUM(CASE WHEN genero_clic THEN 1 ELSE 0 END) as clics,
  ROUND(100.0 * SUM(CASE WHEN genero_clic THEN 1 ELSE 0 END) / COUNT(*), 2) as tasa_conversion
FROM busquedas
WHERE fecha >= CURRENT_DATE - INTERVAL '7 days'
GROUP BY EXTRACT(HOUR FROM fecha)
ORDER BY hora;
```

### 6. Origen de Tráfico (UTM)
```sql
-- Efectividad por fuente
SELECT 
  utm_source,
  utm_medium,
  utm_campaign,
  COUNT(DISTINCT s.id) as sesiones,
  COUNT(DISTINCT b.id) as busquedas,
  COUNT(DISTINCT c.id) as clics,
  ROUND(100.0 * COUNT(DISTINCT c.id) / NULLIF(COUNT(DISTINCT b.id), 0), 2) as tasa_conversion
FROM sesiones s
LEFT JOIN busquedas b ON s.id = b.sesion_id
LEFT JOIN clics_tracking c ON s.id = c.sesion_id
WHERE s.inicio_sesion >= CURRENT_DATE - INTERVAL '30 days'
  AND utm_source IS NOT NULL
GROUP BY utm_source, utm_medium, utm_campaign
ORDER BY clics DESC;
```

### 7. Productos Más Buscados
```sql
-- Demanda por tipo de producto y rangos
SELECT 
  tipo_producto,
  CASE 
    WHEN monto_solicitado < 5000000 THEN '< 5M'
    WHEN monto_solicitado < 15000000 THEN '5M-15M'
    WHEN monto_solicitado < 30000000 THEN '15M-30M'
    ELSE '> 30M'
  END as rango_monto,
  CASE 
    WHEN plazo_meses <= 12 THEN '≤ 12 meses'
    WHEN plazo_meses <= 24 THEN '13-24 meses'
    WHEN plazo_meses <= 36 THEN '25-36 meses'
    ELSE '> 36 meses'
  END as rango_plazo,
  COUNT(*) as busquedas,
  ROUND(AVG(ofertas_encontradas), 1) as ofertas_promedio
FROM busquedas
WHERE fecha >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY tipo_producto, rango_monto, rango_plazo
ORDER BY busquedas DESC;
```

### 8. Análisis de Posición en Ranking
```sql
-- CTR por posición
SELECT 
  posicion,
  COUNT(*) as total_clics,
  COUNT(DISTINCT entidad_id) as entidades_diferentes,
  ROUND(AVG(tasa_ofrecida), 2) as tasa_promedio_clickeada
FROM clics_tracking
WHERE fecha >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY posicion
ORDER BY posicion;
```

---

## 💰 Valor de los Datos para Vender a Bancos

### Insights que Ofrecer:

1. **Intención de Búsqueda Real**
   - Montos que buscan los usuarios realmente
   - Plazos preferidos
   - Perfiles demográficos

2. **Competencia**
   - Dónde están quedando vs competidores
   - Qué tasas son más atractivas
   - En qué posiciones aparecen

3. **Calidad de Leads**
   - Leads segmentados por probabilidad de aprobación
   - Score de calidad (datos completos, coherentes)
   - Engagement alto (vieron detalles, compararon)

4. **Oportunidades de Mercado**
   - Segmentos desatendidos
   - Rangos de monto con poca oferta
   - Nichos con alta demanda

5. **Benchmarking**
   - Su rendimiento vs mercado
   - Tasas competitivas
   - Share of clicks

---

## 🎁 Paquetes de Datos para Vender

### Paquete Básico (CPC - Costo Por Clic)
- Redirección de usuarios interesados
- Datos básicos del lead (monto, plazo, edad, ingresos)
- **Precio**: $5,000 - $15,000 COP por clic

### Paquete Premium (CPL - Costo Por Lead)
- Lead completo con todos los datos
- Información de búsqueda y contexto
- Engagement metrics (cuánto tiempo vio la oferta)
- **Precio**: $30,000 - $80,000 COP por lead calificado

### Paquete Insights (Mensual)
- Dashboard con métricas de mercado
- Reporte de competencia
- Análisis de demanda por segmento
- Recomendaciones de producto
- **Precio**: $2,000,000 - $5,000,000 COP/mes

### Paquete Enterprise (Anual)
- Todo lo anterior +
- API de integración directa
- Reportes personalizados
- Alertas en tiempo real
- Consultoría mensual
- **Precio**: $30,000,000 - $100,000,000 COP/año

---

## 📋 Datos Adicionales Opcionales a Capturar

### Para mejorar el servicio:
- [ ] **A/B Tests**: Diferentes diseños de cards
- [ ] **Heatmaps**: Dónde hacen click
- [ ] **Scroll depth**: Hasta dónde llegan
- [ ] **Abandonos**: En qué paso dejan el proceso

### Para mejorar la monetización:
- [ ] **Email** (opcional, con consentimiento): Para retargeting
- [ ] **Teléfono** (opcional): Para vender leads de mayor calidad
- [ ] **Motivo del crédito**: Vivienda, vehículo, educación, etc.
- [ ] **Urgencia**: Cuándo necesita el dinero

### Para compliance:
- [ ] **Consentimiento explícito**: Checkbox de términos
- [ ] **Política de privacidad**: Aceptación
- [ ] **Opt-out**: Opción de no compartir datos
- [ ] **GDPR/LGPD compliance**: Si planeas internacionalizar

---

## 🚀 Próximos Pasos

1. ✅ Crear migraciones de base de datos
2. ✅ Actualizar servicios para capturar búsquedas
3. ✅ Actualizar tracking de clics con más datos
4. ✅ Crear servicio de sesiones
5. ⏳ Dashboard de analytics (Fase 2)
6. ⏳ API de reportes para bancos (Fase 3)
