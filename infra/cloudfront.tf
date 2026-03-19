# ── CloudFront Function ───────────────────────────────────────────────────────
# Rewrites viewer requests to route to the current live release prefix in S3.
# GitHub Actions updates the LIVE_SHA variable on every deploy.

resource "aws_cloudfront_function" "rewrite" {
  name    = "world-of-einari-rewrite"
  runtime = "cloudfront-js-2.0"
  comment = "Rewrites requests to the current live release prefix"
  publish = true

  code = <<-EOT
    var LIVE_SHA = "PLACEHOLDER";

    function handler(event) {
      var request = event.request;
      var uri = request.uri;

      // Don't rewrite API requests
      if (uri.startsWith("/api/")) {
        return request;
      }

      // Append index.html for directory requests
      if (uri.endsWith("/")) {
        uri = uri + "index.html";
      } else if (!uri.includes(".")) {
        uri = uri + "/index.html";
      }

      request.uri = "/releases/" + LIVE_SHA + uri;
      return request;
    }
  EOT
}

# ── Origin Access Control ─────────────────────────────────────────────────────
# Import the existing OAC:
#   terraform import aws_cloudfront_origin_access_control.s3 E2CVQS8A3K7PWE

resource "aws_cloudfront_origin_access_control" "s3" {
  name                              = "einarinau.com"
  origin_access_control_origin_type = "s3"
  signing_behavior                  = "always"
  signing_protocol                  = "sigv4"
}

# ── CloudFront Distribution ───────────────────────────────────────────────────
# Import the existing distribution:
#   terraform import aws_cloudfront_distribution.main E18D4E5IWC1XTH

resource "aws_cloudfront_distribution" "main" {
  enabled             = true
  is_ipv6_enabled     = true
  default_root_object = "index.html"
  price_class         = "PriceClass_All"
  http_version        = "http2"
  comment             = ""
  web_acl_id          = "arn:aws:wafv2:us-east-1:${var.aws_account_id}:global/webacl/CreatedByCloudFront-326fba92/ff3bee05-e749-4660-b9ef-dc0ef6efe438"

  aliases = ["einarinau.com"]

  # ── S3 origin ───────────────────────────────────────────────────────────────

  origin {
    origin_id                = "einarinau.com.s3.eu-west-2.amazonaws.com-mmdlzith7w8"
    domain_name              = "einarinau.com.s3.eu-west-2.amazonaws.com"
    origin_access_control_id = aws_cloudfront_origin_access_control.s3.id
  }

  # ── Lambda origin ────────────────────────────────────────────────────────────

  origin {
    origin_id   = "chat-lambda"
    domain_name = replace(replace(aws_lambda_function_url.chat.function_url, "https://", ""), "/", "")

    custom_origin_config {
      http_port                = 80
      https_port               = 443
      origin_protocol_policy   = "https-only"
      origin_ssl_protocols     = ["TLSv1.2"]
      origin_read_timeout      = 30
      origin_keepalive_timeout = 5
    }

    custom_header {
      name  = "X-Origin-Verify"
      value = var.origin_verify_secret
    }
  }

  # ── Default cache behaviour (S3) ─────────────────────────────────────────────

  default_cache_behavior {
    target_origin_id       = "einarinau.com.s3.eu-west-2.amazonaws.com-mmdlzith7w8"
    viewer_protocol_policy = "redirect-to-https"
    allowed_methods        = ["GET", "HEAD"]
    cached_methods         = ["GET", "HEAD"]
    compress               = true
    cache_policy_id        = "658327ea-f89d-4fab-a63d-7e88639e58f6" # CachingOptimized

    function_association {
      event_type   = "viewer-request"
      function_arn = aws_cloudfront_function.rewrite.arn
    }
  }

  # ── /api/chat behaviour (Lambda) ─────────────────────────────────────────────

  ordered_cache_behavior {
    path_pattern             = "/api/chat"
    target_origin_id         = "chat-lambda"
    viewer_protocol_policy   = "redirect-to-https"
    allowed_methods          = ["DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT"]
    cached_methods           = ["GET", "HEAD"]
    compress                 = true
    cache_policy_id          = "4135ea2d-6df8-44a3-9df3-4b5a84be39ad" # CachingDisabled
    origin_request_policy_id = "b689b0a8-53d0-40ab-baf2-68738e2966ac" # AllViewerExceptHostHeader
  }

  # ── Certificate ───────────────────────────────────────────────────────────────

  viewer_certificate {
    acm_certificate_arn      = "arn:aws:acm:us-east-1:${var.aws_account_id}:certificate/e0ea2ccd-e37a-4ad6-939b-fb6dcc0b3caa"
    ssl_support_method       = "sni-only"
    minimum_protocol_version = "TLSv1.2_2021"
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  tags = {
    ManagedBy = "terraform"
    Project   = "world-of-einari"
  }
}

# ── Outputs ───────────────────────────────────────────────────────────────────

output "cloudfront_function_arn" {
  description = "CloudFront Function ARN — used by GitHub Actions to update on deploy"
  value       = aws_cloudfront_function.rewrite.arn
}
