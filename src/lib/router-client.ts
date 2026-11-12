/**
 * 9Router Resilient Client with Multi-Provider Failover & Anti-Ban Protections
 *
 * Features:
 * 1. Multi-Tier Cascading Failover (Antigravity -> Backup Pool -> OpenRouter)
 * 2. Strict Request Time Budgeting (prevents serverless 504 timeouts on stalling models)
 * 3. Proactive Cooldown / Circuit Breaker (auto-cools failing/429 models)
 * 4. Humanized Retry Jitter & In-Memory LRU Response Caching with Validation
 * 5. Resilient JSON Extraction & Anti-Slop Text Sanitizer
 */

import crypto from "crypto";

export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface RouterChatOptions {
  model?: string;
  backupModels?: string[];
  messages: ChatMessage[];
  responseFormatJson?: boolean;
  timeoutMs?: number;
  totalBudgetMs?: number;
  bypassCache?: boolean;
  validateResponse?: (text: string) => boolean;
}

export interface RouterChatResult {
  content: string;
  modelUsed: string;
  sourceMode: string;
  promptTokens?: number;
  completionTokens?: number;
  fromCache?: boolean;
}

export const VALID_FIELD_IDS = new Set([
  "tkj",
  "informatika",
  "dkv",
  "arsitektur",
  "kesehatan",
  "pendidikan",
  "budaya",
  "pertanian",
  "lingkungan",
  "bisnis",
  "pariwisata",
]);

const FIELD_ALIAS_MAP: Record<string, string> = {
  kelautan: "lingkungan",
  maritim: "lingkungan",
  konservasi: "lingkungan",
  ti: "informatika",
  rpl: "informatika",
  pplg: "informatika",
  it: "informatika",
  tjkt: "tkj",
  jaringan: "tkj",
  perhotelan: "pariwisata",
  hospitality: "pariwisata",
  desain: "dkv",
  multimedia: "dkv",
  agro: "pertanian",
  subak: "pertanian",
  kedokteran: "kesehatan",
  keperawatan: "kesehatan",
  guru: "pendidikan",
  konseling: "pendidikan",
  seni: "budaya",
  karawitan: "budaya",
  umkm: "bisnis",
  manajemen: "bisnis",
};

export function normalizeFieldId(raw: unknown): string | null {
  if (typeof raw !== "string") return null;
  const cleaned = raw.trim().toLowerCase();
  if (!cleaned || cleaned === "null" || cleaned === "none" || cleaned === "umum") {
    return null;
  }
  if (VALID_FIELD_IDS.has(cleaned)) return cleaned;
  return FIELD_ALIAS_MAP[cleaned] ?? null;
}

/**
 * Strips emoji pictographs and converts em/en-dashes to standard ASCII hyphens.
 */
export function sanitizeNoEmojiNoEmDash(text: string): string {
  return text
    .replace(/\u2014/g, " - ")
    .replace(/\u2013/g, "-")
    .replace(/[\p{Extended_Pictographic}\uFE0F\u200D]/gu, "")
    .replace(/[ \t]{2,}/g, " ")
    .replace(/ +\n/g, "\n")
    .trim();
}

/**
 * Extracts a JSON object reliably from LLM text that may include markdown code fences,
 * trailing explanations after closing backticks, or single-element arrays like `[{...}]`.
 */
export function extractJsonPayload(raw: string): Record<string, unknown> | null {
  if (!raw || typeof raw !== "string") return null;

  const cleaned = raw
    .trim()
    .replace(/```(?:json)?/gi, "")
    .replace(/```/g, "")
    .trim();

  const tryParse = (candidate: string): Record<string, unknown> | null => {
    try {
      const val = JSON.parse(candidate);
      if (Array.isArray(val) && val.length > 0 && val[0] && typeof val[0] === "object") {
        return val[0] as Record<string, unknown>;
      }
      if (val && typeof val === "object" && !Array.isArray(val)) {
        return val as Record<string, unknown>;
      }
    } catch {
      // Ignore and try balanced extraction below
    }
    return null;
  };

  const direct = tryParse(cleaned);
  if (direct) return direct;

  // Scan balanced `{...}` object while respecting string literals and escapes
  const firstBrace = cleaned.indexOf("{");
  if (firstBrace === -1) return null;

  let depth = 0;
  let inString = false;
  let escaped = false;

  for (let i = firstBrace; i < cleaned.length; i++) {
    const ch = cleaned[i];
    if (escaped) {
      escaped = false;
      continue;
    }
    if (ch === "\\" && inString) {
      escaped = true;
      continue;
    }
    if (ch === '"') {
      inString = !inString;
      continue;
    }
    if (!inString) {
      if (ch === "{") depth += 1;
      else if (ch === "}") {
        depth -= 1;
        if (depth === 0) {
          const slice = cleaned.slice(firstBrace, i + 1);
          const parsedSlice = tryParse(slice);
          if (parsedSlice) return parsedSlice;
        }
      }
    }
  }

  return null;
}

// -----------------------------------------------------------------------------
// 1. In-Memory Response Cache (Zero Upstream Token Burn for Repeated Queries)
// -----------------------------------------------------------------------------
interface CacheEntry {
  result: RouterChatResult;
  expiresAt: number;
}

const responseCache = new Map<string, CacheEntry>();
const MAX_CACHE_ENTRIES = 500;

function computeCacheKey(messages: ChatMessage[], responseFormatJson?: boolean): string {
  const serialized = JSON.stringify({
    messages,
    jsonMode: Boolean(responseFormatJson),
  });
  return crypto.createHash("sha256").update(serialized).digest("hex");
}

function getFromCache(key: string): RouterChatResult | null {
  const entry = responseCache.get(key);
  if (!entry) return null;

  if (Date.now() > entry.expiresAt) {
    responseCache.delete(key);
    return null;
  }

  return {
    ...entry.result,
    sourceMode: `${entry.result.sourceMode}-cached`,
    fromCache: true,
  };
}

function setToCache(key: string, result: RouterChatResult, ttlMs: number) {
  if (responseCache.size >= MAX_CACHE_ENTRIES) {
    const oldestKey = responseCache.keys().next().value;
    if (oldestKey) responseCache.delete(oldestKey);
  }

  responseCache.set(key, {
    result,
    expiresAt: Date.now() + ttlMs,
  });
}

// -----------------------------------------------------------------------------
// 2. Proactive Circuit Breaker & Cooldown Tracking (Anti-Ban Guard)
// -----------------------------------------------------------------------------
interface ModelHealth {
  consecutiveFailures: number;
  cooldownUntil: number;
  lastErrorReason: string;
}

const modelHealthRegistry = new Map<string, ModelHealth>();
const providerCooldownRegistry = new Map<"router" | "gemini", number>();
const nextAllowedUpstreamAt = new Map<"router" | "gemini", number>();
const inFlightRequests = new Map<string, Promise<RouterChatResult | null>>();

function sleepMs(ms: number): Promise<void> {
  if (ms <= 0) return Promise.resolve();
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Reserves a paced time slot before hitting an upstream AI provider so concurrent
 * or back-to-back requests never burst-flood the API key and trigger HTTP 429.
 * Returns false if the queue wait would exceed maxWaitMs.
 */
async function acquireUpstreamPacingSlot(
  provider: "router" | "gemini",
  remainingBudgetMs: number
): Promise<boolean> {
  const now = Date.now();
  const cdUntil = providerCooldownRegistry.get(provider) || 0;
  if (now < cdUntil) {
    const sec = Math.ceil((cdUntil - now) / 1000);
    console.warn(
      `[Anti-429 Guard] Provider '${provider}' is in 429 protection cooldown for ${sec}s. Skipping upstream call.`
    );
    return false;
  }

  const baseMinInterval =
    provider === "gemini"
      ? parseInt(process.env.GEMINI_MIN_DELAY_MS || "1350", 10)
      : parseInt(process.env.ROUTER_MIN_DELAY_MS || "650", 10);
  const jitter = Math.floor(Math.random() * 220) + 80;
  const minSpacing = Math.max(200, baseMinInterval) + jitter;

  const prevNextAllowed = nextAllowedUpstreamAt.get(provider) || 0;
  const scheduledStart = Math.max(now + 90, prevNextAllowed);
  const waitMs = scheduledStart - now;

  // Jangan menahan request jika antrean delay melebihi sisa waktu aman
  const maxQueueWait = Math.min(3400, Math.max(400, remainingBudgetMs - 1400));
  if (waitMs > maxQueueWait) {
    console.warn(
      `[Anti-429 Pacing] Queue wait (${waitMs}ms) for '${provider}' exceeds safe budget (${maxQueueWait}ms). Diverting to fallback.`
    );
    return false;
  }

  nextAllowedUpstreamAt.set(provider, scheduledStart + minSpacing);
  if (waitMs > 0) {
    await sleepMs(waitMs);
  }
  return true;
}

function isModelInCooldown(model: string): boolean {
  const health = modelHealthRegistry.get(model);
  if (!health) return false;

  if (Date.now() < health.cooldownUntil) {
    const remainingSec = Math.round((health.cooldownUntil - Date.now()) / 1000);
    console.warn(
      `[Anti-Ban Guard] Model '${model}' is in cooldown for ${remainingSec}s (${health.lastErrorReason}). Skipping.`
    );
    return true;
  }

  return false;
}

function recordModelSuccess(model: string) {
  modelHealthRegistry.set(model, {
    consecutiveFailures: 0,
    cooldownUntil: 0,
    lastErrorReason: "",
  });
}

function isRateLimitError(status: number, errorSnippet: string): boolean {
  const lower = errorSnippet.toLowerCase();
  return (
    status === 429 ||
    lower.includes("rate-limited") ||
    lower.includes("rate limit") ||
    lower.includes("resource_exhausted") ||
    lower.includes("too many requests") ||
    lower.includes("quota")
  );
}

function recordModelFailure(model: string, status: number, errorSnippet: string) {
  const current = modelHealthRegistry.get(model) || {
    consecutiveFailures: 0,
    cooldownUntil: 0,
    lastErrorReason: "",
  };

  const newFailures = current.consecutiveFailures + 1;
  const is429 = isRateLimitError(status, errorSnippet);
  const isInvalidOrGone = status === 400 || status === 404;

  const configuredCooldownMs = parseInt(process.env.ROUTER_COOLDOWN_MS || "900000", 10);
  const cooldownDuration = is429 || isInvalidOrGone
    ? configuredCooldownMs
    : status === 0 || newFailures >= 2
    ? 180000
    : 45000;

  modelHealthRegistry.set(model, {
    consecutiveFailures: newFailures,
    cooldownUntil: Date.now() + cooldownDuration,
    lastErrorReason: is429
      ? `Rate limit 429 (auto-cooled ${Math.round(cooldownDuration / 60000)}m)`
      : `HTTP ${status}: ${errorSnippet.slice(0, 60)}`,
  });

  if (is429) {
    const provider: "router" | "gemini" = model.startsWith("gemini:")
      ? "gemini"
      : "router";
    const providerCoolMs = parseInt(
      process.env.PROVIDER_429_COOLDOWN_MS || "60000",
      10
    );
    providerCooldownRegistry.set(provider, Date.now() + providerCoolMs);
    console.warn(
      `[Anti-429 Guard] Provider '${provider}' placed into global 429 cooldown for ${Math.round(providerCoolMs / 1000)}s to protect API key.`
    );
  }

  console.warn(
    `[Anti-Ban Guard] Model '${model}' placed into cooldown for ${Math.round(cooldownDuration / 1000)}s.`
  );
}

// -----------------------------------------------------------------------------
// 3. Humanized Retry Jitter & Local/SSE Helpers
// -----------------------------------------------------------------------------
async function applyRetryJitter(remainingMs: number) {
  const minJitter = Math.min(parseInt(process.env.ROUTER_JITTER_MIN_MS || "120", 10), 250);
  const maxJitter = Math.min(parseInt(process.env.ROUTER_JITTER_MAX_MS || "280", 10), 350);
  if (maxJitter <= 0 || remainingMs < 1500) return;

  const delayMs = Math.floor(Math.random() * (maxJitter - minJitter + 1)) + minJitter;
  await new Promise((resolve) => setTimeout(resolve, delayMs));
}

function isLocalRouterUrl(urlStr: string): boolean {
  return /^https?:\/\/(127\.0\.0\.1|localhost|0\.0\.0\.0|\[::1\])(:\d+)?(\/|$)/i.test(
    urlStr.trim()
  );
}

async function parseRouterResponseText(
  res: Response
): Promise<{ text: string; promptTokens?: number; completionTokens?: number } | null> {
  const contentType = res.headers.get("content-type") || "";
  const rawBody = await res.text();
  if (!rawBody.trim()) return null;

  // Handle SSE chunks if upstream ignores stream: false
  if (contentType.includes("text/event-stream") || rawBody.trimStart().startsWith("data:")) {
    const parts: string[] = [];
    for (const line of rawBody.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed.startsWith("data:")) continue;
      const payloadStr = trimmed.slice(5).trim();
      if (!payloadStr || payloadStr === "[DONE]") continue;
      try {
        const chunk = JSON.parse(payloadStr);
        const delta = chunk?.choices?.[0]?.delta?.content ?? chunk?.choices?.[0]?.message?.content;
        if (typeof delta === "string") parts.push(delta);
      } catch {
        // Ignore partial chunk
      }
    }
    const merged = parts.join("").trim();
    return merged ? { text: merged } : null;
  }

  try {
    const data = JSON.parse(rawBody);
    const content = data?.choices?.[0]?.message?.content;
    if (typeof content === "string" && content.trim()) {
      return {
        text: content.trim(),
        promptTokens: data?.usage?.prompt_tokens,
        completionTokens: data?.usage?.completion_tokens,
      };
    }
  } catch {
    return null;
  }

  return null;
}

// -----------------------------------------------------------------------------
// 4. Main Resilient Router Caller
// -----------------------------------------------------------------------------
export async function callRouterWithFailover(
  options: RouterChatOptions
): Promise<RouterChatResult | null> {
  const routerBase = process.env.ROUTER_API_BASE || process.env.NINEROUTER_API_BASE;
  if (!routerBase) {
    return null;
  }

  // In serverless deployment (Vercel), never stall trying to connect to laptop localhost
  if (process.env.VERCEL && isLocalRouterUrl(routerBase)) {
    return null;
  }

  const cacheEnabled = process.env.ROUTER_CACHE_ENABLED !== "false";
  const cacheTtlMs = parseInt(process.env.ROUTER_CACHE_TTL_MS || "7200000", 10);
  const cacheKey = computeCacheKey(options.messages, options.responseFormatJson);

  if (cacheEnabled && !options.bypassCache) {
    const cached = getFromCache(cacheKey);
    if (cached && (!options.validateResponse || options.validateResponse(cached.content))) {
      return cached;
    }
    const existingInFlight = inFlightRequests.get(`router:${cacheKey}`);
    if (existingInFlight) {
      return existingInFlight;
    }
  }

  const nowCheck = Date.now();
  if (nowCheck < (providerCooldownRegistry.get("router") || 0)) {
    return null;
  }

  const routerKey = process.env.ROUTER_API_KEY || process.env.NINEROUTER_API_KEY || "";
  const cleanBase = routerBase.replace(/\/+$/, "");
  const endpoint = cleanBase.endsWith("/v1")
    ? `${cleanBase}/chat/completions`
    : cleanBase.includes("/v1/")
    ? `${cleanBase}/chat/completions`
    : `${cleanBase}/v1/chat/completions`;

  const primaryModel =
    options.model ||
    process.env.ROUTER_COMBO_MODEL ||
    process.env.ROUTER_MODEL ||
    "ag/gemini-3-flash";

  // Healthy verified fallbacks are included ahead of unreachable legacy combos
  const healthyDefaults = [
    "ag/gemini-3-flash",
    "ag/gemini-3-flash-agent",
    "ag/gemini-3.8-flash-low",
    "openrouter/openrouter/free",
  ];

  const envBackups = process.env.ROUTER_BACKUP_MODELS
    ? process.env.ROUTER_BACKUP_MODELS.split(",").map((m) => m.trim()).filter(Boolean)
    : [];

  const backupCandidates = options.backupModels || [
    ...healthyDefaults,
    ...envBackups,
  ];
  const rawModelChain = Array.from(new Set([primaryModel, ...backupCandidates]));

  const activeModelChain = rawModelChain.filter((m) => !isModelInCooldown(m));
  if (activeModelChain.length === 0) {
    return null;
  }

  const totalBudgetMs =
    options.totalBudgetMs ||
    parseInt(
      process.env.ROUTER_TOTAL_BUDGET_MS || (process.env.VERCEL ? "5000" : "7500"),
      10
    );

  const runRouterChain = async (): Promise<RouterChatResult | null> => {
    const startedAt = Date.now();
    const pacedOk = await acquireUpstreamPacingSlot("router", totalBudgetMs);
    if (!pacedOk) return null;

    for (let i = 0; i < activeModelChain.length; i++) {
      const model = activeModelChain[i];
      const remainingMs = totalBudgetMs - (Date.now() - startedAt);
      if (remainingMs < 700) {
        break;
      }

      if (i > 0) {
        await applyRetryJitter(remainingMs);
      }

      const postJitterRemaining = totalBudgetMs - (Date.now() - startedAt);
      if (postJitterRemaining < 600) {
        break;
      }

      const attemptTimeoutMs = Math.min(
        options.timeoutMs ?? 3800,
        3800,
        postJitterRemaining
      );
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), attemptTimeoutMs);

      try {
        const payload: Record<string, unknown> = {
          model,
          stream: false,
          messages: options.messages,
        };

        if (options.responseFormatJson) {
          payload.response_format = { type: "json_object" };
        }

        const res = await fetch(endpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "User-Agent": "KertaMargaGateway/1.0 (+https://kertamarga.baliprov.go.id)",
            ...(routerKey ? { Authorization: `Bearer ${routerKey}` } : {}),
          },
          body: JSON.stringify(payload),
          signal: controller.signal,
        });

        clearTimeout(timeout);

        if (!res.ok) {
          const errBody = await res.text().catch(() => "");
          recordModelFailure(model, res.status, errBody);
          if (isRateLimitError(res.status, errBody)) {
            break;
          }
          continue;
        }

        const parsedOut = await parseRouterResponseText(res);
        if (parsedOut?.text) {
          if (options.validateResponse && !options.validateResponse(parsedOut.text)) {
            recordModelFailure(model, 422, "Invalid structured JSON payload");
            continue;
          }

          recordModelSuccess(model);

          const result: RouterChatResult = {
            content: parsedOut.text,
            modelUsed: model,
            sourceMode: `9router-${model.split("/")[0] || "combo"}`,
            promptTokens: parsedOut.promptTokens,
            completionTokens: parsedOut.completionTokens,
            fromCache: false,
          };

          if (cacheEnabled) {
            setToCache(cacheKey, result, cacheTtlMs);
          }

          return result;
        }
      } catch (err: unknown) {
        clearTimeout(timeout);
        const errMsg = err instanceof Error ? err.message : String(err);
        recordModelFailure(model, 0, errMsg);
      }
    }

    return null;
  };

  if (cacheEnabled && !options.bypassCache) {
    const promise = runRouterChain().finally(() => {
      inFlightRequests.delete(`router:${cacheKey}`);
    });
    inFlightRequests.set(`router:${cacheKey}`, promise);
    return promise;
  }

  return runRouterChain();
}

export interface GeminiDirectOptions {
  apiKey?: string;
  systemInstruction: string;
  userPrompt: string;
  candidateModels?: string[];
  perModelTimeoutMs?: number;
  totalBudgetMs?: number;
  bypassCache?: boolean;
  validateResponse?: (text: string) => boolean;
}

/**
 * Direct Google Gemini REST API caller with anti-429 pacing queue,
 * provider circuit breaker, response caching, and retry backoff delay.
 */
export async function callGeminiDirectWithFailover(
  options: GeminiDirectOptions
): Promise<{ content: string; modelUsed: string } | null> {
  const apiKey = options.apiKey ?? process.env.GEMINI_API_KEY;
  if (!apiKey) return null;

  const cacheEnabled = process.env.ROUTER_CACHE_ENABLED !== "false";
  const cacheTtlMs = parseInt(process.env.ROUTER_CACHE_TTL_MS || "7200000", 10);
  const cacheKey = computeCacheKey(
    [
      { role: "system", content: options.systemInstruction },
      { role: "user", content: options.userPrompt },
    ],
    true
  );

  if (cacheEnabled && !options.bypassCache) {
    const cached = getFromCache(cacheKey);
    if (cached && (!options.validateResponse || options.validateResponse(cached.content))) {
      return { content: cached.content, modelUsed: cached.modelUsed };
    }
    const existingInFlight = inFlightRequests.get(`gemini:${cacheKey}`);
    if (existingInFlight) {
      const shared = await existingInFlight;
      return shared ? { content: shared.content, modelUsed: shared.modelUsed } : null;
    }
  }

  if (Date.now() < (providerCooldownRegistry.get("gemini") || 0)) {
    return null;
  }

  const rawCandidates = options.candidateModels ?? [
    process.env.GEMINI_MODEL || "gemini-3.5-flash-lite",
    "gemini-flash-lite-latest",
    "gemini-3.5-flash-lite",
    "gemini-3.5-flash",
  ];
  const uniqueCandidates = Array.from(new Set(rawCandidates.filter(Boolean)));
  const activeCandidates = uniqueCandidates.filter(
    (m) => !isModelInCooldown(`gemini:${m}`)
  );
  if (activeCandidates.length === 0) {
    return null;
  }

  const totalBudgetMs = options.totalBudgetMs ?? 13000;
  const perModelTimeoutMs = options.perModelTimeoutMs ?? 6500;

  const runGeminiChain = async (): Promise<RouterChatResult | null> => {
    const startedAt = Date.now();
    const pacedOk = await acquireUpstreamPacingSlot("gemini", totalBudgetMs);
    if (!pacedOk) return null;

    for (let i = 0; i < activeCandidates.length; i++) {
      const gModel = activeCandidates[i];
      const remainingMs = totalBudgetMs - (Date.now() - startedAt);
      if (remainingMs < 1100) break;

      if (i > 0) {
        // Berikan jeda aman antar-percobaan pada API key yang sama agar tidak memicu burst 429
        const retryBackoffMs = 750 + Math.floor(Math.random() * 350);
        if (remainingMs - retryBackoffMs < 1100) break;
        await sleepMs(retryBackoffMs);
      }

      const postWaitRemaining = totalBudgetMs - (Date.now() - startedAt);
      if (postWaitRemaining < 1000) break;

      const attemptMs = Math.min(perModelTimeoutMs, postWaitRemaining);
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), attemptMs);

      try {
        const res = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${gModel}:generateContent?key=${apiKey}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              systemInstruction: { parts: [{ text: options.systemInstruction }] },
              contents: [
                {
                  role: "user",
                  parts: [{ text: options.userPrompt }],
                },
              ],
              generationConfig: {
                responseMimeType: "application/json",
              },
            }),
            signal: controller.signal,
          }
        );
        clearTimeout(timer);

        if (!res.ok) {
          const errBody = await res.text().catch(() => "");
          recordModelFailure(`gemini:${gModel}`, res.status, errBody);
          // Jika terjadi 429 pada API key Gemini, hentikan percobaan ke model Gemini lain agar API key tidak diblokir
          if (isRateLimitError(res.status, errBody)) {
            break;
          }
          continue;
        }

        const data = await res.json();
        const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (typeof rawText === "string" && rawText.trim().length > 0) {
          if (options.validateResponse && !options.validateResponse(rawText)) {
            recordModelFailure(`gemini:${gModel}`, 422, "Invalid structured JSON payload");
            continue;
          }
          recordModelSuccess(`gemini:${gModel}`);
          const result: RouterChatResult = {
            content: rawText.trim(),
            modelUsed: gModel,
            sourceMode: "gemini-structured",
            fromCache: false,
          };
          if (cacheEnabled) {
            setToCache(cacheKey, result, cacheTtlMs);
          }
          return result;
        }
      } catch (err: unknown) {
        clearTimeout(timer);
        const errMsg = err instanceof Error ? err.message : String(err);
        recordModelFailure(`gemini:${gModel}`, 0, errMsg);
      }
    }

    return null;
  };

  if (cacheEnabled && !options.bypassCache) {
    const promise = runGeminiChain().finally(() => {
      inFlightRequests.delete(`gemini:${cacheKey}`);
    });
    inFlightRequests.set(`gemini:${cacheKey}`, promise);
    const out = await promise;
    return out ? { content: out.content, modelUsed: out.modelUsed } : null;
  }

  const out = await runGeminiChain();
  return out ? { content: out.content, modelUsed: out.modelUsed } : null;
}
