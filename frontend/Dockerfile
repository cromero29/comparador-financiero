# ============================================
# Dockerfile Frontend - Comparador Financiero
# ============================================

# ============================================
# Etapa de build
# ============================================
FROM node:20-slim AS build

WORKDIR /app

# Copiar dependencias
COPY package*.json ./
RUN npm ci

# Copiar código fuente
COPY . .

# La URL del API se inyecta en build time desde Railway
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

# Compilar para producción
RUN npm run build

# ============================================
# Etapa de producción con Nginx
# ============================================
FROM nginx:alpine AS production

# Copiar build al directorio de Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Copiar configuración personalizada de Nginx
COPY nginx.conf /etc/nginx/templates/default.conf.template

# Railway inyecta PORT; Nginx lo usa vía envsubst en la plantilla
ENV PORT=8080
EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
