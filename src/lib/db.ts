import { createPool, type Pool } from "mysql2/promise";
import { drizzle, type MySql2Database } from "drizzle-orm/mysql2";
import { eq } from "drizzle-orm";
import { users, type UserRow, type SafeUser, toSafeUser } from "./schema";

// Klien database MySQL MariaDB dengan fallback memori untuk demo offline
// Fallback memori dipakai hanya jika DB tidak tersedia, agar demo tetap jalan
// dan tidak mengarahkan data ke server saat kredensial belum disiapkan
type DbHandle = MySql2Database;

let pool: Pool | null = null;
let handle: DbHandle | null = null;
let dbReady = false;

function getPool(): Pool {
  if (pool) return pool;
  // Prioritas: DATABASE_URL, lalu variabel terpisah DB_HOST dan teman teman
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

// Penyimpanan memori sementara untuk fallback demo
const memoryStore = new Map<string, UserRow>();
let memorySeq = 1000;

function findInMemory(key: string): UserRow | null {
  for (const row of memoryStore.values()) {
    if (row.identifier === key || row.email.toLowerCase() === key.toLowerCase()) {
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
    // Gagal koneksi DB, baca dari memori agar tidak crash
    return findInMemory(value);
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
    for (const row of memoryStore.values()) {
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
  try {
    const [result] = await getHandle()
      .insert(users)
      .values({
        name: input.name,
        identifier: input.identifier,
        email: input.email,
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
    // Duplikat identifier atau email diteruskan agar API bisa balas 409
    if (code === "ER_DUP_ENTRY" || code === "23505") {
      throw err;
    }
  }
  // Fallback memori saat DB belum siap
  if (findInMemory(input.identifier) || findInMemory(input.email)) {
    throw Object.assign(new Error("IDENTIFIER_EXISTS"), { code: "ER_DUP_ENTRY" });
  }
  const now = new Date();
  const row: UserRow = {
    id: memorySeq++,
    name: input.name,
    identifier: input.identifier,
    email: input.email,
    passwordHash: input.passwordHash,
    role: input.role,
    interests: input.interests,
    createdAt: now,
    updatedAt: now,
  };
  memoryStore.set(row.identifier, row);
  return row;
}

export function isDbReady(): boolean {
  return dbReady;
}

export function toSafeResponse(row: UserRow): SafeUser {
  return toSafeUser(row);
}
