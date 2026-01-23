# Sistema de Gestión - Gerencia

Sistema integral de gestión con módulos de Apoyo Territorio, Seguimiento PMO, KPIs de Componentes y KPIs de Cargos.

## 🚀 Despliegue Rápido con Docker

```bash
# 1. Configurar variables de entorno
cp .env.example .env
# Editar .env con tus valores

# 2. Levantar todos los servicios
docker-compose up -d --build

# 3. Acceder a la aplicación
# Frontend: http://localhost:3000
# Backend: http://localhost:3001/api
```

Para más información sobre despliegue, consulta [DEPLOY.md](./DEPLOY.md)

---

## 📋 Descripción

Aplicación web interactiva para visualizar el mapa de Colombia con selección de departamentos y seguimiento de indicadores.

## 🏗️ Arquitectura

```
Gerencia/
├── frontend/          # Next.js 14 + TypeScript + Tailwind CSS
│   ├── src/
│   │   ├── app/           # App Router de Next.js
│   │   ├── components/    # Componentes React
│   │   ├── services/      # Servicios API
│   │   └── types/         # Tipos TypeScript
│   └── package.json
│
├── backend/           # NestJS + TypeORM + PostgreSQL
│   ├── src/
│   │   ├── departamentos/ # Módulo de departamentos
│   │   │   ├── entities/      # Entidades TypeORM
│   │   │   ├── dto/           # Data Transfer Objects
│   │   │   ├── departamentos.controller.ts
│   │   │   ├── departamentos.service.ts
│   │   │   └── departamentos.module.ts
│   │   ├── app.module.ts
│   │   └── main.ts
│   └── package.json
│
└── sql/               # Scripts SQL
    └── insert_dim_departamento.sql
```

## 🚀 Instalación

### Requisitos Previos

- Node.js 18+
- PostgreSQL con la tabla `report.dim_departamento`
- npm o yarn

### 1. Backend (NestJS)

```bash
cd backend

# Instalar dependencias
npm install

# Configurar variables de entorno
# Crear archivo .env con:
# DB_HOST=localhost
# DB_PORT=5442
# DB_USERNAME=postgres
# DB_PASSWORD=postgres
# DB_DATABASE=pro_gerencia
# PORT=3001

# Iniciar en desarrollo
npm run start:dev
```

### 2. Frontend (Next.js)

```bash
cd frontend

# Instalar dependencias
npm install

# Iniciar en desarrollo
npm run dev
```

### 3. Acceder a la aplicación

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001/api

## 📊 Base de Datos

### Tabla: `report.dim_departamento`

```sql
CREATE TABLE report.dim_departamento (
    codigo_dane INTEGER PRIMARY KEY,
    codigo VARCHAR(10) UNIQUE NOT NULL,
    departamento VARCHAR(100) NOT NULL,
    latitud NUMERIC(10,6),
    longitud NUMERIC(10,6)
);
```

### Insertar Datos

```bash
psql -h localhost -p 5442 -U postgres -d pro_gerencia -f sql/insert_dim_departamento.sql
```

## 🔌 API Endpoints

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/departamentos` | Lista todos los departamentos |
| GET | `/api/departamentos/dane/:codigoDane` | Obtiene por código DANE |
| GET | `/api/departamentos/codigo/:codigo` | Obtiene por código Highcharts |
| GET | `/api/departamentos/search?nombre=xxx` | Busca por nombre |

### Ejemplo de Respuesta

```json
[
  {
    "codigo_dane": 5,
    "codigo": "co-an",
    "departamento": "Antioquia",
    "latitud": 6.2476,
    "longitud": -75.5658,
    "value": 0
  }
]
```

## 🛠️ Tecnologías

### Frontend
- **Next.js 14** - Framework React con App Router
- **TypeScript** - Tipado estático
- **Tailwind CSS** - Estilos utilitarios
- **Highcharts Maps** - Mapas interactivos

### Backend
- **NestJS 10** - Framework Node.js
- **TypeORM** - ORM para PostgreSQL
- **class-validator** - Validación de DTOs

### Base de Datos
- **PostgreSQL** - Base de datos relacional

## 📁 Componentes Principales

### Frontend

| Componente | Descripción |
|------------|-------------|
| `MapaColombia` | Mapa interactivo con Highcharts |
| `SanAndresInset` | Inset SVG de San Andrés y Providencia |
| `FilterPanel` | Panel de filtros con selector |
| `InfoPanel` | Panel de información del departamento |

### Backend

| Archivo | Descripción |
|---------|-------------|
| `departamento.entity.ts` | Entidad TypeORM para `dim_departamento` |
| `departamentos.service.ts` | Lógica de negocio |
| `departamentos.controller.ts` | Endpoints REST |

## 🔧 Scripts Disponibles

### Frontend

```bash
npm run dev      # Desarrollo
npm run build    # Compilar producción
npm run start    # Iniciar producción
npm run lint     # Linter
```

### Backend

```bash
npm run start:dev   # Desarrollo con hot-reload
npm run start:prod  # Producción
npm run build       # Compilar
npm run lint        # Linter
```

## 🗺️ Mapeo de Códigos

| DANE | Highcharts | Departamento |
|------|------------|--------------|
| 5 | co-an | Antioquia |
| 8 | co-at | Atlántico |
| 11 | co-dc | Bogotá D.C. |
| 13 | co-bo | Bolívar |
| 15 | co-by | Boyacá |
| 17 | co-cl | Caldas |
| 18 | co-cq | Caquetá |
| 19 | co-ca | Cauca |
| 20 | co-ce | Cesar |
| 23 | co-co | Córdoba |
| 25 | co-cu | Cundinamarca |
| 27 | co-ch | Chocó |
| 41 | co-hu | Huila |
| 44 | co-lg | La Guajira |
| 47 | co-ma | Magdalena |
| 50 | co-me | Meta |
| 52 | co-na | Nariño |
| 54 | co-ns | Norte de Santander |
| 63 | co-qd | Quindío |
| 66 | co-ri | Risaralda |
| 68 | co-st | Santander |
| 70 | co-su | Sucre |
| 73 | co-to | Tolima |
| 76 | co-vc | Valle del Cauca |
| 81 | co-ar | Arauca |
| 85 | co-cs | Casanare |
| 86 | co-pu | Putumayo |
| 88 | co-sa | San Andrés y Providencia |
| 91 | co-am | Amazonas |
| 94 | co-gu | Guainía |
| 95 | co-gv | Guaviare |
| 97 | co-vp | Vaupés |
| 99 | co-vi | Vichada |
