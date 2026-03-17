variable "aws_account_id" {
  description = "AWS account ID"
  type        = string
}

variable "cloudfront_distribution_id" {
  description = "ID of the existing CloudFront distribution"
  type        = string
}

variable "origin_verify_secret" {
  description = "Secret header value CloudFront sends to the Lambda origin to prevent direct access"
  type        = string
  sensitive   = true
}

variable "openai_api_key" {
  description = "Initial placeholder value for the SSM parameter. Set the real key out-of-band via AWS CLI — Terraform will ignore subsequent value changes due to lifecycle ignore_changes."
  type        = string
  default     = "PLACEHOLDER"
  sensitive   = true
}