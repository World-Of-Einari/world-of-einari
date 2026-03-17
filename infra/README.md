# Infrastructure

Terraform configuration for the GitHub Actions → AWS deployment pipeline.

## What's in here

| File             | Purpose                                                                    |
| ---------------- | -------------------------------------------------------------------------- |
| `github-oidc.tf` | OIDC trust between GitHub Actions and AWS, IAM role + scoped deploy policy |
| `lambda.tf`      | Lambda function, IAM role, SSM parameter, Function URL                     |
| `variables.tf`   | Variable declarations for all `.tf` files                                  |

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

| Secret                       | Value                                                               |
| ---------------------------- | ------------------------------------------------------------------- |
| `AWS_ROLE_ARN`               | Printed as `role_arn` in the Terraform output                       |
| `AWS_REGION`                 | e.g. `eu-west-1`                                                    |
| `S3_BUCKET`                  | The S3 bucket name (e.g. `your-bucket-name`), **not** the ARN       |
| `CLOUDFRONT_DISTRIBUTION_ID` | The CloudFront distribution ID (e.g. `E123ABC...`), **not** the ARN |
| `CHAT_LAMBDA_ARN`            | Printed as `chat_lambda_arn` in the Terraform output                |

> Note: Terraform inputs use ARNs (`s3_bucket_arn`, `cloudfront_distribution_arn`), while the GitHub Actions workflow secrets above use the bucket name and distribution ID. Make sure not to mix these up.

## How the OIDC auth works

Rather than storing long-lived AWS access keys as secrets, GitHub Actions requests a short-lived token from AWS by assuming an IAM role via OIDC. The trust policy restricts assumption to the `main` branch of this repo only. The role itself is scoped to the minimum permissions needed: S3 sync, CloudFront invalidation, and Lambda code updates.

## Setting the OpenAI API key

The key is stored in SSM and never managed by Terraform. Set or rotate it with:

```bash
aws ssm put-parameter \
  --name "/world-of-einari/openai-api-key" \
  --value "sk-..." \
  --type SecureString \
  --overwrite
```

## Rotating the origin verify secret

The `origin_verify_secret` is a shared secret between CloudFront and Lambda that prevents direct invocation of the Lambda Function URL.

**1. Generate a new secret**

```bash
uuidgen
```

**2. Update `terraform.tfvars`**

```
origin_verify_secret = "<new-uuid>"
```

**3. Apply**

```bash
terraform apply
```

This updates the Lambda environment variable automatically.

**4. Update CloudFront**

Go to **CloudFront → Distributions → E18D4E5IWC1XTH → Origins → chat-lambda → Edit** and update the `X-Origin-Verify` custom header value to match.
