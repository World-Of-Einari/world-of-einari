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
  description = "OpenAI API key — stored in SSM, not in state. Set to a placeholder here and update manually via AWS CLI."
  type        = string
  default     = "PLACEHOLDER"
  sensitive   = true
}