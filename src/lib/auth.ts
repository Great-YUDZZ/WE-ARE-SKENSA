import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

export const SESSION_COOKIE = "kertamarga_session";
const MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

// Hash bcrypt statis berbiaya 10 untuk menjaga waktu komputasi tetap seragam saat user tidak ditemukan (anti-timing enumeration)
const DUMMY_PASSWORD_HASH =
  "$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy";

const WEAK_PASSWORD_BLACKLIST = new Set([
  "password",
  "password1",
  "password12",
  "password123",
  "password1234",
  "12345678",
  "123456789",
  "1234567890",
  "qwerty123",
  "qwertyui",
  "qwertyuiop",
  "siswa123",
  "siswa2025",
  "siswa2026",
  "bali2025",
  "bali2026",
  "bali2026!",
  "admin123",
  "admin1234",
  "kertamarga",
  "kertamarga1",
  "kertamarga123",
  "iloveyou1",
  "abc12345",
  "abc123456",
  "11111111",
  "00000000",
]);

function getSecret(): Uint8Array {
  const raw =
    process.env.AUTH_SECRET ??
    process.env.NEXTAUTH_SECRET ??
    "kertamarga-dev-secret-ganti-di-produksi-minimal-32-karakter";
  return new TextEncoder().encode(raw);
}

export function validatePasswordStrength(password: string): {
  valid: boolean;
  error?: string;
} {
  if (typeof password !== "string" || password.length < 8) {
    return {
      valid: false,
      error: "Kata sandi minimal 8 karakter.",
    };
  }
  if (password.length > 128) {
    return {
      valid: false,
      error: "Kata sandi maksimal 128 karakter.",
    };
  }

  const normalized = password.trim().toLowerCase();
  const stripped = normalized.replace(/[^a-z0-9]/g, "");
  if (
    WEAK_PASSWORD_BLACKLIST.has(normalized) ||
    WEAK_PASSWORD_BLACKLIST.has(stripped)
  ) {
    return {
      valid: false,
      error:
        "Kata sandi terlalu umum dan mudah ditebak. Gunakan kombinasi huruf dan angka yang unik.",
    };
  }

  if (/^(.)\1+$/.test(password)) {
    return {
      valid: false,
      error: "Kata sandi tidak boleh berisi karakter berulang yang sama.",
    };
  }

  const hasLetter = /[a-zA-Z]/.test(password);
  const hasDigit = /[0-9]/.test(password);
  if (!hasLetter || !hasDigit) {
    return {
      valid: false,
      error: "Kata sandi wajib mengandung kombinasi huruf dan angka.",
    };
  }

  return { valid: true };
}

export function resolveVerifiedRole(input: {
  requestedRole?: "siswa" | "guru";
  identifier: string;
  email: string;
}): {
  allowed: boolean;
  role: "siswa" | "guru";
  error?: string;
} {
  if (!input.requestedRole || input.requestedRole === "siswa") {
    return { allowed: true, role: "siswa" };
  }

  const cleanId = input.identifier.trim();
  const cleanEmail = input.email.trim().toLowerCase();

  const allowedEnvEmails = (process.env.GURU_ALLOWED_EMAILS || "")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);

  if (allowedEnvEmails.includes(cleanEmail)) {
    return { allowed: true, role: "guru" };
  }

  // Verifikasi ketat NIP 18 digit ASN/Guru + domain email pendidikan resmi
  const isValidNip18 = /^\d{18}$/.test(cleanId);
  const isOfficialEducatorDomain =
    /@(?:[a-z0-9-]+\.)?(?:belajar\.id|sch\.id|ac\.id|baliprov\.go\.id|kemdikbud\.go\.id)$/.test(
      cleanEmail
    ) && !cleanEmail.endsWith("@siswa.sch.id");

  if (isValidNip18 && isOfficialEducatorDomain) {
    return { allowed: true, role: "guru" };
  }

  return {
    allowed: false,
    role: "siswa",
    error:
      "Pendaftaran peran Guru BK memerlukan NIP 18 digit resmi dan email institusi pendidikan terverifikasi (@belajar.id / domain sekolah resmi).",
  };
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function verifyPasswordConstantTime(
  password: string,
  hash?: string | null
): Promise<boolean> {
  const targetHash = hash || DUMMY_PASSWORD_HASH;
  const matched = await bcrypt.compare(password, targetHash);
  return Boolean(hash) && matched;
}

export async function signSession(
  userId: number,
  role: "siswa" | "guru" = "siswa"
): Promise<string> {
  return new SignJWT({ sub: String(userId), role })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getSecret());
}

export async function verifySession(token: string): Promise<number | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    const id = Number(payload.sub);
    return Number.isFinite(id) ? id : null;
  } catch {
    return null;
  }
}

export async function setSessionCookie(token: string) {
  const store = await cookies();
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE_SECONDS,
  });
}

export async function clearSessionCookie() {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
}

export async function getSessionUserId(): Promise<number | null> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  return verifySession(token);
}

interface AttemptRecord {
  count: number;
  resetAt: number;
  lockedUntil?: number;
}

interface GlobalAuthRateStore {
  __km_auth_attempts?: Map<string, AttemptRecord>;
  __km_login_failures?: Map<string, AttemptRecord>;
}

const g = globalThis as unknown as GlobalAuthRateStore;

function getAttemptsMap(): Map<string, AttemptRecord> {
  if (!g.__km_auth_attempts) {
    g.__km_auth_attempts = new Map<string, AttemptRecord>();
  }
  return g.__km_auth_attempts;
}

function getFailuresMap(): Map<string, AttemptRecord> {
  if (!g.__km_login_failures) {
    g.__km_login_failures = new Map<string, AttemptRecord>();
  }
  return g.__km_login_failures;
}

export function isRateLimited(
  key: string,
  maxPerMinute = 10,
  windowMs = 60_000
): boolean {
  const now = Date.now();
  const attempts = getAttemptsMap();
  const entry = attempts.get(key);
  if (!entry || now > entry.resetAt) {
    attempts.set(key, { count: 1, resetAt: now + windowMs });
    return false;
  }
  entry.count += 1;
  return entry.count > maxPerMinute;
}

const MAX_FAILED_LOGINS_PER_ACCOUNT = 5;
const MAX_FAILED_LOGINS_PER_IP = 15;
const LOCKOUT_WINDOW_MS = 15 * 60 * 1000;

export function checkLoginLockout(
  ip: string,
  loginIdentifier: string
): { locked: boolean; retryAfterSeconds: number } {
  const now = Date.now();
  const map = getFailuresMap();
  const keys = [
    `acct:${loginIdentifier.trim().toLowerCase()}`,
    `ip:${ip.trim().toLowerCase()}`,
  ];

  for (const k of keys) {
    const rec = map.get(k);
    if (rec?.lockedUntil && now < rec.lockedUntil) {
      return {
        locked: true,
        retryAfterSeconds: Math.max(1, Math.ceil((rec.lockedUntil - now) / 1000)),
      };
    }
  }

  return { locked: false, retryAfterSeconds: 0 };
}

export function recordFailedLogin(ip: string, loginIdentifier: string): {
  locked: boolean;
  retryAfterSeconds: number;
} {
  const now = Date.now();
  const map = getFailuresMap();
  const targets = [
    {
      key: `acct:${loginIdentifier.trim().toLowerCase()}`,
      threshold: MAX_FAILED_LOGINS_PER_ACCOUNT,
    },
    {
      key: `ip:${ip.trim().toLowerCase()}`,
      threshold: MAX_FAILED_LOGINS_PER_IP,
    },
  ];

  let locked = false;
  let maxRetry = 0;

  for (const { key, threshold } of targets) {
    const existing = map.get(key);
    if (!existing || now > existing.resetAt) {
      map.set(key, {
        count: 1,
        resetAt: now + LOCKOUT_WINDOW_MS,
      });
      continue;
    }

    existing.count += 1;
    if (existing.count >= threshold) {
      existing.lockedUntil = now + LOCKOUT_WINDOW_MS;
      locked = true;
      maxRetry = Math.max(
        maxRetry,
        Math.ceil((existing.lockedUntil - now) / 1000)
      );
    }
  }

  return { locked, retryAfterSeconds: maxRetry };
}

export function clearFailedLogin(ip: string, loginIdentifier: string): void {
  const map = getFailuresMap();
  map.delete(`acct:${loginIdentifier.trim().toLowerCase()}`);
  map.delete(`ip:${ip.trim().toLowerCase()}`);
}
