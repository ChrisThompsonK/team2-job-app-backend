terraform {
  required_version = ">= 1.13"
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 3.0"
    }
  }
  backend "azurerm" {
    resource_group_name = "terraform-state-mgmt"
    storage_account_name = "aistatemgmt"
    container_name = "team2-job-app-backend"
    key = "team2-job-app-backend.tfstate"
  }
}

# Configure the Azure Provider
# Supports multiple authentication methods:
# - Interactive: Uses Azure CLI credentials (local development)
# - Service Principal: Uses AZURE_CLIENT_ID, AZURE_CLIENT_SECRET, AZURE_TENANT_ID (CI/CD pipelines)
# - Managed Identity: Uses system/user-assigned identities (Azure-hosted environments)
provider "azurerm" {
  features {
    storage_account {
      add_cors_rules        = true
      authentication        = true
      default_rules_enabled = false
    }
  }

  # Service Principal authentication will be used in CI/CD pipelines
  # The following environment variables must be set:
  # - ARM_CLIENT_ID: Service Principal application ID
  # - ARM_CLIENT_SECRET: Service Principal password/certificate
  # - ARM_TENANT_ID: Azure tenant ID
  # - ARM_SUBSCRIPTION_ID: Target subscription ID
  # These are typically provided via GitHub Actions secrets
}
