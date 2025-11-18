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
    container_name = "terraform-tfstate-ai"
    key = "team2-job-app-backend.tfstate"
  }
}

provider "azurerm" {
  features {}
}
