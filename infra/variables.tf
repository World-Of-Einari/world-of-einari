variable "aws_region" {
  description = "AWS region to deploy into"
  type        = string
  default     = "eu-west-1"
}

variable "aws_account_id" {
  description = "AWS account ID"
  type        = string
}

variable "github_org" {
  description = "Your GitHub username or organisation"
  type        = string
}

variable "github_repo" {
  description = "Your repository name (without the org prefix)"
  type        = string
}

variable "s3_bucket_arn" {
  description = "ARN of the S3 bucket to deploy to"
  type        = string
}

variable "cloudfront_distribution_arn" {
  description = "ARN of the CloudFront distribution"
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
