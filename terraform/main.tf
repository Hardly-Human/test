
provider "aws" {
  region = var.region
}

module "s3" {
  source      = "./modules/s3"
  bucket_name = var.bucket_name
}

module "ecs" {
  source         = "./modules/ecs"
  cluster_name   = var.cluster_name
  container_image = var.container_image
  subnets        = var.subnets
  vpc_id         = var.vpc_id
}

module "cloudfront" {
  source                = "./modules/cloudfront"
  s3_bucket_domain_name = module.s3.bucket_arn
}
