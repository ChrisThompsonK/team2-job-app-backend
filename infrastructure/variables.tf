variable "environment" {
  type        = string
  description = "Environment name (dev, staging, prod)"
  validation {
    condition     = contains(["dev", "staging", "prod"], var.environment)
    error_message = "Environment must be dev, staging, or prod."
  }
}

variable "location" {
  type        = string
  description = "Azure region for resources"
  default     = "uksouth"
}

variable "project_name" {
  type        = string
  description = "Project name for resource naming"
  default     = "team2-job-app-backend"
}

variable "resource_group_name" {
  type        = string
  description = "Name of the resource group"
  default     = "aiacademy25"
}

# Application Storage
variable "storage_account_name" {
  type        = string
  description = "Name of the application storage account"
  default     = "aistatemgmt"
}

variable "tags" {
  type = object({
    Environment = string
    Project     = string
    ManagedBy   = string
    CreatedDate = string
  })
  description = "Common tags to apply to resources"
  default = {
    Environment = "dev"
    Project     = "team2-job-app-backend"
    ManagedBy   = "Terraform"
    CreatedDate = "2025-11-12"
  }
}

variable "storage_account_tier" {
  type        = string
  description = "Storage account tier (Standard or Premium)"
  default     = "Standard"
}

variable "storage_replication_type" {
  type        = string
  description = "Storage account replication type (LRS, GRS, RAGRS, ZRS)"
  default     = "LRS"
}

variable "enable_file_share" {
  type        = bool
  description = "Enable Azure File Share for the storage account"
  default     = false
}

variable "file_share_quota_gb" {
  type        = number
  description = "Quota for file share in GB"
  default     = 100
}
