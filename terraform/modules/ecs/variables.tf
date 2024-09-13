
variable "cluster_name" {
  description = "The name of the ECS cluster"
  type        = string
  default     = "my-app-cluster"
}

variable "task_family" {
  description = "Task family for ECS task definition"
  type        = string
  default     = "my-app-task"
}

variable "cpu" {
  description = "CPU units for the ECS task"
  type        = number
  default     = 256
}

variable "memory" {
  description = "Memory for the ECS task"
  type        = number
  default     = 512
}

variable "container_image" {
  description = "Container image for the ECS task"
  type        = string
}

variable "container_port" {
  description = "Port the container listens on"
  type        = number
  default     = 80
}

variable "service_name" {
  description = "Name of the ECS service"
  type        = string
  default     = "my-app-service"
}

variable "desired_count" {
  description = "Desired number of ECS tasks"
  type        = number
  default     = 1
}

variable "subnets" {
  description = "List of subnet IDs for ECS service"
  type        = list(string)
}

variable "vpc_id" {
  description = "VPC ID for ECS service"
  type        = string
}
