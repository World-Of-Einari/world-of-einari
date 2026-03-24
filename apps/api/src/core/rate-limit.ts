const RATE_LIMIT_MAX = 10;
const RATE_LIMIT_WINDOW = 60_000;

interface RateLimitEntry {
  count: number;
  windowStart: number;
}

const store = new Map<string, RateLimitEntry>();

/**
 * Removes expired entries from the rate limit store.
 */
function prune(now: number): void {
  for (const [ip, entry] of store) {
    if (now - entry.windowStart > RATE_LIMIT_WINDOW) {
      store.delete(ip);
    }
  }
}

/**
 * Returns true if the given IP has exceeded the rate limit.
 * Increments the request count otherwise.
 */
export function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = store.get(ip);

  if (!entry || now - entry.windowStart > RATE_LIMIT_WINDOW) {
    prune(now);
    store.set(ip, { count: 1, windowStart: now });
    return false;
  }

  if (entry.count >= RATE_LIMIT_MAX) return true;

  entry.count++;
  return false;
}
