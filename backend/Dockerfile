# ============================================
# Dockerfile Backend - Comparador Financiero
# ============================================
FROM node:20-slim AS base

# Instalar dependencias del sistema para Puppeteer/Chromium
RUN apt-get update && apt-get install -y \
    chromium \
    fonts-liberation \
    libasound2 \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libc6 \
    libcairo2 \
    libcups2 \
    libdbus-1-3 \
    libexpat1 \
    libfontconfig1 \
    libgbm1 \
    libgcc1 \
    libglib2.0-0 \
    libgtk-3-0 \
    libnspr4 \
    libnss3 \
    libpango-1.0-0 \
    libpangocairo-1.0-0 \
    libstdc++6 \
    libx11-6 \
    libx11-xcb1 \
    libxcb1 \
    libxcomposite1 \
    libxcursor1 \
    libxdamage1 \
    libxext6 \
    libxfixes3 \
    libxi6 \
    libxrandr2 \
    libxrender1 \
    libxss1 \
    libxtst6 \
    lsb-release \
    wget \
    xdg-utils \
    openssl \
    && rm -rf /var/lib/apt/lists/*

# Puppeteer usará el Chromium del sistema (no descargar el propio)
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

WORKDIR /app

# ============================================
# Etapa de build
# ============================================
FROM base AS build

# Copiar archivos de dependencias
COPY package*.json ./
COPY prisma ./prisma/

# Instalar todas las dependencias (incluye dev para compilar)
RUN npm ci

# Generar Prisma Client
RUN npx prisma generate

# Copiar código fuente
COPY . .

# Compilar TypeScript
RUN npm run build

# ============================================
# Etapa de producción
# ============================================
FROM base AS production

ENV NODE_ENV=production

# Copiar dependencias de producción
COPY package*.json ./
COPY prisma ./prisma/
RUN npm ci --omit=dev

# Generar Prisma Client en producción
RUN npx prisma generate

# Copiar código compilado desde la etapa de build
COPY --from=build /app/dist ./dist

# Crear carpeta de logs
RUN mkdir -p logs

# Exponer puerto (Railway inyecta PORT dinámicamente)
EXPOSE 4000

# Ejecutar migraciones y arrancar el servidor
CMD npx prisma migrate deploy && node dist/index.js
