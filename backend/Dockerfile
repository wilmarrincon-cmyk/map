# Etapa 1: Construcción
FROM node:18-alpine AS builder

WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./
COPY tsconfig*.json ./

# Instalar dependencias
RUN npm ci

# Copiar código fuente
COPY . .

# Construir la aplicación
RUN npm run build

# Etapa 2: Producción
FROM node:18-alpine AS production

WORKDIR /app

# Crear usuario no root
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nestjs -u 1001

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar solo dependencias de producción
RUN npm ci --only=production && npm cache clean --force

# Copiar archivos construidos desde la etapa de construcción
COPY --from=builder --chown=nestjs:nodejs /app/dist ./dist

# Cambiar al usuario no root
USER nestjs

# Exponer puerto
EXPOSE 3001

# Variables de entorno por defecto
ENV NODE_ENV=production
ENV PORT=3001

# Comando para iniciar la aplicación
CMD ["node", "dist/main.js"]
