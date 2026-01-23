# Etapa 1: Dependencias
FROM node:18-alpine AS deps

WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./
RUN npm ci

# Etapa 2: Construcción
FROM node:18-alpine AS builder

WORKDIR /app

# Copiar dependencias desde la etapa anterior
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Variables de entorno para build
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

# Construir la aplicación
RUN npm run build

# Etapa 3: Producción
FROM node:18-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Crear usuario no root
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001

# Copiar archivos necesarios
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Cambiar al usuario no root
USER nextjs

# Exponer puerto
EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Comando para iniciar la aplicación
CMD ["node", "server.js"]
