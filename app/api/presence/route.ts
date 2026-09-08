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

export async function POST(request: NextRequest) {
  const headers = { "Cache-Control": "no-store" };
  if (request.headers.get("origin") !== request.nextUrl.origin) {
    return NextResponse.json({ error: "Invalid origin" }, { status: 403, headers });
  }
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return NextResponse.json({ error: "Presence unavailable" }, { status: 503, headers });

  const cookie = request.cookies.get("portfolio-visitor")?.value;
  const id = cookie && /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(cookie) ? cookie : randomUUID();
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify(["EVAL", script, "1", `portfolio:presence:${request.nextUrl.host}`, id]),
      cache: "no-store",
      signal: AbortSignal.timeout(8000),
    });
    const data = await response.json();
    if (!response.ok || data.error || !Array.isArray(data.result) || !Number.isInteger(data.result[0]) || !Array.isArray(data.result[1]) || !data.result[1].every((value: unknown) => typeof value === "string")) throw new Error("Invalid presence response");
    const result = NextResponse.json({ count: data.result[0], visitors: data.result[1].map((visitor: string) => ({ name: nickname(visitor), you: visitor === id })) }, { headers });
    result.cookies.set("portfolio-visitor", id, { httpOnly: true, secure: request.nextUrl.protocol === "https:", sameSite: "lax", path: "/", maxAge: 86400 });
    return result;
  } catch {
    return NextResponse.json({ error: "Presence unavailable" }, { status: 503, headers });
  }
}
