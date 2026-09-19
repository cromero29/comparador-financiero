-- CreateEnum
CREATE TYPE "TipoEntidad" AS ENUM ('BANCO', 'FINTECH', 'COOPERATIVA', 'OTRA');

-- CreateEnum
CREATE TYPE "TipoProducto" AS ENUM ('LIBRE_INVERSION', 'COMPRA_CARTERA');

-- CreateEnum
CREATE TYPE "EstrategiaScrap" AS ENUM ('STATIC', 'DYNAMIC');

-- CreateTable
CREATE TABLE "entidades_financieras" (
    "id" TEXT NOT NULL,
    "codigo" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "tipo" "TipoEntidad" NOT NULL,
    "logo" TEXT,
    "sitioWeb" TEXT NOT NULL,
    "activa" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "entidades_financieras_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "productos" (
    "id" TEXT NOT NULL,
    "entidadId" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "tipo" "TipoProducto" NOT NULL,
    "descripcion" TEXT,
    "tasaNominalMensual" DECIMAL(10,4) NOT NULL,
    "tasaNominalAnual" DECIMAL(10,4) NOT NULL,
    "tasaEfectivaAnual" DECIMAL(10,4) NOT NULL,
    "montoMinimo" DECIMAL(15,2) NOT NULL,
    "montoMaximo" DECIMAL(15,2) NOT NULL,
    "plazoMinimoMeses" INTEGER NOT NULL,
    "plazoMaximoMeses" INTEGER NOT NULL,
    "costoEstudio" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "costoAdministracion" DECIMAL(10,4) NOT NULL DEFAULT 0,
    "seguroVida" DECIMAL(10,4) NOT NULL DEFAULT 0,
    "seguroDesempleo" DECIMAL(10,4) NOT NULL DEFAULT 0,
    "edadMinima" INTEGER NOT NULL DEFAULT 18,
    "edadMaxima" INTEGER NOT NULL DEFAULT 75,
    "ingresoMinimo" DECIMAL(15,2) NOT NULL,
    "requiereCuentaNomina" BOOLEAN NOT NULL DEFAULT false,
    "aceptaIndependientes" BOOLEAN NOT NULL DEFAULT true,
    "aceptaPensionados" BOOLEAN NOT NULL DEFAULT true,
    "urlInformacion" TEXT NOT NULL,
    "urlSolicitud" TEXT NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "verificado" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "productos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "scraper_configs" (
    "id" TEXT NOT NULL,
    "entidadId" TEXT NOT NULL,
    "tipo" "TipoProducto" NOT NULL,
    "url" TEXT NOT NULL,
    "estrategia" "EstrategiaScrap" NOT NULL,
    "selectores" JSONB NOT NULL,
    "waitForSelector" TEXT,
    "timeout" INTEGER NOT NULL DEFAULT 30000,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "scraper_configs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "scraping_logs" (
    "id" TEXT NOT NULL,
    "scraperConfigId" TEXT NOT NULL,
    "exitoso" BOOLEAN NOT NULL,
    "productosEncontrados" INTEGER NOT NULL DEFAULT 0,
    "error" TEXT,
    "duracionMs" INTEGER NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "scraping_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sesiones" (
    "id" TEXT NOT NULL,
    "fingerprint" TEXT,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "pais" TEXT,
    "ciudad" TEXT,
    "dispositivo" TEXT,
    "navegador" TEXT,
    "sistemaOperativo" TEXT,
    "utmSource" TEXT,
    "utmMedium" TEXT,
    "utmCampaign" TEXT,
    "utmContent" TEXT,
    "utmTerm" TEXT,
    "referrer" TEXT,
    "inicioSesion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ultimaActividad" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sesiones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "busquedas" (
    "id" TEXT NOT NULL,
    "sesionId" TEXT NOT NULL,
    "tipoProducto" "TipoProducto" NOT NULL,
    "montoSolicitado" DECIMAL(15,2) NOT NULL,
    "plazoMeses" INTEGER NOT NULL,
    "ingresos" DECIMAL(15,2) NOT NULL,
    "edad" INTEGER NOT NULL,
    "tipoEmpleo" TEXT NOT NULL,
    "deudaActual" DECIMAL(15,2),
    "cuotaActual" DECIMAL(15,2),
    "tasaActual" DECIMAL(10,4),
    "ofertasEncontradas" INTEGER NOT NULL,
    "mejorTasa" DECIMAL(10,4) NOT NULL,
    "mejorCuota" DECIMAL(15,2) NOT NULL,
    "entidad1Id" TEXT,
    "entidad2Id" TEXT,
    "entidad3Id" TEXT,
    "tiempoEnResultados" INTEGER,
    "ofertasExpandidas" INTEGER NOT NULL DEFAULT 0,
    "generoClic" BOOLEAN NOT NULL DEFAULT false,
    "clicsGenerados" INTEGER NOT NULL DEFAULT 0,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "busquedas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "eventos_tracking" (
    "id" TEXT NOT NULL,
    "sesionId" TEXT NOT NULL,
    "tipoEvento" TEXT NOT NULL,
    "categoria" TEXT NOT NULL,
    "accion" TEXT NOT NULL,
    "etiqueta" TEXT,
    "metadata" JSONB,
    "url" TEXT,
    "pathname" TEXT,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "eventos_tracking_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "clics_tracking" (
    "id" TEXT NOT NULL,
    "sesionId" TEXT NOT NULL,
    "busquedaId" TEXT,
    "productoId" TEXT NOT NULL,
    "entidadId" TEXT NOT NULL,
    "entidadNombre" TEXT NOT NULL,
    "entidadTipo" "TipoEntidad" NOT NULL,
    "posicion" INTEGER NOT NULL,
    "paginaResultados" INTEGER NOT NULL DEFAULT 1,
    "montoSolicitado" DECIMAL(15,2) NOT NULL,
    "plazoMeses" INTEGER NOT NULL,
    "tipoProducto" "TipoProducto" NOT NULL,
    "tasaOfrecida" DECIMAL(10,4) NOT NULL,
    "cuotaOfrecida" DECIMAL(15,2) NOT NULL,
    "edad" INTEGER NOT NULL,
    "ingresos" DECIMAL(15,2) NOT NULL,
    "tipoEmpleo" TEXT NOT NULL,
    "costoClic" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "esConversion" BOOLEAN NOT NULL DEFAULT false,
    "valorConversion" DECIMAL(10,2),
    "redireccionExitosa" BOOLEAN NOT NULL,
    "urlDestino" TEXT NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "clics_tracking_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "entidades_financieras_codigo_key" ON "entidades_financieras"("codigo");

-- CreateIndex
CREATE INDEX "productos_entidadId_idx" ON "productos"("entidadId");

-- CreateIndex
CREATE INDEX "productos_tipo_activo_idx" ON "productos"("tipo", "activo");

-- CreateIndex
CREATE INDEX "productos_montoMinimo_montoMaximo_idx" ON "productos"("montoMinimo", "montoMaximo");

-- CreateIndex
CREATE INDEX "scraper_configs_entidadId_idx" ON "scraper_configs"("entidadId");

-- CreateIndex
CREATE UNIQUE INDEX "scraper_configs_entidadId_tipo_key" ON "scraper_configs"("entidadId", "tipo");

-- CreateIndex
CREATE INDEX "scraping_logs_scraperConfigId_fecha_idx" ON "scraping_logs"("scraperConfigId", "fecha");

-- CreateIndex
CREATE INDEX "scraping_logs_fecha_idx" ON "scraping_logs"("fecha");

-- CreateIndex
CREATE INDEX "sesiones_fingerprint_idx" ON "sesiones"("fingerprint");

-- CreateIndex
CREATE INDEX "sesiones_inicioSesion_idx" ON "sesiones"("inicioSesion");

-- CreateIndex
CREATE INDEX "busquedas_sesionId_fecha_idx" ON "busquedas"("sesionId", "fecha");

-- CreateIndex
CREATE INDEX "busquedas_tipoProducto_fecha_idx" ON "busquedas"("tipoProducto", "fecha");

-- CreateIndex
CREATE INDEX "busquedas_montoSolicitado_plazoMeses_idx" ON "busquedas"("montoSolicitado", "plazoMeses");

-- CreateIndex
CREATE INDEX "busquedas_edad_ingresos_idx" ON "busquedas"("edad", "ingresos");

-- CreateIndex
CREATE INDEX "busquedas_generoClic_idx" ON "busquedas"("generoClic");

-- CreateIndex
CREATE INDEX "eventos_tracking_sesionId_fecha_idx" ON "eventos_tracking"("sesionId", "fecha");

-- CreateIndex
CREATE INDEX "eventos_tracking_tipoEvento_fecha_idx" ON "eventos_tracking"("tipoEvento", "fecha");

-- CreateIndex
CREATE INDEX "eventos_tracking_categoria_accion_idx" ON "eventos_tracking"("categoria", "accion");

-- CreateIndex
CREATE INDEX "clics_tracking_productoId_fecha_idx" ON "clics_tracking"("productoId", "fecha");

-- CreateIndex
CREATE INDEX "clics_tracking_entidadId_fecha_idx" ON "clics_tracking"("entidadId", "fecha");

-- CreateIndex
CREATE INDEX "clics_tracking_sesionId_idx" ON "clics_tracking"("sesionId");

-- CreateIndex
CREATE INDEX "clics_tracking_fecha_idx" ON "clics_tracking"("fecha");

-- CreateIndex
CREATE INDEX "clics_tracking_tipoProducto_montoSolicitado_idx" ON "clics_tracking"("tipoProducto", "montoSolicitado");

-- CreateIndex
CREATE INDEX "clics_tracking_posicion_idx" ON "clics_tracking"("posicion");

-- AddForeignKey
ALTER TABLE "productos" ADD CONSTRAINT "productos_entidadId_fkey" FOREIGN KEY ("entidadId") REFERENCES "entidades_financieras"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "scraper_configs" ADD CONSTRAINT "scraper_configs_entidadId_fkey" FOREIGN KEY ("entidadId") REFERENCES "entidades_financieras"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "scraping_logs" ADD CONSTRAINT "scraping_logs_scraperConfigId_fkey" FOREIGN KEY ("scraperConfigId") REFERENCES "scraper_configs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "busquedas" ADD CONSTRAINT "busquedas_sesionId_fkey" FOREIGN KEY ("sesionId") REFERENCES "sesiones"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "eventos_tracking" ADD CONSTRAINT "eventos_tracking_sesionId_fkey" FOREIGN KEY ("sesionId") REFERENCES "sesiones"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clics_tracking" ADD CONSTRAINT "clics_tracking_sesionId_fkey" FOREIGN KEY ("sesionId") REFERENCES "sesiones"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
