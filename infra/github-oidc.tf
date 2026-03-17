terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }

  backend "s3" {
    bucket = "world-of-einari-terraform-state"
    key    = "terraform.tfstate"
    region = "eu-west-1"
  }
}

provider "aws" {
  region = var.aws_region
}

variable "aws_region" {
  description = "AWS region to deploy into"
  type        = string
  default     = "eu-west-1"
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

# ── OIDC Provider ────────────────────────────────────────────────────────────
# Only one of these can exist per AWS account — import it if it already exists:
# terraform import aws_iam_openid_connect_provider.github_actions <arn>

resource "aws_iam_openid_connect_provider" "github_actions" {
  url = "https://token.actions.githubusercontent.com"

  client_id_list = ["sts.amazonaws.com"]

  # GitHub's OIDC thumbprint (stable — no need to rotate)
  thumbprint_list = ["6938fd4d98bab03faadb97b34396831e3780aea1"]
}

# IAM Role

data "aws_iam_policy_document" "github_actions_assume_role" {
  statement {
    effect  = "Allow"
    actions = ["sts:AssumeRoleWithWebIdentity"]

    principals {
      type        = "Federated"
      identifiers = [aws_iam_openid_connect_provider.github_actions.arn]
    }

    condition {
      test     = "StringEquals"
      variable = "token.actions.githubusercontent.com:aud"
      values   = ["sts.amazonaws.com"]
    }

    # Only allow the main branch to assume this role
    condition {
      test     = "StringLike"
      variable = "token.actions.githubusercontent.com:sub"
      values   = ["repo:${var.github_org}/${var.github_repo}:ref:refs/heads/main"]
    }
  }
}

resource "aws_iam_role" "github_actions_deploy" {
  name               = "github-actions-deploy-${var.github_repo}"
  assume_role_policy = data.aws_iam_policy_document.github_actions_assume_role.json

  tags = {
    ManagedBy = "terraform"
    Purpose   = "github-actions-deploy"
  }
}

# IAM Policy

data "aws_iam_policy_document" "deploy_permissions" {
  # S3: sync (list + get + put + delete)
  statement {
    effect = "Allow"
    actions = [
      "s3:ListBucket",
      "s3:GetObject",
      "s3:PutObject",
      "s3:DeleteObject",
    ]
    resources = [
      var.s3_bucket_arn,
      "${var.s3_bucket_arn}/*",
    ]
  }

  # CloudFront: invalidation only
  statement {
    effect = "Allow"
    actions = [
      "cloudfront:CreateInvalidation",
    ]
    resources = [var.cloudfront_distribution_arn]
  }

  # Lambda: deploy chat function
  statement {
    effect = "Allow"
    actions = [
      "lambda:UpdateFunctionCode",
    ]
    resources = ["arn:aws:lambda:${var.aws_region}:${var.aws_account_id}:function:world-of-einari-chat"]
  }
}

resource "aws_iam_policy" "deploy_permissions" {
  name   = "github-actions-deploy-${var.github_repo}"
  policy = data.aws_iam_policy_document.deploy_permissions.json
}

resource "aws_iam_role_policy_attachment" "deploy_permissions" {
  role       = aws_iam_role.github_actions_deploy.name
  policy_arn = aws_iam_policy.deploy_permissions.arn
}

# Outputs

output "role_arn" {
  description = "Add this as the AWS_ROLE_ARN secret in your GitHub repo"
  value       = aws_iam_role.github_actions_deploy.arn
}
