# ── SSM Parameter ────────────────────────────────────────────────────────────
# The parameter is created with a placeholder value on first apply.
# Set the real key out-of-band via AWS CLI — Terraform will not overwrite it on subsequent applies:
#
#   aws ssm put-parameter \
#     --name "/world-of-einari/openai-api-key" \
#     --value "sk-..." \
#     --type SecureString \
#     --overwrite

resource "aws_ssm_parameter" "openai_api_key" {
  name        = "/world-of-einari/openai-api-key"
  type        = "SecureString"
  value       = var.openai_api_key
  description = "OpenAI API key for the portfolio chat Lambda"

  lifecycle {
    ignore_changes = [value]
  }

  tags = {
    ManagedBy = "terraform"
    Project   = "world-of-einari"
  }
}

# ── IAM Role for Lambda ───────────────────────────────────────────────────────

data "aws_iam_policy_document" "lambda_assume_role" {
  statement {
    effect  = "Allow"
    actions = ["sts:AssumeRole"]

    principals {
      type        = "Service"
      identifiers = ["lambda.amazonaws.com"]
    }
  }
}

resource "aws_iam_role" "chat_lambda" {
  name               = "world-of-einari-chat-lambda"
  assume_role_policy = data.aws_iam_policy_document.lambda_assume_role.json

  tags = {
    ManagedBy = "terraform"
    Project   = "world-of-einari"
  }
}

data "aws_iam_policy_document" "chat_lambda_permissions" {
  # CloudWatch Logs
  statement {
    effect = "Allow"
    actions = [
      "logs:CreateLogGroup",
      "logs:CreateLogStream",
      "logs:PutLogEvents",
    ]
    resources = ["arn:aws:logs:${var.aws_region}:${var.aws_account_id}:log-group:/aws/lambda/world-of-einari-chat:*"]
  }

  # SSM — read only the specific parameter
  statement {
    effect    = "Allow"
    actions   = ["ssm:GetParameter"]
    resources = ["arn:aws:ssm:${var.aws_region}:${var.aws_account_id}:parameter/world-of-einari/openai-api-key"]
  }

  # KMS — decrypt the SecureString parameter
  statement {
    effect    = "Allow"
    actions   = ["kms:Decrypt"]
    resources = ["arn:aws:kms:${var.aws_region}:${var.aws_account_id}:alias/aws/ssm"]
  }
}

resource "aws_iam_policy" "chat_lambda_permissions" {
  name   = "world-of-einari-chat-lambda"
  policy = data.aws_iam_policy_document.chat_lambda_permissions.json
}

resource "aws_iam_role_policy_attachment" "chat_lambda_permissions" {
  role       = aws_iam_role.chat_lambda.name
  policy_arn = aws_iam_policy.chat_lambda_permissions.arn
}

# ── Lambda Function ───────────────────────────────────────────────────────────

data "archive_file" "placeholder" {
  type        = "zip"
  output_path = "${path.module}/placeholder.zip"

  source {
    content  = "exports.handler = async () => ({ statusCode: 200 })"
    filename = "lambda.js"
  }
}

resource "aws_lambda_function" "chat" {
  function_name = "world-of-einari-chat"
  role          = aws_iam_role.chat_lambda.arn
  runtime       = "nodejs22.x"
  handler       = "lambda.handler"
  timeout       = 60
  memory_size   = 256

  filename         = data.archive_file.placeholder.output_path
  source_code_hash = data.archive_file.placeholder.output_base64sha256

  environment {
    variables = {
      SSM_PARAMETER_NAME   = aws_ssm_parameter.openai_api_key.name
      ALLOWED_ORIGIN       = "https://einarinau.com"
      ORIGIN_VERIFY_SECRET = var.origin_verify_secret
    }
  }

  lifecycle {
    ignore_changes = [filename, source_code_hash]
  }

  tags = {
    ManagedBy = "terraform"
    Project   = "world-of-einari"
  }
}

# ── Lambda Alias ──────────────────────────────────────────────────────────────
# Terraform creates the alias pointing at $LATEST on first apply.
# GitHub Actions manages the function_version pointer on every deploy —
# Terraform will not overwrite it on subsequent applies.

resource "aws_lambda_alias" "live" {
  name             = "live"
  function_name    = aws_lambda_function.chat.function_name
  function_version = "$LATEST"

  lifecycle {
    ignore_changes = [function_version]
  }
}

# ── Lambda Function URL ───────────────────────────────────────────────────────
# Scoped to $LATEST — the alias is used for deployment tracking only.

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

# ── Lambda Function URL public access policy ──────────────────────────────────

resource "aws_lambda_permission" "allow_public_invoke" {
  statement_id           = "FunctionURLAllowPublicAccess"
  action                 = "lambda:InvokeFunctionUrl"
  function_name          = aws_lambda_function.chat.function_name
  principal              = "*"
  function_url_auth_type = "NONE"
}

# ── Outputs ───────────────────────────────────────────────────────────────────

output "chat_lambda_function_url" {
  description = "Lambda Function URL — used as the CloudFront origin"
  value       = aws_lambda_function_url.chat.function_url
}

output "chat_lambda_arn" {
  description = "Lambda ARN — add as CHAT_LAMBDA_ARN secret in GitHub"
  value       = aws_lambda_function.chat.arn
}
