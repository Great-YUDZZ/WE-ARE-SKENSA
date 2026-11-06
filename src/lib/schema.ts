import { mysqlTable, bigint, varchar, timestamp, json, mysqlEnum } from "drizzle-orm/mysql-core";

// Skema tabel users untuk auth KertaMarga Bali di MySQL MariaDB
// identifier dipakai untuk login: NISN untuk siswa, NIP atau email untuk guru
export const users = mysqlTable("users", {
  id: bigint("id", { mode: "number" }).autoincrement().primaryKey(),
  name: varchar("name", { length: 120 }).notNull(),
  identifier: varchar("identifier", { length: 80 }).notNull().unique(),
  email: varchar("email", { length: 160 }).notNull().unique(),
  passwordHash: varchar("password_hash", { length: 255 }).notNull(),
  role: mysqlEnum("role", ["siswa", "guru"]).notNull().default("siswa"),
  interests: json("interests").$type<string[]>(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow().onUpdateNow(),
});

export type UserRow = typeof users.$inferSelect;
export type NewUserRow = typeof users.$inferInsert;

// Data aman untuk dikirim ke client tanpa password hash
export type SafeUser = {
  id: number;
  name: string;
  identifier: string;
  email: string;
  role: "siswa" | "guru";
  interests: string[];
  createdAt: Date;
};

export function toSafeUser(row: UserRow): SafeUser {
  return {
    id: row.id,
    name: row.name,
    identifier: row.identifier,
    email: row.email,
    role: row.role,
    interests: row.interests ?? [],
    createdAt: row.createdAt,
  };
}
