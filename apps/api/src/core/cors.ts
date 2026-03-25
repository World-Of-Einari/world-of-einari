const ALLOWED_ORIGIN = process.env['ALLOWED_ORIGIN'] ?? 'http://localhost:4200';

/**
 * CORS headers applied to all responses.
 * X-Tool-Action is exposed so the Angular client can read it.
 */
export const corsHeaders = {
  'Access-Control-Allow-Origin': ALLOWED_ORIGIN,
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, X-Origin-Verify',
  'Access-Control-Expose-Headers': 'X-Tool-Action',
};

/**
 * Verifies the origin secret header to prevent direct Lambda invocation
 * from outside the CloudFront distribution.
 */
export function verifyOriginSecret(headers: Record<string, string | undefined>): boolean {
  const expectedSecret = process.env['ORIGIN_VERIFY_SECRET'];
  if (!expectedSecret) return true;
  const incoming = headers['x-origin-verify'] ?? headers['X-Origin-Verify'];
  return incoming === expectedSecret;
}
