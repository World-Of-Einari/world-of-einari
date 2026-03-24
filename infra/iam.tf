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
  statement {
    effect = "Allow"
    actions = [
      "logs:CreateLogGroup",
      "logs:CreateLogStream",
      "logs:PutLogEvents",
    ]
    resources = ["arn:aws:logs:${var.aws_region}:${var.aws_account_id}:log-group:/aws/lambda/world-of-einari-chat:*"]
  }

  statement {
    effect    = "Allow"
    actions   = ["ssm:GetParameter"]
    resources = ["arn:aws:ssm:${var.aws_region}:${var.aws_account_id}:parameter/world-of-einari/openai-api-key"]
  }

  statement {
    effect    = "Allow"
    actions   = ["kms:Decrypt"]
    resources = ["arn:aws:kms:${var.aws_region}:${var.aws_account_id}:alias/aws/ssm"]
  }

  statement {
    effect    = "Allow"
    actions   = ["dynamodb:PutItem"]
    resources = [aws_dynamodb_table.contact_requests.arn]
  }

  statement {
    effect    = "Allow"
    actions   = ["sns:Publish"]
    resources = [aws_sns_topic.contact_notifications.arn]
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
