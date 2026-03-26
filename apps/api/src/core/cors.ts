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
