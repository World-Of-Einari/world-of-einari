resource "aws_dynamodb_table" "contact_requests" {
  name         = "world-of-einari-contact-requests"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "id"

  attribute {
    name = "id"
    type = "S"
  }

  tags = {
    ManagedBy = "terraform"
    Project   = "world-of-einari"
  }
}
