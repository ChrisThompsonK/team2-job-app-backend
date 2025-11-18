# Team2 Job App Backend - Infrastructure

This directory contains the Terraform configuration for managing Azure infrastructure for the Team2 Job Application Backend.

## Directory Structure

```
infrastructure/
├── main.tf                    # Main infrastructure resources
├── provider.tf               # Provider and Terraform configuration
├── variables.tf              # Variable definitions
├── outputs.tf                # Output definitions
├── terraform.tfvars.example  # Example variables file
├── .gitignore                # Git ignore rules
├── environments/             # Environment-specific variables
│   └── dev.tfvars           # Development environment variables
└── modules/                  # Reusable Terraform modules
    ├── resource_group/       # Resource group module
    └── storage/              # Storage account module
```

## Quick Start

### Prerequisites

- Terraform >= 1.13
- Azure CLI installed and authenticated (`az login`)
- Appropriate Azure permissions

### Option 1: Use Setup Script (Recommended)

```bash
chmod +x ../scripts/setup-terraform-backend.sh
../scripts/setup-terraform-backend.sh dev uksouth
```

### Option 2: Manual Setup

```bash
cd infrastructure

# Create Azure resources
az group create --name rg-tfstate-dev --location uksouth
az storage account create --name tfstatedev[unique] --resource-group rg-tfstate-dev --sku Standard_LRS
az storage container create --name terraform-state --account-name tfstatedev[unique]

# Initialize Terraform
terraform init \
  -backend-config="storage_account_name=tfstatedev[unique]" \
  -backend-config="container_name=terraform-state" \
  -backend-config="key=dev.tfstate" \
  -backend-config="resource_group_name=rg-tfstate-dev"
```

### Deploy Infrastructure

```bash
# Plan changes
terraform plan -var-file="environments/dev.tfvars"

# Apply changes
terraform apply -var-file="environments/dev.tfvars"
```

### Validate Configuration

```bash
terraform validate
terraform fmt -check
```

## Infrastructure Components

### Resource Group
- **Name**: `RM-eayl-academy` (configurable via `resource_group_name` variable)
- **Location**: `uksouth` (configurable via `location` variable)
- **Purpose**: Container for all Azure resources for the Team2 Job Application Backend
- **Environment**: Development (configured in `dev.tfvars`)

### Storage Account (Application)
- **Name**: `team2jobappstg` (configurable via `storage_account_name` variable)
- **Type**: StorageV2
- **Tier**: Standard (configurable via `storage_account_tier` variable)
- **Replication**: LRS (configurable via `storage_replication_type` variable)
- **Purpose**: Application storage for data and file uploads
- **Security**: HTTPS only, TLS 1.2 minimum required, shared access keys enabled
- **Network**: Azure Services bypass enabled by default
- **Containers**:
  - `application-data`: Private container for application data
  - `uploads`: Private container for user uploads (CV attachments)

## Variables

See `variables.tf` for all available variables. Default values and current values (in `environments/dev.tfvars`) are:

**Core Variables:**
- `environment`: `dev` (dev, staging, or prod)
- `location`: `uksouth` (Azure region)
- `resource_group_name`: `RM-eayl-academy` (Azure resource group name)
- `project_name`: `team2-job-app-backend` (project identifier)

**Storage Variables:**
- `storage_account_name`: `team2jobappstg` (storage account name)
- `storage_account_tier`: `Standard` (Standard or Premium)
- `storage_replication_type`: `LRS` (LRS, GRS, RAGRS, ZRS)
- `enable_file_share`: `false` (optional Azure File Share)
- `file_share_quota_gb`: `100` (file share size if enabled)

**Tagging:**
- `tags`: Object with Environment, Project, ManagedBy, and CreatedDate

## Outputs

The following outputs are available after applying the configuration:

- `resource_group_name`: Name of the resource group
- `resource_group_id`: ID of the resource group
- `location`: Location of the resources
- `storage_account_name`: Name of the application storage account
- `storage_account_id`: ID of the storage account (sensitive)
- `storage_account_primary_blob_endpoint`: Primary blob endpoint URL
- `storage_container_names`: Object containing container names (data, uploads)

Retrieve outputs with:
```bash
terraform output
terraform output storage_account_name
terraform output storage_container_names
```

## State Management

The Terraform state is stored in Azure Blob Storage using remote backend configuration (via `-backend-config` flags during `terraform init`) for better team collaboration and security. State files are not committed to git (see `.gitignore`).

### Remote Backend Configuration

**Development Environment:**
- **Resource Group**: `rg-tfstate-dev` (created by setup script)
- **Storage Account**: `tfstatedev[unique]` (created by setup script)
- **Container**: `terraform-state`
- **Blob**: `dev.tfstate`
- **Key**: State file for development infrastructure

**Production Environment (future):**
- **Resource Group**: `rg-tfstate-prod` (to be created)
- **Storage Account**: `tfstateprod[unique]` (to be created)
- **Container**: `terraform-state`
- **Blob**: `prod.tfstate`
- **Key**: State file for production infrastructure

### Using the Setup Script

The easiest way to initialize a new environment is using the provided setup script:

```bash
./scripts/setup-terraform-backend.sh dev uksouth
```

### Manual Configuration

To configure the backend manually:

```bash
terraform init \
  -backend-config="resource_group_name=rg-tfstate-dev" \
  -backend-config="storage_account_name=tfstatedev" \
  -backend-config="container_name=terraform-state" \
  -backend-config="key=dev.tfstate"
```

## CI/CD Pipeline Integration

The GitHub Actions pipeline (`.github/workflows/cicd.yml`) automatically deploys infrastructure:

**Pipeline Stages:**
1. Code Quality & Testing
2. Build & Push Docker image to ACR (main only)
3. Terraform Plan (all branches)
4. Terraform Apply (main branch only)

### GitHub Secrets Required

Set these in your GitHub repository settings (Settings → Secrets and variables → Actions):

| Secret | Description | Source |
|--------|-------------|--------|
| `AZURE_CREDENTIALS` | Full Azure credentials JSON (appId, password, tenant, subscriptionId) | Service principal creation |
| `AZURE_CLIENT_ID` | Service principal app ID | Service principal creation (appId) |
| `AZURE_CLIENT_SECRET` | Service principal password | Service principal creation (password) |
| `AZURE_TENANT_ID` | Azure tenant ID | Service principal creation (tenant) |
| `AZURE_SUBSCRIPTION_ID` | Azure subscription ID | Azure account |
| `TERRAFORM_STORAGE_ACCOUNT_NAME` | Remote state storage account name | Setup script output (e.g., `tfstatedev...`) |
| `TERRAFORM_RESOURCE_GROUP` | Resource group for state storage | Setup script output (e.g., `rg-tfstate-dev`) |

### Setting Up Service Principal

Create a service principal for CI/CD authentication:

```bash
az ad sp create-for-rbac \
  --name "team2-job-app-ci-cd" \
  --role "Contributor" \
  --scopes "/subscriptions/{SUBSCRIPTION_ID}"
```

Save the output as JSON for the `AZURE_CREDENTIALS` secret.

### Pipeline Behavior

- **Feature branches**: Plan only (shows infrastructure changes)
- **Main branch**: Plan + Apply (deploys infrastructure automatically)

## Common Commands

```bash
# Format code
terraform fmt

# Validate configuration
terraform validate

# Show current state
terraform show

# Destroy infrastructure
terraform destroy -var-file="environments/dev.tfvars"

# Refresh state
terraform refresh

# Import existing resources
terraform import azurerm_resource_group.main /subscriptions/{subscriptionId}/resourceGroups/RM-eayl-academy

# View Terraform plan in JSON
terraform plan -json -var-file="environments/dev.tfvars" | jq .
```

## Security Considerations

1. **Sensitive Data**: Never commit `.tfvars` files containing sensitive data
2. **State File**: Terraform state contains sensitive information - ensure proper access controls
3. **Keys**: Storage account access keys are marked as sensitive in outputs
4. **Service Principal**: Use minimal permissions (Contributor role) and rotate credentials regularly
5. **Network Rules**: Storage account allows Azure Services by default
6. **Authentication**: Pipeline uses service principal; local development uses Azure CLI or managed identity

## Troubleshooting

### Backend Initialization Issues

If you encounter backend initialization errors:

```bash
# Remove existing backend state
rm -rf .terraform

# Re-initialize with correct backend config
terraform init \
  -backend-config="resource_group_name=rg-tfstate-dev" \
  -backend-config="storage_account_name=tfstatedev" \
  -backend-config="container_name=terraform-state" \
  -backend-config="key=dev.tfstate"
```

### Resource Already Exists

If resources already exist in Azure but not in state:

```bash
# Import the resource
terraform import azurerm_resource_group.main /subscriptions/{subscriptionId}/resourceGroups/RM-eayl-academy
```

### Pipeline Authentication Failures

If the CI/CD pipeline fails with authentication errors:

1. Verify all Azure secrets are correctly set in GitHub
2. Check service principal has correct permissions
3. Ensure subscription ID is correct
4. Verify service principal hasn't expired (if using time-limited credentials)

### Pipeline Plan Not Posting to PR

The plan comment posting is non-critical and fails gracefully. Check GitHub Actions logs if you need to debug.

## Additional Resources

- [Terraform Azure Provider Documentation](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs)
- [Azure Blob Storage Backend](https://www.terraform.io/language/settings/backends/azurerm)
- [Terraform Best Practices](https://www.terraform.io/cloud-docs/recommended-practices)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Azure Service Principal Documentation](https://docs.microsoft.com/en-us/azure/active-directory/develop/app-objects-and-service-principals)
