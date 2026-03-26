/**
 * Verifies the origin secret header to prevent direct Lambda invocation
 * from outside the CloudFront distribution.
 * Returns true in local dev when no secret is configured.
 */
export function verifyOriginSecret(headers: Record<string, string | undefined>): boolean {
  const expectedSecret = process.env['ORIGIN_VERIFY_SECRET'];
  if (!expectedSecret) return true;
  const incoming = headers['x-origin-verify'] ?? headers['X-Origin-Verify'];
  return incoming === expectedSecret;
}
