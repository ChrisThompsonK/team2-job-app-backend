output "resource_group_name" {
  value       = azurerm_resource_group.main.name
  description = "Name of the resource group"
}

output "resource_group_id" {
  value       = azurerm_resource_group.main.id
  description = "ID of the resource group"
}

output "location" {
  value       = azurerm_resource_group.main.location
  description = "Location of the resources"
}

output "storage_account_name" {
  value       = azurerm_storage_account.app.name
  description = "Name of the storage account"
}

output "storage_account_id" {
  value       = azurerm_storage_account.app.id
  description = "ID of the storage account"
  sensitive   = true
}

output "storage_account_primary_blob_endpoint" {
  value       = azurerm_storage_account.app.primary_blob_endpoint
  description = "Primary blob endpoint of the storage account"
}

output "storage_container_names" {
  value = {
    data    = azurerm_storage_container.data.name
    uploads = azurerm_storage_container.uploads.name
  }
  description = "Names of the storage containers"
}
