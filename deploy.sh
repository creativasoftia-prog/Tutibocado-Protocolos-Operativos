#!/bin/bash
# Script de despliegue automatizado para Azure (Tutibocado)
# Detener la ejecución si ocurre algún error
set -e

# Asegurar que estamos en el directorio del script
cd "$(dirname "$0")"

deploy_backend() {
  echo "=== Iniciando despliegue de Backend a Azure Container Apps ==="
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
}

deploy_frontend() {
  echo "=== Preparando y construyendo Frontend ==="
  cd frontend

  # Asegurar dependencias instaladas y compilar
  npm install
  npm run build

  echo "-> Obteniendo token de despliegue desde Azure..."
  DEPLOY_TOKEN=$(az staticwebapp secrets list \
    --name "protocolos-web" \
    --resource-group "tutibocado-protocolos" \
    --query "properties.apiKey" \
    --output tsv)

  if [ -z "$DEPLOY_TOKEN" ]; then
    echo "Error: No se pudo recuperar el token de despliegue. Asegúrate de estar autenticado en Azure CLI (az login)."
    exit 1
  fi

  echo "-> Desplegando Frontend a Azure Static Web Apps..."
  npx @azure/static-web-apps-cli deploy ./dist \
    --deployment-token "$DEPLOY_TOKEN" \
    --env production

  cd ..
  echo "=== Frontend desplegado con éxito ==="
}

CHOICE=""

if [ -n "$1" ]; then
  # Si se pasa un argumento por línea de comandos
  case "$1" in
    backend|back|1)
      CHOICE="1"
      ;;
    frontend|front|2)
      CHOICE="2"
      ;;
    both|todos|all|3)
      CHOICE="3"
      ;;
    *)
      echo "Argumento no válido: $1"
      echo "Uso: $0 [backend|frontend|both]"
      exit 1
      ;;
  esac
else
  # Menú interactivo
  echo "================================================="
  echo "     Seleccione el componente a desplegar        "
  echo "================================================="
  echo " 1) Backend (Azure Container Apps)"
  echo " 2) Frontend (Azure Static Web Apps)"
  echo " 3) Ambos (Backend y Frontend)"
  echo " 4) Cancelar"
  echo "================================================="
  read -p "Ingrese una opción (1-4): " opt
  case "$opt" in
    1) CHOICE="1" ;;
    2) CHOICE="2" ;;
    3) CHOICE="3" ;;
    *) echo "Operación cancelada."; exit 0 ;;
  esac
fi

if [ "$CHOICE" = "1" ] || [ "$CHOICE" = "3" ]; then
  deploy_backend
fi

if [ "$CHOICE" = "2" ] || [ "$CHOICE" = "3" ]; then
  deploy_frontend
fi

echo "=== ¡Proceso de Despliegue Finalizado con Éxito! ==="
