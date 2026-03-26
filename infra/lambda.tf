data "archive_file" "placeholder" {
  type        = "zip"
  output_path = "${path.module}/placeholder.zip"

  source {
    content  = "exports.handler = async () => ({ statusCode: 200 })"
    filename = "lambda.js"
  }
}

resource "aws_lambda_function" "chat" {
  function_name                  = "world-of-einari-chat"
  role                           = aws_iam_role.chat_lambda.arn
  runtime                        = "nodejs22.x"
  handler                        = "lambda.handler"
  timeout                        = 60
  memory_size                    = 256
  reserved_concurrent_executions = 5

  filename         = data.archive_file.placeholder.output_path
  source_code_hash = data.archive_file.placeholder.output_base64sha256

  environment {
    variables = {
      NODE_ENV              = "production"
      SSM_PARAMETER_NAME    = aws_ssm_parameter.openai_api_key.name
      ALLOWED_ORIGIN        = "https://einarinau.com"
      ORIGIN_VERIFY_SECRET  = var.origin_verify_secret
      CONTACT_TABLE_NAME    = aws_dynamodb_table.contact_requests.name
      CONTACT_SNS_TOPIC_ARN = aws_sns_topic.contact_notifications.arn
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

resource "aws_lambda_alias" "live" {
  name             = "live"
  function_name    = aws_lambda_function.chat.function_name
  function_version = "$LATEST"

  lifecycle {
    ignore_changes = [function_version]
  }
}

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

output "chat_lambda_function_url" {
  description = "Lambda Function URL — used as the CloudFront origin"
  value       = aws_lambda_function_url.chat.function_url
}

output "chat_lambda_arn" {
  description = "Lambda ARN — add as CHAT_LAMBDA_ARN secret in GitHub"
  value       = aws_lambda_function.chat.arn
}
