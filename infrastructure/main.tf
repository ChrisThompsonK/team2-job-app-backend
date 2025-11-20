# Resource Group
resource "azurerm_resource_group" "main" {
  name     = var.resource_group_name
  location = var.location

   tags = {
    Environment = var.environment
    Application = var.app_name
    ManagedBy   = "Terraform"
  }

}
# User-Assigned Managed Identity for Container App
resource "azurerm_user_assigned_identity" "container_identity" {
  name                = var.app_name
  resource_group_name = azurerm_resource_group.main.name
  location            = azurerm_resource_group.main.location
 
  tags = {
    Environment = var.environment
    Application = var.app_name
  }
}
 
# Role Assignment: Grant AcrPull to Managed Identity
resource "azurerm_role_assignment" "acr_pull" {
  scope                = data.azurerm_container_registry.acr.id
  role_definition_name = "AcrPull"
  principal_id         = azurerm_user_assigned_identity.container_identity.principal_id
}
 
# Role Assignment: Grant Key Vault Secrets User to Managed Identity
resource "azurerm_role_assignment" "kv_secrets_user" {
  scope                = data.azurerm_key_vault.kv.id
  role_definition_name = "Key Vault Secrets User"
  principal_id         = azurerm_user_assigned_identity.container_identity.principal_id
}