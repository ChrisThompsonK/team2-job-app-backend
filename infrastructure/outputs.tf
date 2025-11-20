output "resource_group_name" {
  value       = azurerm_resource_group.main.name
  description = "Name of the resource group"
}

output "resource_group_id" {
  value       = azurerm_resource_group.main.id
  description = "ID of the resource group"
}

output "managed_identity_principal_id" {
  value       = azurerm_user_assigned_identity.container_identity.principal_id
  description = "Principal ID of the managed identity (for role assignments)"
}

output "managed_identity_client_id" {
  value       = azurerm_user_assigned_identity.container_identity.client_id
  description = "Client ID of the managed identity (for app configuration)"
}

output "managed_identity_id" {
  value       = azurerm_user_assigned_identity.container_identity.id
  description = "Full resource ID of the managed identity"
}
