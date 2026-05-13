#!/bin/bash
# Script para preparar y desplegar en Azure App Service

RG="AlacenTuttibocado"
PLAN="tutibocado-plan"
APP_NAME="tutibocado-protocolos-api"
LOCATION="eastus"

echo "Preparando Azure App Service..."

# Crear Plan de App Service si no existe
az appservice plan create --name $PLAN --resource-group $RG --sku B1 --is-linux --location $LOCATION

# Crear App Service si no existe
az webapp create --resource-group $RG --plan $PLAN --name $APP_NAME --runtime "NODE|20-lts"

# Configurar variables de entorno en Azure
az webapp config appsettings set --resource-group $RG --name $APP_NAME --settings \
  NODE_ENV=production \
  DB_CLIENT=mssql \
  DB_SERVER=talleres.database.windows.net \
  DB_DATABASE=tutibocado-protocolos \
  DB_USER=sa \
  DB_PASSWORD=roberto123 \
  DB_ENCRYPT=true \
  DB_TRUST_SERVER_CERTIFICATE=false \
  JWT_ACCESS_SECRET=$(openssl rand -base64 32) \
  PORT=8080

echo "Configuración completada. Para desplegar el código, usa: az webapp up --name $APP_NAME"
