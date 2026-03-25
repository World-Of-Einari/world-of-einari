/**
 * Maps an error to an HTTP status code and message.
 * Used by both lambda.ts and local-server.ts entry points.
 */
export function resolveHttpError(err: unknown): { statusCode: number; message: string } {
  const e = err as any;
  const errorMessage = typeof e?.message === 'string' ? e.message : '';
  const errorStatus = typeof e?.status === 'number' ? e.status : e?.statusCode;
  const errorCode = typeof e?.code === 'string' ? e.code : '';

  if (errorMessage === 'Forbidden') return { statusCode: 403, message: 'Forbidden' };
  if (errorMessage === 'Rate limited') return { statusCode: 429, message: 'Too many requests' };
  if (errorStatus === 400 || /message is required/i.test(errorMessage)) {
    return { statusCode: 400, message: errorMessage || 'Bad Request' };
  }
  if (errorStatus === 429 || errorCode === 'RATE_LIMITED' || /rate limit/i.test(errorMessage)) {
    return { statusCode: 429, message: errorMessage || 'Rate limited' };
  }
  if (typeof errorStatus === 'number' && errorStatus >= 400 && errorStatus <= 599) {
    return { statusCode: errorStatus, message: errorMessage || 'Error' };
  }

  return { statusCode: 500, message: 'Internal Server Error' };
}
