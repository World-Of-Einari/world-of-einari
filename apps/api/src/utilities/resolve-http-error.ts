/**
 * Typed application error with an associated HTTP status code.
 * Use this instead of plain Error to avoid string matching in error handlers.
 */
export class AppError extends Error {
  constructor(
    public readonly statusCode: number,
    message: string,
  ) {
    super(message);
    this.name = 'AppError';
  }
}

/**
 * Maps an error to an HTTP status code and message.
 * Handles AppError instances directly, falls back to heuristics for unknown errors.
 */
export function resolveHttpError(err: unknown): { statusCode: number; message: string } {
  if (err instanceof AppError) {
    return { statusCode: err.statusCode, message: err.message };
  }

  const e = err as any;
  const errorStatus = typeof e?.status === 'number' ? e.status : e?.statusCode;

  if (typeof errorStatus === 'number' && errorStatus >= 400 && errorStatus <= 599) {
    return { statusCode: errorStatus, message: e.message || 'Error' };
  }

  return { statusCode: 500, message: 'Internal Server Error' };
}
