
resource "aws_s3_bucket" "image_bucket" {
  bucket = var.bucket_name
  acl    = "private"

  versioning {
    enabled = true
  }

  lifecycle_rule {
    id      = "image-retention"
    enabled = true

    expiration {
      days = 365
    }
  }
}

resource "aws_s3_bucket_policy" "bucket_policy" {
  bucket = aws_s3_bucket.image_bucket.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action    = "s3:GetObject"
        Effect    = "Allow"
        Resource  = "${aws_s3_bucket.image_bucket.arn}/*"
        Principal = "*"
      }
    ]
  })
}
