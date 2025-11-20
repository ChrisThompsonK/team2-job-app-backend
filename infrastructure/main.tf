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

# Note: Role assignments for ACR and Key Vault will be added later
# when Container Apps are deployed and data sources are configured