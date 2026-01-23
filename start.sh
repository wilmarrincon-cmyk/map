#!/bin/bash

# Script para iniciar el sistema completo con Docker

echo "🚀 Iniciando Sistema de Gestión Gerencia..."

# Verificar que Docker esté instalado
if ! command -v docker &> /dev/null; then
    echo "❌ Docker no está instalado. Por favor instala Docker primero."
    exit 1
fi

# Verificar que Docker Compose esté instalado
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose no está instalado. Por favor instala Docker Compose primero."
    exit 1
fi

# Verificar si existe archivo .env
if [ ! -f .env ]; then
    echo "⚠️  Archivo .env no encontrado. Creando desde .env.example..."
    cp .env.example .env
    echo "✅ Archivo .env creado. Por favor edítalo con tus valores antes de continuar."
    echo "📝 Editando .env..."
    ${EDITOR:-nano} .env
fi

# Construir y levantar servicios
echo "🔨 Construyendo imágenes Docker..."
docker-compose build

echo "🚀 Levantando servicios..."
docker-compose up -d

# Esperar a que los servicios estén listos
echo "⏳ Esperando a que los servicios estén listos..."
sleep 10

# Verificar estado
echo "📊 Estado de los servicios:"
docker-compose ps

echo ""
echo "✅ Sistema iniciado correctamente!"
echo ""
echo "📍 Accede a la aplicación en:"
echo "   Frontend: http://localhost:3000"
echo "   Backend:  http://localhost:3001/api"
echo ""
echo "📋 Para ver logs: docker-compose logs -f"
echo "🛑 Para detener: docker-compose down"
