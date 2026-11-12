import { NextRequest, NextResponse } from "next/server";

export const ALLOWED_ORIGINS = new Set([
  "https://kertamarga-bali.vercel.app",
  "http://localhost:3000",
  "http://127.0.0.1:3000",
]);

function isAllowedOriginHeader(origin: string, req: NextRequest): boolean {
  if (ALLOWED_ORIGINS.has(origin)) return true;

  try {
    const parsedOrigin = new URL(origin);
    const hostHeader =
      req.headers.get("x-forwarded-host") || req.headers.get("host") || "";
    if (hostHeader && parsedOrigin.host === hostHeader) {
      return true;
    }
    if (
      parsedOrigin.hostname === "localhost" ||
      parsedOrigin.hostname === "127.0.0.1"
    ) {
      return true;
    }
  } catch {
    return false;
  }

  return false;
}

export function getClientIp(req: NextRequest): string {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) {
    const first = xff.split(",")[0]?.trim();
    if (first) return first.slice(0, 64);
  }
  const realIp = req.headers.get("x-real-ip")?.trim();
  if (realIp) return realIp.slice(0, 64);
  return "127.0.0.1";
}

export function resolveCorsOrigin(req: NextRequest): string {
  const origin = req.headers.get("origin");
  if (origin && isAllowedOriginHeader(origin, req)) {
    return origin;
  }
  return "https://kertamarga-bali.vercel.app";
}

export function applyStandardApiHeaders<T = unknown>(
  res: NextResponse<T>,
  req: NextRequest
): NextResponse<T> {
  const allowedOrigin = resolveCorsOrigin(req);
  res.headers.set("Access-Control-Allow-Origin", allowedOrigin);
  res.headers.set("Vary", "Origin");
  res.headers.set("X-Content-Type-Options", "nosniff");
  res.headers.set("X-Frame-Options", "DENY");
  res.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  res.headers.set("Cache-Control", "no-store, max-age=0");
  return res;
}

export function handleCorsPreflight(
  req: NextRequest,
  allowedMethods = "POST, OPTIONS"
): NextResponse {
  const origin = req.headers.get("origin");
  if (origin && !isAllowedOriginHeader(origin, req)) {
    return new NextResponse(null, {
      status: 403,
      headers: {
        Vary: "Origin",
        "X-Content-Type-Options": "nosniff",
      },
    });
  }

  const resolvedOrigin = origin || "https://kertamarga-bali.vercel.app";
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": resolvedOrigin,
      "Access-Control-Allow-Methods": allowedMethods,
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Access-Control-Max-Age": "86400",
      Vary: "Origin",
      "X-Content-Type-Options": "nosniff",
    },
  });
}

export function verifyRequestOrigin(req: NextRequest): NextResponse | null {
  const origin = req.headers.get("origin");
  if (origin && !isAllowedOriginHeader(origin, req)) {
    return applyStandardApiHeaders(
      NextResponse.json(
        { error: "Origin permintaan tidak diizinkan." },
        { status: 403 }
      ),
      req
    );
  }

  const secFetchSite = req.headers.get("sec-fetch-site");
  if (secFetchSite && secFetchSite.toLowerCase() === "cross-site") {
    return applyStandardApiHeaders(
      NextResponse.json(
        { error: "Permintaan lintas situs (cross-site) ditolak." },
        { status: 403 }
      ),
      req
    );
  }

  return null;
}

interface RateBucket {
  count: number;
  resetAt: number;
}

interface GlobalSecurityStore {
  __km_rate_buckets?: Map<string, RateBucket>;
  __km_inflight_ai?: Map<string, number>;
}

const g = globalThis as unknown as GlobalSecurityStore;

function getRateBuckets(): Map<string, RateBucket> {
  if (!g.__km_rate_buckets) {
    g.__km_rate_buckets = new Map<string, RateBucket>();
  }
  return g.__km_rate_buckets;
}

function getInflightMap(): Map<string, number> {
  if (!g.__km_inflight_ai) {
    g.__km_inflight_ai = new Map<string, number>();
  }
  return g.__km_inflight_ai;
}

export interface RateLimitCheckResult {
  allowed: boolean;
  limited: boolean;
  limit: number;
  remaining: number;
  retryAfterSeconds: number;
}

export function checkSlidingRateLimit(
  bucketKey: string,
  maxRequests: number,
  windowMs = 60_000
): RateLimitCheckResult {
  const now = Date.now();
  const buckets = getRateBuckets();

  if (buckets.size > 5000) {
    for (const [k, v] of buckets.entries()) {
      if (now > v.resetAt) buckets.delete(k);
    }
  }

  const current = buckets.get(bucketKey);
  if (!current || now > current.resetAt) {
    buckets.set(bucketKey, { count: 1, resetAt: now + windowMs });
    return {
      allowed: true,
      limited: false,
      limit: maxRequests,
      remaining: Math.max(0, maxRequests - 1),
      retryAfterSeconds: Math.ceil(windowMs / 1000),
    };
  }

  current.count += 1;
  const retryAfterSeconds = Math.max(
    1,
    Math.ceil((current.resetAt - now) / 1000)
  );
  if (current.count > maxRequests) {
    return {
      allowed: false,
      limited: true,
      limit: maxRequests,
      remaining: 0,
      retryAfterSeconds,
    };
  }

  return {
    allowed: true,
    limited: false,
    limit: maxRequests,
    remaining: Math.max(0, maxRequests - current.count),
    retryAfterSeconds,
  };
}

export function buildRateLimitResponse(
  req: NextRequest,
  limit: number,
  retryAfterSeconds: number,
  message = "Terlalu banyak permintaan dalam waktu singkat. Silakan tunggu sebentar sebelum mencoba lagi."
): NextResponse {
  const res = NextResponse.json({ error: message }, { status: 429 });
  res.headers.set("Retry-After", String(retryAfterSeconds));
  res.headers.set("X-RateLimit-Limit", String(limit));
  res.headers.set("X-RateLimit-Remaining", "0");
  return applyStandardApiHeaders(res, req);
}

export function acquireAiConcurrencySlot(
  ip: string,
  maxConcurrent = 3
): { acquired: boolean; release: () => void } {
  const map = getInflightMap();
  const current = map.get(ip) || 0;
  if (current >= maxConcurrent) {
    return {
      acquired: false,
      release: () => {},
    };
  }
  map.set(ip, current + 1);

  let released = false;
  return {
    acquired: true,
    release: () => {
      if (released) return;
      released = true;
      const prev = map.get(ip) || 1;
      if (prev <= 1) {
        map.delete(ip);
      } else {
        map.set(ip, prev - 1);
      }
    },
  };
}

export async function readBoundedJsonBody<T = unknown>(
  req: NextRequest,
  maxBytes = 16_384
): Promise<{ ok: true; data: T } | { ok: false; status: number; error: string }> {
  const contentLength = Number(req.headers.get("content-length") || "0");
  if (Number.isFinite(contentLength) && contentLength > maxBytes) {
    return {
      ok: false,
      status: 413,
      error: "Ukuran payload melebihi batas maksimum yang diizinkan.",
    };
  }

  try {
    const rawText = await req.text();
    if (!rawText.trim()) {
      return {
        ok: false,
        status: 400,
        error: "Body JSON tidak boleh kosong.",
      };
    }
    if (Buffer.byteLength(rawText, "utf8") > maxBytes) {
      return {
        ok: false,
        status: 413,
        error: "Ukuran payload melebihi batas maksimum yang diizinkan.",
      };
    }
    const parsed = JSON.parse(rawText) as T;
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      return {
        ok: false,
        status: 400,
        error: "Body harus berupa objek JSON yang valid.",
      };
    }
    return { ok: true, data: parsed };
  } catch {
    return {
      ok: false,
      status: 400,
      error: "Format JSON tidak valid.",
    };
  }
}
