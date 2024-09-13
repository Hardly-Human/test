
output "ecs_service_name" {
  description = "Name of the ECS service"
  value       = aws_ecs_service.app_service.name
}
