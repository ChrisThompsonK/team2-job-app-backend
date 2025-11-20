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

output "acr_login_server" {
  value       = data.azurerm_container_registry.acr.login_server
  description = "Login server URL for the Azure Container Registry"
}

output "key_vault_uri" {
  value       = data.azurerm_key_vault.kv.vault_uri
  description = "URI of the Key Vault"
}

output "role_assignments" {
  value = {
    acr_pull_id        = azurerm_role_assignment.acr_pull.id
    kv_secrets_user_id = azurerm_role_assignment.kv_secrets_user.id
  }
  description = "IDs of the role assignments created"
}
