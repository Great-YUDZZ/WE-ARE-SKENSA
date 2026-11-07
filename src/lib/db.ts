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

function getPool(): Pool {
  if (pool) return pool;
  const url = process.env.DATABASE_URL;
  if (url) {
    return (pool = createPool(url));
  }
  return (pool = createPool({
    host: process.env.DB_HOST ?? "127.0.0.1",
    port: Number(process.env.DB_PORT ?? 3306),
    database: process.env.DB_DATABASE ?? "kertamarga_bali",
    user: process.env.DB_USERNAME ?? "kertamarga_app",
    password: process.env.DB_PASSWORD ?? "",
    waitForConnections: true,
    connectionLimit: 10,
    charset: "utf8mb4",
  }));
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

  g.__kertamarga_users = map;
  g.__kertamarga_seq = maxId + 1;
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
  } catch (err) {
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

export async function findUserByLogin(login: string): Promise<UserRow | null> {
  const value = login.trim();
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
    return null;
  } catch {
    // MySQL tidak merespons, fallback ke persistent file store
    return findInStore(value);
  }
}

export async function findUserById(id: number): Promise<UserRow | null> {
  try {
    const rows = await getHandle()
      .select()
      .from(users)
      .where(eq(users.id, id))
      .limit(1);
    dbReady = true;
    return rows[0] ?? null;
  } catch {
    const map = initFileStore();
    for (const row of map.values()) {
      if (row.id === id) return row;
    }
    return null;
  }
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
  // Coba insert ke MySQL terlebih dahulu
  try {
    const [result] = await getHandle()
      .insert(users)
      .values({
        name: input.name,
        identifier: input.identifier,
        email: input.email.toLowerCase(),
        passwordHash: input.passwordHash,
        role: input.role,
        interests: input.interests,
      })
      .$returningId();
    dbReady = true;
    const created = await findUserById(Number(result.id));
    if (created) {
      // Simpan copy ke file store juga untuk redundansi
      const map = initFileStore();
      map.set(created.identifier.toLowerCase(), created);
      persistStore();
      return created;
    }
  } catch (err) {
    const code = (err as { code?: string })?.code;
    if (code === "ER_DUP_ENTRY" || code === "23505") {
      throw err;
    }
  }

  // Fallback persistent file store saat DB belum siap
  if (findInStore(input.identifier) || findInStore(input.email)) {
    throw Object.assign(new Error("IDENTIFIER_EXISTS"), { code: "ER_DUP_ENTRY" });
  }

  const map = initFileStore();
  const nextId = g.__kertamarga_seq ?? 1001;
  g.__kertamarga_seq = nextId + 1;

  const now = new Date();
  const row: UserRow = {
    id: nextId,
    name: input.name,
    identifier: input.identifier,
    email: input.email.toLowerCase(),
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

export function isDbReady(): boolean {
  return dbReady;
}

export function toSafeResponse(row: UserRow): SafeUser {
  return toSafeUser(row);
}