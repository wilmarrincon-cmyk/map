@echo off
REM Script para iniciar el sistema completo con Docker en Windows

echo 🚀 Iniciando Sistema de Gestión Gerencia...

REM Verificar que Docker esté instalado
docker --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Docker no está instalado. Por favor instala Docker Desktop primero.
    pause
    exit /b 1
)

REM Verificar que Docker Compose esté instalado
docker-compose --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Docker Compose no está instalado. Por favor instala Docker Desktop primero.
    pause
    exit /b 1
)

REM Verificar si existe archivo .env
if not exist .env (
    echo ⚠️  Archivo .env no encontrado. Creando desde .env.example...
    copy .env.example .env
    echo ✅ Archivo .env creado. Por favor edítalo con tus valores antes de continuar.
    pause
)

REM Construir y levantar servicios
echo 🔨 Construyendo imágenes Docker...
docker-compose build

echo 🚀 Levantando servicios...
docker-compose up -d

REM Esperar a que los servicios estén listos
echo ⏳ Esperando a que los servicios estén listos...
timeout /t 10 /nobreak >nul

REM Verificar estado
echo 📊 Estado de los servicios:
docker-compose ps

echo.
echo ✅ Sistema iniciado correctamente!
echo.
echo 📍 Accede a la aplicación en:
echo    Frontend: http://localhost:3000
echo    Backend:  http://localhost:3001/api
echo.
echo 📋 Para ver logs: docker-compose logs -f
echo 🛑 Para detener: docker-compose down
echo.
pause
