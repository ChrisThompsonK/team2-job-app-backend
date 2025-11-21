# General Configuration
location            = "uksouth"
environment         = "dev"
resource_group_name = "team2-job-app-backend-rg"

# Container Registry Configuration
acr_name                = "aiacademy25"
acr_resource_group_name = "container-registry"

# Key Vault Configuration
key_vault_name                = "team2-job-app-keyvault"
key_vault_resource_group_name = "team2-job-app-shared-rg"

# Container App Environment Configuration
container_app_environment_name                = "team2-job-app-container-app-environment"
container_app_environment_resource_group_name = "team2-job-app-shared-rg"

# Container App Configuration
container_image_tag = "946fa3e"
container_cpu       = "0.5"
container_memory    = "1Gi"
container_port      = 8000

# Application Configuration
app_name        = "team2-job-app-backend"
