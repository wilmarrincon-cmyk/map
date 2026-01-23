.PHONY: help build up down restart logs clean

help: ## Mostrar esta ayuda
	@echo "Comandos disponibles:"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2}'

build: ## Construir las imágenes Docker
	docker-compose build

up: ## Levantar los servicios
	docker-compose up -d

down: ## Detener los servicios
	docker-compose down

restart: ## Reiniciar los servicios
	docker-compose restart

logs: ## Ver logs de todos los servicios
	docker-compose logs -f

logs-backend: ## Ver logs del backend
	docker-compose logs -f backend

logs-frontend: ## Ver logs del frontend
	docker-compose logs -f frontend

logs-db: ## Ver logs de la base de datos
	docker-compose logs -f postgres

ps: ## Ver estado de los servicios
	docker-compose ps

clean: ## Limpiar contenedores, imágenes y volúmenes
	docker-compose down -v
	docker system prune -f

rebuild: ## Reconstruir y levantar servicios
	docker-compose up -d --build

shell-backend: ## Abrir shell en el contenedor del backend
	docker-compose exec backend sh

shell-frontend: ## Abrir shell en el contenedor del frontend
	docker-compose exec frontend sh

shell-db: ## Abrir shell en el contenedor de PostgreSQL
	docker-compose exec postgres psql -U postgres -d pro_gerencia

backup-db: ## Crear backup de la base de datos
	docker-compose exec postgres pg_dump -U postgres pro_gerencia > backup_$(shell date +%Y%m%d_%H%M%S).sql
	@echo "Backup creado: backup_$(shell date +%Y%m%d_%H%M%S).sql"
