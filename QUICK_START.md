# 🚀 Inicio Rápido - Sistema de Gestión Gerencia

## Requisitos

- Docker Desktop instalado y corriendo
- Puertos 3000, 3001 y 5442 disponibles

## Pasos para Desplegar

### 1. Configurar Variables de Entorno

```bash
# Copiar archivo de ejemplo
cp .env.example .env

# Editar .env con tus valores (opcional, los valores por defecto funcionan)
```

### 2. Iniciar el Sistema

**Windows:**
```bash
start.bat
```

**Linux/Mac:**
```bash
chmod +x start.sh
./start.sh
```

**O manualmente:**
```bash
docker-compose up -d --build
```

### 3. Verificar que Todo Funciona

```bash
# Ver estado de los servicios
docker-compose ps

# Ver logs
docker-compose logs -f
```

### 4. Acceder a la Aplicación

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:3001/api

## Comandos Útiles

```bash
# Detener servicios
docker-compose down

# Ver logs
docker-compose logs -f

# Reiniciar un servicio
docker-compose restart backend
docker-compose restart frontend

# Reconstruir después de cambios
docker-compose up -d --build
```

## Solución de Problemas

### Los servicios no inician

1. Verificar que Docker esté corriendo
2. Verificar logs: `docker-compose logs`
3. Verificar puertos disponibles

### El backend no se conecta a la BD

1. Verificar que PostgreSQL esté corriendo: `docker-compose ps postgres`
2. Verificar variables de entorno en `.env`
3. Ver logs: `docker-compose logs postgres backend`

Para más información, consulta [DEPLOY.md](./DEPLOY.md)
