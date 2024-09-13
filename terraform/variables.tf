
variable "bucket_name" {
  description = "The name of the S3 bucket"
  type        = string
  default     = "my-app-image-bucket"
}

variable "region" {
  description = "AWS region"
  type        = string
  default     = "us-east-1"
}

variable "cluster_name" {
  description = "The name of the ECS cluster"
  type        = string
  default     = "my-app-cluster"
}

variable "container_image" {
  description = "Container image for ECS"
  type        = string
}

variable "subnets" {
  description = "Subnets for the ECS service"
  type        = list(string)
}

variable "vpc_id" {
  description = "VPC ID for ECS"
  type        = string
}
