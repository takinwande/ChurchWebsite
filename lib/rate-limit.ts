/**
 * Fixed-window rate limiter for public form endpoints.
 *
 * State lives in the Node process, so each serverless instance keeps its own
 * counter — on Vercel the effective limit scales with the number of warm
 * instances. That is enough to stop naive bot floods against a church contact
 * form; a shared store (Redis) would be needed for a hard guarantee.
 */

const WINDOW_MS = 60_000
const MAX_REQUESTS = 5

// Once the map grows past this, expired entries are swept on the next call.
const SWEEP_THRESHOLD = 1000

const hits = new Map<string, { count: number; expiresAt: number }>()

function sweep(now: number) {
  const expired: string[] = []
  hits.forEach((entry, key) => {
    if (entry.expiresAt <= now) expired.push(key)
  })
  expired.forEach((key) => hits.delete(key))
}

export interface RateLimitResult {
  allowed: boolean
  retryAfterSeconds: number
}

export function rateLimit(
  key: string,
  max: number = MAX_REQUESTS,
  windowMs: number = WINDOW_MS
): RateLimitResult {
  const now = Date.now()

  if (hits.size > SWEEP_THRESHOLD) sweep(now)

  const entry = hits.get(key)

  if (!entry || entry.expiresAt <= now) {
    hits.set(key, { count: 1, expiresAt: now + windowMs })
    return { allowed: true, retryAfterSeconds: 0 }
  }

  entry.count += 1

  if (entry.count > max) {
    return {
      allowed: false,
      retryAfterSeconds: Math.max(1, Math.ceil((entry.expiresAt - now) / 1000)),
    }
  }

  return { allowed: true, retryAfterSeconds: 0 }
}

/** Resolves the caller's IP from proxy headers set by Vercel. */
export function getClientIp(req: Request): string {
  const forwarded = req.headers.get('x-forwarded-for')
  if (forwarded) {
    // x-forwarded-for is a comma-separated chain; the first entry is the client.
    const first = forwarded.split(',')[0]?.trim()
    if (first) return first
  }
  return req.headers.get('x-real-ip')?.trim() || 'unknown'
}

/** Test-only: clears accumulated counters between cases. */
export function __resetRateLimit() {
  hits.clear()
}
