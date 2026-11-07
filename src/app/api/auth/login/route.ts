import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { findUserByLogin, isDbReady, toSafeResponse } from "@/lib/db";
import { verifyPassword, signSession, setSessionCookie, isRateLimited } from "@/lib/auth";

const loginSchema = z.object({
  login: z.string().trim().min(3, "Identifier minimal 3 karakter").max(160),
  password: z.string().min(6, "Password minimal 6 karakter").max(128),
  role: z.enum(["siswa", "guru"]).optional(),
});

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") ?? "local";
  if (isRateLimited(`login:${ip}`)) {
    return NextResponse.json({ error: "Terlalu banyak percobaan, coba lagi sebentar lagi" }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Body JSON tidak valid" }, { status: 400 });
  }

  const parsed = loginSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Data tidak valid" },
      { status: 400 }
    );
  }

  const user = await findUserByLogin(parsed.data.login);
  // Pesan error disamarkan agar tidak membocorkan akun mana yang ada
  if (!user) {
    return NextResponse.json({ error: "Identifier atau password salah" }, { status: 401 });
  }
  const ok = await verifyPassword(parsed.data.password, user.passwordHash);
  if (!ok) {
    return NextResponse.json({ error: "Identifier atau password salah" }, { status: 401 });
  }

  const token = await signSession(user.id);
  await setSessionCookie(token);
  const res = NextResponse.json({
    user: toSafeResponse(user),
    storage: isDbReady() ? "mysql" : "file-storage",
  });
  res.cookies.set("kertamarga_session", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  return res;
}
