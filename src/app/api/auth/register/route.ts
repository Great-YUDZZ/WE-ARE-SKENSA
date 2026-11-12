import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createUser, findUserByLogin, isDbReady, toSafeResponse } from "@/lib/db";
import { hashPassword, signSession, setSessionCookie, isRateLimited } from "@/lib/auth";

// Validasi register di server agar aman dari input berbahaya
const registerSchema = z.object({
  name: z.string().trim().min(2, "Nama minimal 2 karakter").max(120),
  identifier: z.string().trim().max(80).optional().default(""),
  email: z.string().trim().email("Format email tidak valid").max(160),
  password: z.string().min(8, "Kata sandi minimal 8 karakter").max(128),
  passwordConfirm: z.string().min(8, "Konfirmasi kata sandi minimal 8 karakter").max(128),
  role: z.enum(["siswa", "guru"]).default("siswa"),
  interests: z.array(z.string().trim().min(1).max(80)).max(12).default([]),
  agreed: z.boolean().refine((v) => v === true, "Wajib menyetujui kebijakan privasi minim data"),
}).refine((v) => v.password === v.passwordConfirm, {
  message: "Konfirmasi kata sandi tidak sama",
  path: ["passwordConfirm"],
});

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") ?? "local";
  if (isRateLimited(`register:${ip}`)) {
    return NextResponse.json({ error: "Terlalu banyak percobaan, coba lagi sebentar lagi" }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Body JSON tidak valid" }, { status: 400 });
  }

  const parsed = registerSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Data tidak valid" },
      { status: 400 }
    );
  }

  const data = parsed.data;
  const email = data.email.toLowerCase();
  const resolvedIdentifier = data.identifier.length >= 4 ? data.identifier : email;

  // Cek duplikat email atau identifier lebih awal untuk pesan yang jelas
  const existingByEmail = await findUserByLogin(email);
  if (existingByEmail) {
    return NextResponse.json({ error: "Email sudah terdaftar" }, { status: 409 });
  }
  if (resolvedIdentifier !== email) {
    const existingByIdentifier = await findUserByLogin(resolvedIdentifier);
    if (existingByIdentifier) {
      return NextResponse.json({ error: "Identifier sudah dipakai, coba email lain" }, { status: 409 });
    }
  }

  const passwordHash = await hashPassword(data.password);

  try {
    const user = await createUser({
      name: data.name,
      identifier: resolvedIdentifier,
      email,
      passwordHash,
      role: data.role,
      interests: data.interests,
    });
    const token = await signSession(user.id);
    await setSessionCookie(token);
    const res = NextResponse.json(
      { user: toSafeResponse(user), storage: isDbReady() ? "mysql" : "file-storage" },
      { status: 201 }
    );
    res.cookies.set("kertamarga_session", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });
    return res;
  } catch (err) {
    const code = (err as { code?: string })?.code;
    const msg = (err as Error)?.message ?? "";
    if (code === "ER_DUP_ENTRY" || msg === "IDENTIFIER_EXISTS") {
      return NextResponse.json({ error: "Identifier atau email sudah terdaftar" }, { status: 409 });
    }
    return NextResponse.json({ error: "Gagal menyimpan akun, coba lagi" }, { status: 500 });
  }
}
