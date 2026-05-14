# Guía de Despliegue en Azure - Tutibocado Protocolos

Este documento describe la infraestructura y los pasos para el despliegue del sistema de protocolos en Azure.

## Arquitectura

- **Frontend:** Azure Static Web Apps (`protocolos-web`)
- **Backend (API):** Azure Container Apps (`protocolos-api`)
- **Base de Datos:** Azure Database for PostgreSQL Flexible Server (`protocolos-db-tuti`)
- **Grupo de Recursos:** `tutibocado-protocolos` (Ubicación: `eastus2`)

## Recursos Creados

### 1. Base de Datos (PostgreSQL)
- **Nombre:** `protocolos-db-tuti`
- **Host:** `protocolos-db-tuti.postgres.database.azure.com`
- **Base de datos:** `tutibocado_protocolos`
- **Usuario:** `tutiadmin`
- **Password:** `P@ssw0rd123!` (Configurado durante el despliegue inicial)
- **Puerto:** `5432`
- **SSL:** Requerido (`DB_SSL=true`)

### 2. API (Backend)
- **Nombre:** `protocolos-api`
- **Tecnología:** Azure Container Apps (Basado en Docker)
- **Ingress:** Externo, Puerto `4100`
- **URL:** https://protocolos-api.kindgrass-2c1da06a.eastus2.azurecontainerapps.io

### 3. Frontend
- **Nombre:** `protocolos-web`
- **Tecnología:** Azure Static Web Apps
- **URL:** `https://agreeable-smoke-040f06d0f.7.azurestaticapps.net`

## Pasos para el Despliegue (Manual)

### Requisitos
- Azure CLI instalado
- SWA CLI instalado (`npm install -g @azure/static-web-apps-cli`)

### Backend
1. Construir e implementar la imagen en Container Apps:
   ```bash
   az containerapp up --name protocolos-api --resource-group tutibocado-protocolos --location eastus2 --source ./backend --ingress external --target-port 4100 --env-vars DB_CLIENT=pg DB_HOST=protocolos-db-tuti.postgres.database.azure.com DB_PORT=5432 DB_DATABASE=tutibocado_protocolos DB_USER=tutiadmin DB_PASSWORD=P@ssw0rd123! DB_SSL=true JWT_ACCESS_SECRET=tu_secreto_aqui
   ```

### Frontend
1. Construir el proyecto:
   ```bash
   cd frontend
   npm run build
   ```
2. Desplegar a Static Web Apps:
   ```bash
   swa deploy ./dist --deployment-token 273f8dbb16be35d93beaaf7e3fdf7346b4a0aa0712013e741e444a252ceb807907-010b9be2-2105-4056-8a9f-02cc251b5b3600f1420040f06d0f --env production
   ```

## Mantenimiento y Base de Datos

Para correr migraciones o semillas desde el entorno local apuntando a Azure:
1. Asegúrate de que tu IP esté permitida en el firewall del servidor de base de datos.
2. Configura las variables de entorno de Azure en tu `.env`.
3. Ejecuta:
   ```bash
   npm run db:migrate
   npm run db:seed
   ```
