data "azurerm_subscription" "current" {}

# Resource Group
resource "azurerm_resource_group" "main" {
  name     = var.resource_group_name
  location = var.location

  tags = merge(
    var.tags,
    {
      Environment = var.environment
    }
  )
}

# Application Storage Account
resource "azurerm_storage_account" "app" {
  name                            = var.storage_account_name
  resource_group_name             = azurerm_resource_group.main.name
  location                        = azurerm_resource_group.main.location
  account_tier                    = var.storage_account_tier
  account_replication_type        = var.storage_replication_type
  account_kind                    = "StorageV2"
  access_tier                     = "Hot"
  https_traffic_only_enabled      = true
  min_tls_version                 = "TLS1_2"
  shared_access_key_enabled       = true
  cross_tenant_replication_enabled = false

  tags = merge(
    var.tags,
    {
      Purpose = "ApplicationStorage"
    }
  )
}

# Storage Account Network Rules
resource "azurerm_storage_account_network_rules" "app" {
  storage_account_id = azurerm_storage_account.app.id
  default_action     = "Allow"
  bypass              = ["AzureServices"]
}

# Storage Container for Application Data
resource "azurerm_storage_container" "data" {
  name                  = "application-data"
  storage_account_name  = azurerm_storage_account.app.name
  container_access_type = "private"
}

# Storage Container for Uploads
resource "azurerm_storage_container" "uploads" {
  name                  = "uploads"
  storage_account_name  = azurerm_storage_account.app.name
  container_access_type = "private"
}
