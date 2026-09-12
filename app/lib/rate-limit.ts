import { createHash } from "node:crypto";

type RateLimitOptions = {
  namespace: string;
  limit: number;
  windowSeconds: number;
};

export type RateLimitResult = {
  allowed: boolean;
  limit: number;
  remaining: number;
  retryAfter: number;
};

const incrementScript = `
local count = redis.call('INCR', KEYS[1])
if count == 1 then redis.call('EXPIRE', KEYS[1], ARGV[1]) end
local ttl = redis.call('TTL', KEYS[1])
return {count, ttl}
`;

const localWindows = new Map<string, { count: number; resetAt: number }>();

function clientIdentifier(request: Request) {
  const vercelForwarded = request.headers.get("x-vercel-forwarded-for")?.split(",")[0]?.trim();
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const value = vercelForwarded || forwarded || request.headers.get("x-real-ip")?.trim() || "unknown";
  return createHash("sha256").update(value).digest("hex").slice(0, 24);
}

function localRateLimit(key: string, options: RateLimitOptions): RateLimitResult {
  const now = Date.now();
  for (const [storedKey, entry] of localWindows) {
    if (entry.resetAt <= now) localWindows.delete(storedKey);
  }

  const entry = localWindows.get(key);
  const current = !entry || entry.resetAt <= now
    ? { count: 1, resetAt: now + options.windowSeconds * 1000 }
    : { ...entry, count: entry.count + 1 };
  localWindows.set(key, current);
  const retryAfter = Math.max(1, Math.ceil((current.resetAt - now) / 1000));
  return {
    allowed: current.count <= options.limit,
    limit: options.limit,
    remaining: Math.max(0, options.limit - current.count),
    retryAfter,
  };
}

export async function rateLimit(request: Request, options: RateLimitOptions): Promise<RateLimitResult> {
  const host = request.headers.get("x-forwarded-host") || request.headers.get("host") || "portfolio";
  const key = `portfolio:rate:${options.namespace}:${host}:${clientIdentifier(request)}`;
  const url = process.env.UPSTASH_REDIS_REST_URL?.trim();
  const token = process.env.UPSTASH_REDIS_REST_TOKEN?.trim();

  if (url && token) {
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify(["EVAL", incrementScript, "1", key, String(options.windowSeconds)]),
        cache: "no-store",
        signal: AbortSignal.timeout(2500),
      });
      const data = await response.json() as { result?: unknown; error?: unknown };
      if (response.ok && !data.error && Array.isArray(data.result)) {
        const count = Number(data.result[0]);
        const ttl = Number(data.result[1]);
        if (Number.isFinite(count) && Number.isFinite(ttl)) {
          return {
            allowed: count <= options.limit,
            limit: options.limit,
            remaining: Math.max(0, options.limit - count),
            retryAfter: Math.max(1, ttl),
          };
        }
      }
      console.warn("Upstash rate limit returned an invalid response", { namespace: options.namespace });
    } catch (error) {
      console.warn("Upstash rate limit failed; using local fallback", {
        namespace: options.namespace,
        type: error instanceof Error ? error.name : typeof error,
      });
    }
  }

  return localRateLimit(key, options);
}

export function rateLimitHeaders(result: RateLimitResult) {
  return {
    "Cache-Control": "no-store",
    "Retry-After": String(result.retryAfter),
    "X-RateLimit-Limit": String(result.limit),
    "X-RateLimit-Remaining": String(result.remaining),
  };
}
