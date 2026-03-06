# Infrastructure

Terraform configuration for the GitHub Actions → AWS deployment pipeline.

## What's in here

| File | Purpose |
|---|---|
| `github-oidc.tf` | OIDC trust between GitHub Actions and AWS, IAM role + scoped deploy policy |

## Prerequisites

- [Terraform](https://developer.hashicorp.com/terraform/install) >= 1.0
- AWS CLI configured with credentials that have IAM permissions
- An existing S3 bucket and CloudFront distribution

## First-time setup

```bash
terraform init
terraform apply \
  -var="github_org=your-username" \
  -var="github_repo=world-of-einari" \
  -var="s3_bucket_arn=arn:aws:s3:::your-bucket-name" \
  -var="cloudfront_distribution_arn=arn:aws:cloudfront::123456789:distribution/XXXXX"
```

Once applied, add the following secrets to your GitHub repo (Settings → Secrets → Actions):

| Secret | Value |
|---|---|
| `AWS_ROLE_ARN` | Printed as `role_arn` in the Terraform output |
| `AWS_REGION` | e.g. `eu-west-1` |

## How the OIDC auth works

Rather than storing long-lived AWS access keys as secrets, GitHub Actions requests a short-lived token from AWS by assuming an IAM role via OIDC. The trust policy restricts assumption to the `main` branch of this repo only. The role itself is scoped to the minimum permissions needed: S3 sync and CloudFront invalidation.