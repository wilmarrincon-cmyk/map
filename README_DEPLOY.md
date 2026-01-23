# 🚀 Guía Rápida de Despliegue

## Inicio Rápido

```bash
# 1. Configurar variables de entorno
cp .env.example .env
# Editar .env con tus valores

# 2. Levantar todos los servicios
docker-compose up -d --build

# 3. Verificar que todo esté corriendo
docker-compose ps

# 4. Acceder a la aplicación
# Frontend: http://localhost:3000
# Backend: http://localhost:3001/api
```

## Comandos Esenciales

```bash
# Ver logs
docker-compose logs -f

# Detener servicios
docker-compose down

# Reiniciar servicios
docker-compose restart

# Reconstruir después de cambios
docker-compose up -d --build
```

## Estructura de Despliegue

```
┌─────────────────┐
│   Nginx (80/443)│
└────────┬────────┘
         │
    ┌────┴────┐
    │         │
┌───▼───┐ ┌──▼────┐
│Frontend│ │Backend│
│ :3000  │ │ :3001 │
└───┬───┘ └──┬────┘
    │        │
    └───┬────┘
        │
   ┌────▼────┐
   │PostgreSQL│
   │  :5432  │
   └─────────┘
```

Para más detalles, consulta [DEPLOY.md](./DEPLOY.md)
