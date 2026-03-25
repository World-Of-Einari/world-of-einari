/**
 * Structured logger for CloudWatch Logs.
 * Outputs JSON so logs are queryable via CloudWatch Insights.
 * In local dev the same output goes to stdout/stderr.
 */
export const logger = {
  info: (event: string, data?: Record<string, unknown>) =>
    console.log(JSON.stringify({ level: 'info', event, ...data, ts: Date.now() })),

  warn: (event: string, data?: Record<string, unknown>) =>
    console.warn(JSON.stringify({ level: 'warn', event, ...data, ts: Date.now() })),

  error: (event: string, err: unknown, data?: Record<string, unknown>) =>
    console.error(
      JSON.stringify({
        level: 'error',
        event,
        error: err instanceof Error ? err.message : String(err),
        ...data,
        ts: Date.now(),
      }),
    ),
};
