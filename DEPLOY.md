# Guía de Despliegue - Sistema de Gestión Gerencia

Esta guía explica cómo desplegar el sistema completo usando Docker.

---

## 📋 Requisitos Previos

- Docker Engine 20.10 o superior
- Docker Compose 2.0 o superior
- Al menos 2GB de RAM disponible
- Puerto 3000, 3001 y 5442 disponibles

---

## 🚀 Despliegue Rápido

### 1. Clonar o preparar el repositorio

```bash
# Asegúrate de estar en el directorio raíz del proyecto
cd Gerencia
```

### 2. Configurar variables de entorno

Copia el archivo de ejemplo y ajusta las variables según tu entorno:

```bash
cp .env.example .env
```

Edita `.env` con tus valores:

```env
DB_HOST=postgres
DB_PORT=5442
DB_USERNAME=postgres
DB_PASSWORD=tu_password_seguro
DB_DATABASE=pro_gerencia

NODE_ENV=production
PORT=3001

NEXT_PUBLIC_API_URL=http://localhost:3001
```

**Nota:** En producción, cambia `NEXT_PUBLIC_API_URL` por la URL real de tu servidor.

### 3. Construir y levantar los servicios

```bash
docker-compose up -d --build
```

Este comando:
- Construye las imágenes de Docker para backend y frontend
- Descarga la imagen de PostgreSQL
- Crea los contenedores
- Inicia todos los servicios en segundo plano

### 4. Verificar el estado

```bash
docker-compose ps
```

Deberías ver 3 servicios corriendo:
- `gerencia-postgres` (Base de datos)
- `gerencia-backend` (API NestJS)
- `gerencia-frontend` (Aplicación Next.js)

### 5. Ver los logs

```bash
# Ver todos los logs
docker-compose logs -f

# Ver logs de un servicio específico
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f postgres
```

---

## 🌐 Acceder a la Aplicación

Una vez que los servicios estén corriendo:

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:3001/api
- **Base de Datos:** localhost:5442

---

## 🔧 Comandos Útiles

### Detener los servicios

```bash
docker-compose down
```

### Detener y eliminar volúmenes (⚠️ Elimina datos de BD)

```bash
docker-compose down -v
```

### Reiniciar un servicio específico

```bash
docker-compose restart backend
docker-compose restart frontend
```

### Reconstruir después de cambios

```bash
docker-compose up -d --build
```

### Ver el estado de salud de los servicios

```bash
docker-compose ps
```

---

## 🐳 Despliegue en Producción

### 1. Configurar variables de entorno de producción

Crea un archivo `.env.production`:

```env
DB_HOST=postgres
DB_PORT=5432
DB_USERNAME=postgres_prod
DB_PASSWORD=password_super_seguro
DB_DATABASE=pro_gerencia

NODE_ENV=production
PORT=3001

# IMPORTANTE: Cambiar por la URL real de tu servidor
NEXT_PUBLIC_API_URL=https://api.tudominio.com
```

### 2. Usar docker-compose con archivo de producción

```bash
docker-compose -f docker-compose.yml --env-file .env.production up -d --build
```

### 3. Configurar un proxy reverso (Nginx recomendado)

Ejemplo de configuración Nginx:

```nginx
server {
    listen 80;
    server_name tudominio.com;

    # Frontend
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

### 4. Configurar SSL/HTTPS (Let's Encrypt)

```bash
# Instalar certbot
sudo apt-get update
sudo apt-get install certbot python3-certbot-nginx

# Obtener certificado
sudo certbot --nginx -d tudominio.com
```

---

## 📊 Monitoreo y Mantenimiento

### Ver uso de recursos

```bash
docker stats
```

### Backup de base de datos

```bash
# Crear backup
docker exec gerencia-postgres pg_dump -U postgres pro_gerencia > backup_$(date +%Y%m%d_%H%M%S).sql

# Restaurar backup
docker exec -i gerencia-postgres psql -U postgres pro_gerencia < backup.sql
```

### Limpiar recursos no utilizados

```bash
# Eliminar imágenes no utilizadas
docker image prune -a

# Eliminar contenedores detenidos
docker container prune

# Limpiar todo (⚠️ Cuidado)
docker system prune -a
```

---

## 🔒 Seguridad

### Recomendaciones de producción:

1. **Cambiar contraseñas por defecto:**
   - Cambiar `DB_PASSWORD` en `.env`
   - Usar contraseñas seguras y únicas

2. **Configurar firewall:**
   - Solo exponer puertos necesarios (80, 443)
   - Bloquear acceso directo a PostgreSQL (puerto 5442)

3. **Usar variables de entorno seguras:**
   - No commitear archivos `.env` al repositorio
   - Usar secretos de Docker o servicios de gestión de secretos

4. **Actualizar regularmente:**
   ```bash
   docker-compose pull
   docker-compose up -d --build
   ```

---

## 🐛 Solución de Problemas

### El backend no se conecta a la base de datos

1. Verificar que PostgreSQL esté corriendo:
   ```bash
   docker-compose ps postgres
   ```

2. Verificar las variables de entorno:
   ```bash
   docker-compose exec backend env | grep DB_
   ```

3. Verificar logs:
   ```bash
   docker-compose logs postgres
   docker-compose logs backend
   ```

### El frontend no puede conectarse al backend

1. Verificar que `NEXT_PUBLIC_API_URL` esté configurado correctamente
2. Verificar que el backend esté accesible:
   ```bash
   curl http://localhost:3001/api/departamentos
   ```

### Problemas de permisos

Si hay problemas con permisos de archivos:

```bash
# En Linux/Mac
sudo chown -R $USER:$USER .
```

---

## 📝 Notas Adicionales

- Los datos de PostgreSQL se almacenan en un volumen Docker persistente
- Los logs se pueden ver con `docker-compose logs`
- Para desarrollo local, usa `docker-compose up` sin `-d` para ver logs en tiempo real

---

## ✅ Verificación Post-Despliegue

1. ✅ Frontend accesible en http://localhost:3000
2. ✅ Backend responde en http://localhost:3001/api/departamentos
3. ✅ Base de datos conectada (verificar logs del backend)
4. ✅ Todos los servicios con estado "healthy" en `docker-compose ps`

---

**Última actualización:** $(Get-Date -Format "yyyy-MM-dd")
