import { NextRequest, NextResponse } from "next/server";
import { createHash, randomUUID } from "node:crypto";

const script = `
local now = tonumber(redis.call('TIME')[1])
redis.call('ZREMRANGEBYSCORE', KEYS[1], '-inf', now - 60)
redis.call('ZADD', KEYS[1], now, ARGV[1])
redis.call('EXPIRE', KEYS[1], 120)
return {redis.call('ZCARD', KEYS[1]), redis.call('ZREVRANGE', KEYS[1], 0, 11)}
`;

function nickname(id: string) {
  const hash = createHash("sha256").update(id).digest();
  const adjectives = ["Curious", "Bright", "Calm", "Clever", "Sunny", "Kind", "Quiet", "Brave"];
  const animals = ["Otter", "Panda", "Owl", "Fox", "Koala", "Robin", "Dolphin", "Deer"];
  return `${adjectives[hash[0] % 8]} ${animals[hash[1] % 8]} ${hash.readUInt16BE(2).toString(16).padStart(4, "0")}`;
}

// In-memory sliding window fallback (used when Upstash is unconfigured, unreachable, or in local dev)
const localPresenceCache = new Map<string, number>();

function getLocalPresence(id: string) {
  const now = Math.floor(Date.now() / 1000);
  localPresenceCache.set(id, now);

  // Clean stale visitors older than 60 seconds
  for (const [visitorId, ts] of localPresenceCache.entries()) {
    if (now - ts > 60) {
      localPresenceCache.delete(visitorId);
    }
  }

  const visitorsList = Array.from(localPresenceCache.keys()).slice(0, 12);
  return {
    count: Math.max(1, localPresenceCache.size),
    visitors: visitorsList.map((visitor) => ({
      name: nickname(visitor),
      you: visitor === id,
    })),
  };
}

export async function POST(request: NextRequest) {
  const headers = { "Cache-Control": "no-store" };

  // Origin check: only reject if an explicit origin is provided and does not match the request host
  const origin = request.headers.get("origin");
  if (origin) {
    try {
      const originHost = new URL(origin).host;
      const requestHost =
        request.headers.get("x-forwarded-host") || request.headers.get("host") || request.nextUrl.host;
      if (originHost !== requestHost && origin !== request.nextUrl.origin) {
        return NextResponse.json({ error: "Invalid origin" }, { status: 403, headers });
      }
    } catch {
      return NextResponse.json({ error: "Invalid origin" }, { status: 403, headers });
    }
  }

  const cookie = request.cookies.get("portfolio-visitor")?.value;
  const id =
    cookie && /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(cookie)
      ? cookie
      : randomUUID();

  const url = process.env.UPSTASH_REDIS_REST_URL?.trim();
  const token = process.env.UPSTASH_REDIS_REST_TOKEN?.trim();

  // If Upstash Redis is configured, try to sync across serverless instances
  if (url && token) {
    try {
      const hostKey =
        request.headers.get("x-forwarded-host") || request.headers.get("host") || request.nextUrl.host;
      const response = await fetch(url, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify(["EVAL", script, "1", `portfolio:presence:${hostKey}`, id]),
        cache: "no-store",
        signal: AbortSignal.timeout(4000),
      });

      const data = await response.json();
      if (
        response.ok &&
        !data.error &&
        Array.isArray(data.result) &&
        Number.isInteger(data.result[0]) &&
        Array.isArray(data.result[1]) &&
        data.result[1].every((value: unknown) => typeof value === "string")
      ) {
        const result = NextResponse.json(
          {
            count: Math.max(1, data.result[0]),
            visitors: data.result[1].map((visitor: string) => ({
              name: nickname(visitor),
              you: visitor === id,
            })),
          },
          { headers },
        );
        result.cookies.set("portfolio-visitor", id, {
          httpOnly: true,
          secure: request.nextUrl.protocol === "https:",
          sameSite: "lax",
          path: "/",
          maxAge: 86400,
        });
        return result;
      }
    } catch (error) {
      console.warn("Upstash presence sync failed, falling back to local presence:", error);
    }
  }

  // Graceful fallback: return local in-memory presence so the UI never displays "Unavailable"
  const fallback = getLocalPresence(id);
  const result = NextResponse.json(fallback, { headers });
  result.cookies.set("portfolio-visitor", id, {
    httpOnly: true,
    secure: request.nextUrl.protocol === "https:",
    sameSite: "lax",
    path: "/",
    maxAge: 86400,
  });
  return result;
}
