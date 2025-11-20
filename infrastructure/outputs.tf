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

output "container_app_name" {
  value       = azurerm_container_app.backend.name
  description = "Name of the Container App"
}

output "container_app_fqdn" {
  value       = azurerm_container_app.backend.ingress[0].fqdn
  description = "Fully Qualified Domain Name (FQDN) of the Container App (internal only)"
}

output "container_app_url" {
  value       = "http://${azurerm_container_app.backend.ingress[0].fqdn}"
  description = "Full URL to access the Container App (internal only, use http)"
}

output "container_app_id" {
  value       = azurerm_container_app.backend.id
  description = "Resource ID of the Container App"
}

output "container_app_latest_revision_name" {
  value       = azurerm_container_app.backend.latest_revision_name
  description = "Name of the latest revision"
}
