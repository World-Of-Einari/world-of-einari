resource "aws_sns_topic" "contact_notifications" {
  name = "world-of-einari-contact-notifications"

  tags = {
    ManagedBy = "terraform"
    Project   = "world-of-einari"
  }
}

resource "aws_sns_topic_subscription" "contact_email" {
  topic_arn = aws_sns_topic.contact_notifications.arn
  protocol  = "email"
  endpoint  = var.contact_notification_email
}