# Runbook: Chat Lambda 403

## Incident Summary

Chat on einarinau.com returning 403. Requests were not reaching Lambda at all — no CloudWatch logs generated.

## Root Cause

The Lambda Function URL was scoped to the `live` alias (`qualifier = "live"`). The alias's Function URL entered a broken AWS-internal state where it returned `AccessDeniedException` on every request, despite correct auth config, permissions, and CORS settings. Recreating the Function URL or permissions on the alias did not fix it. Moving the Function URL to `$LATEST` resolved it immediately.

## What Was Ruled Out

- `ORIGIN_VERIFY_SECRET` mismatch — env var was correct on both Lambda and CloudFront
- CloudFront WAF blocking — WAF showed no sampled requests, wasn't seeing traffic
- CloudFront cached 403 — cache invalidation had no effect
- Lambda Function URL CORS — even `AllowOrigins: ["*"]` didn't fix it
- Resource-based policy — `lambda:InvokeFunctionUrl` permission was correct throughout
- CloudFront origin request policy — Free plan doesn't support custom origin request policies or legacy `forwarded_values`

## Diagnostic Steps

### 1. Check env vars on the published version

```bash
aws lambda get-function-configuration \
  --function-name world-of-einari-chat \
  --qualifier live \
  --query 'Environment.Variables' \
  --output json
```

### 2. Check what version `live` alias points to

```bash
aws lambda get-alias \
  --function-name world-of-einari-chat \
  --name live \
  --region eu-west-1 \
  --query 'FunctionVersion' \
  --output text
```

### 3. Check Function URL config

```bash
aws lambda get-function-url-config \
  --function-name world-of-einari-chat \
  --region eu-west-1
```

### 4. Check resource-based policy

```bash
aws lambda get-policy \
  --function-name world-of-einari-chat \
  --region eu-west-1 \
  --query 'Policy' \
  --output text | python3 -m json.tool
```

### 5. Test Function URL directly

```bash
curl -X POST https://<function-url>/ \
  -H "Content-Type: application/json" \
  -H "Origin: https://einarinau.com" \
  -H "X-Origin-Verify: <secret>" \
  -d '{"message":"hello"}' \
  --no-buffer \
  -v
```

Response signals:

- `x-amzn-ErrorType: AccessDeniedException` → Function URL auth layer broken
- `Forbidden` from application code → check `ORIGIN_VERIFY_SECRET`
- No CloudWatch logs generated → request not reaching Lambda at all

### 6. Test Lambda invocation directly (bypasses Function URL)

```bash
aws lambda invoke \
  --function-name world-of-einari-chat \
  --region eu-west-1 \
  --payload '{"requestContext":{"http":{"method":"POST"}},"headers":{"x-origin-verify":"<secret>","content-type":"application/json"},"body":"{\"message\":\"hello\"}"}' \
  --cli-binary-format raw-in-base64-out \
  output.json && cat output.json
```

If this works but the Function URL doesn't → the Function URL layer is broken, not the application.

### 7. Check CloudWatch logs

```bash
aws logs tail /aws/lambda/world-of-einari-chat \
  --follow \
  --region eu-west-1
```

If no logs appear after a real request → the request is not reaching Lambda. The issue is at the Function URL or CloudFront layer.

### 8. Test $LATEST Function URL

```bash
aws lambda get-function-url-config \
  --function-name world-of-einari-chat \
  --region eu-west-1
```

If `$LATEST` URL works but alias URL doesn't → the alias is corrupted. See fix below.

## Fix Applied (2026-03-19)

### Problem

Lambda Function URL scoped to the `live` alias entered a broken AWS-internal state. Returned `AccessDeniedException` on every request with no logs generated.

### Resolution

**1. Updated `infra/lambda.tf` — removed alias qualifier from Function URL**

```hcl
resource "aws_lambda_function_url" "chat" {
  function_name      = aws_lambda_function.chat.function_name
  authorization_type = "NONE"
  invoke_mode        = "RESPONSE_STREAM"

  cors {
    allow_origins = ["https://einarinau.com"]
    allow_methods = ["*"]
    allow_headers = ["Content-Type", "X-Origin-Verify"]
    max_age       = 300
  }
}

resource "aws_lambda_permission" "allow_public_invoke" {
  statement_id           = "FunctionURLAllowPublicAccess"
  action                 = "lambda:InvokeFunctionUrl"
  function_name          = aws_lambda_function.chat.function_name
  principal              = "*"
  function_url_auth_type = "NONE"
}
```

**2. Deleted stale manually-created $LATEST Function URL**

```bash
aws lambda delete-function-url-config \
  --function-name world-of-einari-chat \
  --region eu-west-1
```

**3. Applied Terraform**

```bash
cd infra && terraform apply
```

CloudFront origin updated automatically via `aws_lambda_function_url.chat.function_url`.

**4. Simplified deploy workflow**

Removed `Publish version` and `Update live alias` steps from `.github/workflows/deploy-api.yml` — no longer relevant since the Function URL targets `$LATEST` directly.

**5. Deleted rollback workflow**

Removed `.github/workflows/rollback-api.yml` — the `live` alias is no longer used for traffic routing so alias-based rollback had no effect.

## Current Architecture

- Function URL → `$LATEST` (no alias qualifier)
- CloudFront origin → derived from `aws_lambda_function_url.chat.function_url` in Terraform
- GitHub Actions deploy → `update-function-code` only, updates `$LATEST` directly
- `live` alias still exists but is unused for traffic routing

## Rollback Procedure

The Function URL targets `$LATEST` directly — the `live` alias is no longer used for
traffic routing. To roll back to a previous version:

1. Revert the offending commit in git:

```bash
   git revert <commit-sha>
   git push origin main
```

2. The Deploy API workflow will trigger automatically and deploy the reverted code to `$LATEST`.
3. Or manually trigger the Deploy API workflow via `workflow_dispatch` if you need to redeploy without a new commit.

## If This Happens Again

The alias-based Function URL broken state cannot recur since the Function URL no longer uses an alias. If a 403 reappears, start at step 5 above and check CloudWatch logs first — if no logs are generated, the issue is at the Function URL or CloudFront layer, not the application.
