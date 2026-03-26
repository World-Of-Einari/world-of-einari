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
