#!/bin/bash

# Setup Terraform Remote Backend in Azure Storage
# Usage: ./setup-terraform-backend.sh <environment> [location]
# Example: ./setup-terraform-backend.sh dev uksouth

set -e

ENVIRONMENT="${1:-dev}"
LOCATION="${2:-uksouth}"

# Validate inputs
if [[ ! "$ENVIRONMENT" =~ ^(dev|staging|prod)$ ]]; then
    echo "Error: Environment must be dev, staging, or prod"
    exit 1
fi

# Check prerequisites
if ! command -v az &> /dev/null; then
    echo "Error: Azure CLI is not installed"
    exit 1
fi

if ! command -v terraform &> /dev/null; then
    echo "Error: Terraform is not installed"
    exit 1
fi

echo "Setting up Terraform backend for: $ENVIRONMENT"

# Resource names
RESOURCE_GROUP="rg-tfstate-${ENVIRONMENT}"
STORAGE_ACCOUNT="tfstate${ENVIRONMENT}$(date +%s | md5sum | head -c 6)"
CONTAINER="terraform-state"
STATE_FILE="${ENVIRONMENT}.tfstate"

# Get subscription
SUBSCRIPTION=$(az account show --query id -o tsv)
echo "Using subscription: $SUBSCRIPTION"

# Create resource group
az group create --name "$RESOURCE_GROUP" --location "$LOCATION" --tags Environment="$ENVIRONMENT" ManagedBy="Terraform"
echo "✓ Resource group created: $RESOURCE_GROUP"

# Create storage account
az storage account create \
  --name "$STORAGE_ACCOUNT" \
  --resource-group "$RESOURCE_GROUP" \
  --location "$LOCATION" \
  --sku "Standard_LRS" \
  --kind "StorageV2" \
  --https-only true \
  --min-tls-version "TLS1_2"
echo "✓ Storage account created: $STORAGE_ACCOUNT"

# Create container
az storage container create \
  --name "$CONTAINER" \
  --account-name "$STORAGE_ACCOUNT"
echo "✓ Container created: $CONTAINER"

# Initialize Terraform
cd infrastructure
terraform init \
  -backend-config="storage_account_name=$STORAGE_ACCOUNT" \
  -backend-config="container_name=$CONTAINER" \
  -backend-config="key=$STATE_FILE" \
  -backend-config="resource_group_name=$RESOURCE_GROUP"

echo ""
echo "✓ Terraform backend configured"
echo ""
echo "Add these GitHub secrets:"
echo "  TERRAFORM_STORAGE_ACCOUNT_NAME: $STORAGE_ACCOUNT"
echo "  TERRAFORM_RESOURCE_GROUP: $RESOURCE_GROUP"

