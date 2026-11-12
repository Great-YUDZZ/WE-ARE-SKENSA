import fs from "fs";
import path from "path";
import { createPool, type Pool } from "mysql2/promise";
import { drizzle, type MySql2Database } from "drizzle-orm/mysql2";
import { eq } from "drizzle-orm";
import { users, type UserRow, type SafeUser, toSafeUser } from "./schema";

// Klien database MySQL MariaDB dengan persistent file fallback untuk offline / demo
type DbHandle = MySql2Database;

let pool: Pool | null = null;
let handle: DbHandle | null = null;
let dbReady = false;
let mysqlFailedAt = 0;

function hasMysqlConfig(): boolean {
  if (process.env.DATABASE_URL?.trim()) return true;
  if (process.env.DB_HOST?.trim()) return true;
  // Di lingkungan Vercel tanpa DB_HOST / DATABASE_URL, jangan mencoba 127.0.0.1:3306
  if (process.env.VERCEL) return false;
  return true;
}

function shouldAttemptMysql(): boolean {
  if (!hasMysqlConfig()) return false;
  if (mysqlFailedAt > 0 && Date.now() - mysqlFailedAt < 60_000) {
    return false;
  }
  return true;
}

function getPool(): Pool {
  if (pool) return pool;
  const url = process.env.DATABASE_URL;
  if (url) {
    return (pool = createPool({ uri: url, connectTimeout: 4500 }));
  }
  return (pool = createPool({
    host: process.env.DB_HOST ?? "127.0.0.1",
    port: Number(process.env.DB_PORT ?? 3306),
    database: process.env.DB_DATABASE ?? "kertamarga_bali",
    user: process.env.DB_USERNAME ?? "kertamarga_app",
    password: process.env.DB_PASSWORD ?? "",
    connectTimeout: 4500,
    waitForConnections: true,
    connectionLimit: 10,
    charset: "utf8mb4",
  }));
}

export function getActiveMysqlPool(): Pool | null {
  if (!shouldAttemptMysql()) return null;
  return getPool();
}

export function markMysqlReady() {
  dbReady = true;
}

export function markMysqlFailed() {
  mysqlFailedAt = Date.now();
}

function getHandle(): DbHandle {
  if (!handle) {
    handle = drizzle(getPool());
  }
  return handle;
}

// ============================================================================
// PERSISTENT FILE STORAGE FALLBACK (data/users.json atau /tmp di Vercel)
// Digunakan saat MySQL offline atau belum terkonfigurasi, agar akun siswa
// dan guru tetap tersimpan permanen dan tidak hilang saat reload atau antar route.
// Di Vercel Serverless, file system root bersifat read-only sehingga dialihkan ke /tmp.
// ============================================================================

// Akun demo opsional dimuat dari environment variable (tidak ditanam di public repo)
function getEnvSeedUsers(): UserRow[] {
  const raw = process.env.DEMO_SEED_USERS_JSON;
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    const now = new Date();
    return parsed
      .filter(
        (item) =>
          item &&
          typeof item.identifier === "string" &&
          typeof item.email === "string" &&
          typeof item.passwordHash === "string"
      )
      .map((item, idx) => ({
        id: Number(item.id) || 1001 + idx,
        name: String(item.name || "Pengguna Demo"),
        identifier: String(item.identifier).trim(),
        email: String(item.email).trim().toLowerCase(),
        passwordHash: String(item.passwordHash),
        role: item.role === "guru" ? "guru" : "siswa",
        interests: Array.isArray(item.interests) ? item.interests.map(String) : [],
        createdAt: now,
        updatedAt: now,
      }));
  } catch {
    console.warn("Format DEMO_SEED_USERS_JSON tidak valid, melewati seed demo.");
    return [];
  }
}

const DATA_DIR = process.env.VERCEL
  ? path.join("/tmp", "kertamarga-data")
  : path.join(process.cwd(), "data");
const USERS_FILE = path.join(DATA_DIR, "users.json");

interface GlobalStore {
  __kertamarga_users?: Map<string, UserRow>;
  __kertamarga_seq?: number;
}

const g = globalThis as unknown as GlobalStore;

function initFileStore(): Map<string, UserRow> {
  if (g.__kertamarga_users) {
    return g.__kertamarga_users;
  }

  const map = new Map<string, UserRow>();
  let maxId = 1000;

  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    if (fs.existsSync(USERS_FILE)) {
      const raw = fs.readFileSync(USERS_FILE, "utf-8");
      const list = JSON.parse(raw) as UserRow[];
      if (Array.isArray(list)) {
        for (const item of list) {
          const row: UserRow = {
            ...item,
            createdAt: new Date(item.createdAt),
            updatedAt: new Date(item.updatedAt),
          };
          map.set(row.identifier.toLowerCase(), row);
          if (row.id > maxId) {
            maxId = row.id;
          }
        }
      }
    }
  } catch (err) {
    console.error("Gagal membaca file data/users.json:", err);
  }

  // Masukkan akun demo opsional dari environment jika belum ada
  for (const demo of getEnvSeedUsers()) {
    if (!map.has(demo.identifier.toLowerCase())) {
      map.set(demo.identifier.toLowerCase(), demo);
    }
  }

  g.__kertamarga_users = map;
  g.__kertamarga_seq = Math.max(maxId + 1, 1003);
  return map;
}

function persistStore() {
  const map = initFileStore();
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    const list = Array.from(map.values());
    fs.writeFileSync(USERS_FILE, JSON.stringify(list, null, 2), "utf-8");
  } catch {
    // Di lingkungan serverless tertentu jika disk terbatas, biarkan fallback memori aktif tanpa crash
  }
}

function findInStore(key: string): UserRow | null {
  const map = initFileStore();
  const cleanKey = key.trim().toLowerCase();

  for (const row of map.values()) {
    if (
      row.identifier.trim().toLowerCase() === cleanKey ||
      row.email.trim().toLowerCase() === cleanKey
    ) {
      return row;
    }
  }
  return null;
}

function findInStoreById(id: number): UserRow | null {
  const map = initFileStore();
  for (const row of map.values()) {
    if (row.id === id) return row;
  }
  return null;
}

export function upsertUserInStore(row: UserRow): UserRow {
  const map = initFileStore();
  const normalized: UserRow = {
    id: Number(row.id) || 1003,
    name: String(row.name || "Pengguna KertaMarga").trim(),
    identifier: String(row.identifier || row.email).trim(),
    email: String(row.email || row.identifier).trim().toLowerCase(),
    passwordHash: String(row.passwordHash || ""),
    role: row.role === "guru" ? "guru" : "siswa",
    interests: Array.isArray(row.interests) ? row.interests.map(String) : [],
    createdAt:
      row.createdAt instanceof Date
        ? row.createdAt
        : new Date(row.createdAt || Date.now()),
    updatedAt:
      row.updatedAt instanceof Date
        ? row.updatedAt
        : new Date(row.updatedAt || Date.now()),
  };

  map.set(normalized.identifier.toLowerCase(), normalized);
  if (normalized.id >= (g.__kertamarga_seq ?? 1003)) {
    g.__kertamarga_seq = normalized.id + 1;
  }
  persistStore();
  return normalized;
}

export async function findUserByLogin(login: string): Promise<UserRow | null> {
  const value = login.trim();
  if (shouldAttemptMysql()) {
    try {
      const rows = await getHandle()
        .select()
        .from(users)
        .where(eq(users.identifier, value))
        .limit(1);
      if (rows[0]) {
        dbReady = true;
        return rows[0];
      }
      const byEmail = await getHandle()
        .select()
        .from(users)
        .where(eq(users.email, value.toLowerCase()))
        .limit(1);
      if (byEmail[0]) {
        dbReady = true;
        return byEmail[0];
      }
      dbReady = true;
      return findInStore(value);
    } catch {
      mysqlFailedAt = Date.now();
      return findInStore(value);
    }
  }
  return findInStore(value);
}

export async function findUserById(id: number): Promise<UserRow | null> {
  if (shouldAttemptMysql()) {
    try {
      const rows = await getHandle()
        .select()
        .from(users)
        .where(eq(users.id, id))
        .limit(1);
      if (rows[0]) {
        dbReady = true;
        return rows[0];
      }
      return findInStoreById(id);
    } catch {
      mysqlFailedAt = Date.now();
      return findInStoreById(id);
    }
  }
  return findInStoreById(id);
}

type CreateUserInput = {
  name: string;
  identifier: string;
  email: string;
  passwordHash: string;
  role: "siswa" | "guru";
  interests: string[];
};

export async function createUser(input: CreateUserInput): Promise<UserRow> {
  const normalizedEmail = input.email.trim().toLowerCase();
  const normalizedIdentifier = input.identifier.trim();
  if (shouldAttemptMysql()) {
    try {
      const [result] = await getHandle()
        .insert(users)
        .values({
          name: input.name.trim(),
          identifier: normalizedIdentifier,
          email: normalizedEmail,
          passwordHash: input.passwordHash,
          role: input.role,
          interests: input.interests,
        })
        .$returningId();
      dbReady = true;
      const created = await findUserById(Number(result.id));
      if (created) return created;
    } catch (err) {
      const code = (err as { code?: string })?.code;
      if (code === "ER_DUP_ENTRY" || code === "23505") {
        throw err;
      }
      mysqlFailedAt = Date.now();
    }
  }

  // Fallback persistent store saat MySQL belum siap
  const map = initFileStore();
  if (findInStore(normalizedIdentifier) || findInStore(normalizedEmail)) {
    throw Object.assign(new Error("IDENTIFIER_EXISTS"), { code: "ER_DUP_ENTRY" });
  }

  const now = new Date();
  const nextId = g.__kertamarga_seq ?? 1003;
  g.__kertamarga_seq = nextId + 1;

  const row: UserRow = {
    id: nextId,
    name: input.name.trim(),
    identifier: normalizedIdentifier,
    email: normalizedEmail,
    passwordHash: input.passwordHash,
    role: input.role,
    interests: input.interests,
    createdAt: now,
    updatedAt: now,
  };

  map.set(row.identifier.toLowerCase(), row);
  persistStore();
  return row;
}

export async function updateUserById(
  id: number,
  updates: { name?: string; interests?: string[] }
): Promise<UserRow | null> {
  const cleanName = updates.name?.trim();
  const cleanInterests = updates.interests
    ? updates.interests.map((s) => s.trim()).filter(Boolean)
    : undefined;

  if (shouldAttemptMysql()) {
    try {
      const updatePayload: { name?: string; interests?: string[] } = {};
      if (cleanName) updatePayload.name = cleanName;
      if (cleanInterests !== undefined) updatePayload.interests = cleanInterests;

      if (Object.keys(updatePayload).length > 0) {
        await getHandle().update(users).set(updatePayload).where(eq(users.id, id));
        dbReady = true;
        const updated = await findUserById(id);
        if (updated) return updated;
      }
    } catch {
      mysqlFailedAt = Date.now();
      // Fallback ke penyimpanan file lokal bila MySQL belum aktif
    }
  }

  const row = findInStoreById(id);
  if (!row) return null;

  if (cleanName) row.name = cleanName;
  if (cleanInterests !== undefined) row.interests = cleanInterests;
  row.updatedAt = new Date();
  persistStore();
  return row;
}

export function isDbReady(): boolean {
  return dbReady;
}

export function toSafeResponse(row: UserRow): SafeUser {
  return toSafeUser(row);
}
