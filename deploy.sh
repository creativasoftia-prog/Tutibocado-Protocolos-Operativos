#!/bin/bash
# Script de despliegue automatizado para Azure (Tutibocado)
# Detener la ejecución si ocurre algún error
set -e

echo "=== [1/2] Iniciando despliegue de Backend a Azure Container Apps ==="
az containerapp up \
  --name protocolos-api \
  --resource-group tutibocado-protocolos \
  --location eastus2 \
  --source ./backend \
  --ingress external \
  --target-port 4100 \
  --env-vars \
    DB_CLIENT=pg \
    DB_HOST=protocolos-db-tuti.postgres.database.azure.com \
    DB_PORT=5432 \
    DB_DATABASE=tutibocado_protocolos \
    DB_USER=tutiadmin \
    DB_PASSWORD=P@ssw0rd123! \
    DB_SSL=true \
    JWT_ACCESS_SECRET=super_secret_key_for_production_123 \
    NODE_ENV=production

echo "=== Backend desplegado con éxito ==="

echo "=== [2/2] Preparando y construyendo Frontend ==="
cd frontend

# Asegurar dependencias instaladas y compilar
npm install
npm run build

echo "-> Desplegando Frontend a Azure Static Web Apps..."
npx @azure/static-web-apps-cli deploy ./dist \
  --deployment-token 273f8dbb16be35d93beaaf7e3fdf7346b4a0aa0712013e741e444a252ceb807907-010b9be2-2105-4056-8a9f-02cc251b5b3600f1420040f06d0f \
  --env production

echo "=== Frontend desplegado con éxito ==="
echo "=== ¡Proceso de Despliegue Finalizado con Éxito! ==="
