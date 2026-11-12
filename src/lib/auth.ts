import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { findUserById, upsertUserInStore } from "./db";
import type { UserRow } from "./schema";

export const SESSION_COOKIE = "kertamarga_session";
export const ACCOUNT_VAULT_COOKIE = "kertamarga_vault";
const MAX_AGE_SECONDS = 60 * 60 * 24 * 7;
export const VAULT_MAX_AGE_SECONDS = 60 * 60 * 24 * 30;

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

export interface VaultAccountEntry {
  id: number;
  name: string;
  identifier: string;
  email: string;
  passwordHash: string;
  role: "siswa" | "guru";
  interests: string[];
  createdAt: string;
}

async function decodeVaultToken(token?: string | null): Promise<VaultAccountEntry[]> {
  if (!token || typeof token !== "string") return [];
  try {
    const { payload } = await jwtVerify(token, getSecret());
    const rawList = payload.accounts;
    if (!Array.isArray(rawList)) return [];
    const valid: VaultAccountEntry[] = [];
    for (const item of rawList) {
      if (
        item &&
        typeof item === "object" &&
        typeof (item as VaultAccountEntry).id === "number" &&
        typeof (item as VaultAccountEntry).identifier === "string" &&
        typeof (item as VaultAccountEntry).email === "string" &&
        typeof (item as VaultAccountEntry).passwordHash === "string"
      ) {
        const entry = item as VaultAccountEntry;
        valid.push({
          id: entry.id,
          name: String(entry.name || "Pengguna KertaMarga").slice(0, 120),
          identifier: entry.identifier.trim().slice(0, 80),
          email: entry.email.trim().toLowerCase().slice(0, 160),
          passwordHash: entry.passwordHash,
          role: entry.role === "guru" ? "guru" : "siswa",
          interests: Array.isArray(entry.interests)
            ? entry.interests.filter((x): x is string => typeof x === "string").slice(0, 12)
            : [],
          createdAt:
            typeof entry.createdAt === "string"
              ? entry.createdAt
              : new Date().toISOString(),
        });
      }
    }
    return valid;
  } catch {
    return [];
  }
}

export async function hydrateVaultUsers(
  extraVaultToken?: string | null
): Promise<VaultAccountEntry[]> {
  let cookieToken: string | undefined;
  try {
    const store = await cookies();
    cookieToken = store.get(ACCOUNT_VAULT_COOKIE)?.value;
  } catch {
    // Abaikan bila dipanggil di luar konteks request cookies
  }

  const fromCookie = await decodeVaultToken(cookieToken);
  const fromExtra =
    extraVaultToken && extraVaultToken !== cookieToken
      ? await decodeVaultToken(extraVaultToken)
      : [];

  const mergedMap = new Map<string, VaultAccountEntry>();
  for (const item of [...fromCookie, ...fromExtra]) {
    mergedMap.set(item.identifier.toLowerCase(), item);
    upsertUserInStore({
      id: item.id,
      name: item.name,
      identifier: item.identifier,
      email: item.email,
      passwordHash: item.passwordHash,
      role: item.role,
      interests: item.interests,
      createdAt: new Date(item.createdAt),
      updatedAt: new Date(),
    });
  }

  return Array.from(mergedMap.values());
}

export async function buildUpdatedVaultToken(
  user: UserRow,
  extraVaultToken?: string | null
): Promise<string> {
  const existing = await hydrateVaultUsers(extraVaultToken);
  const entry: VaultAccountEntry = {
    id: user.id,
    name: user.name,
    identifier: user.identifier,
    email: user.email.toLowerCase(),
    passwordHash: user.passwordHash,
    role: user.role === "guru" ? "guru" : "siswa",
    interests: Array.isArray(user.interests) ? user.interests : [],
    createdAt:
      user.createdAt instanceof Date
        ? user.createdAt.toISOString()
        : new Date().toISOString(),
  };

  const filtered = existing.filter(
    (item) =>
      item.identifier.toLowerCase() !== entry.identifier.toLowerCase() &&
      item.email.toLowerCase() !== entry.email.toLowerCase() &&
      item.id !== entry.id
  );
  const accounts = [entry, ...filtered].slice(0, 6);

  return new SignJWT({ accounts })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(getSecret());
}

export async function signSession(
  userId: number,
  role: "siswa" | "guru" = "siswa",
  userSnapshot?: Partial<UserRow>
): Promise<string> {
  return new SignJWT({
    sub: String(userId),
    role,
    ...(userSnapshot?.name ? { name: userSnapshot.name } : {}),
    ...(userSnapshot?.identifier ? { identifier: userSnapshot.identifier } : {}),
    ...(userSnapshot?.email ? { email: userSnapshot.email } : {}),
    ...(Array.isArray(userSnapshot?.interests)
      ? { interests: userSnapshot.interests }
      : {}),
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getSecret());
}

export async function verifySession(token: string): Promise<number | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    const id = Number(payload.sub);
    if (!Number.isFinite(id)) return null;

    // Pastikan akun tersedia di instance serverless saat ini bila memakai fallback file-storage
    const existing = await findUserById(id);
    if (
      !existing &&
      typeof payload.identifier === "string" &&
      typeof payload.email === "string"
    ) {
      upsertUserInStore({
        id,
        name: typeof payload.name === "string" ? payload.name : "Pengguna KertaMarga",
        identifier: payload.identifier,
        email: payload.email,
        passwordHash: DUMMY_PASSWORD_HASH,
        role: payload.role === "guru" ? "guru" : "siswa",
        interests: Array.isArray(payload.interests)
          ? payload.interests.filter((x): x is string => typeof x === "string")
          : [],
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }
    return id;
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
  await hydrateVaultUsers(store.get(ACCOUNT_VAULT_COOKIE)?.value);
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
