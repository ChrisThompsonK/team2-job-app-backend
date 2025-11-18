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

variable "resource_group_name" {
  type        = string
  description = "Name of the resource group"
  default     = "aiacademy25"
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
