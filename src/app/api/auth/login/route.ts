import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { findUserByLogin, isDbReady, toSafeResponse } from "@/lib/db";
import {
  checkLoginLockout,
  clearFailedLogin,
  recordFailedLogin,
  SESSION_COOKIE,
  signSession,
  verifyPasswordConstantTime,
} from "@/lib/auth";
import {
  applyStandardApiHeaders,
  buildRateLimitResponse,
  checkSlidingRateLimit,
  getClientIp,
  handleCorsPreflight,
  readBoundedJsonBody,
  verifyRequestOrigin,
} from "@/lib/api-security";

const loginSchema = z.object({
  login: z.string().trim().min(3, "Identifier minimal 3 karakter").max(160),
  password: z.string().min(6, "Password minimal 6 karakter").max(128),
  role: z.enum(["siswa", "guru"]).optional(),
});

export async function OPTIONS(req: NextRequest) {
  return handleCorsPreflight(req, "POST, OPTIONS");
}

export async function POST(req: NextRequest) {
  const originErr = verifyRequestOrigin(req);
  if (originErr) return originErr;

  const ip = getClientIp(req);
  const rl = checkSlidingRateLimit(`login:${ip}`, 15, 60_000);
  if (rl.limited) {
    return buildRateLimitResponse(
      req,
      15,
      rl.retryAfterSeconds,
      "Terlalu banyak percobaan masuk, coba lagi sebentar lagi."
    );
  }

  const bodyResult = await readBoundedJsonBody(req, 4096);
  if (!bodyResult.ok) {
    return applyStandardApiHeaders(
      NextResponse.json({ error: bodyResult.error }, { status: bodyResult.status }),
      req
    );
  }

  const parsed = loginSchema.safeParse(bodyResult.data);
  if (!parsed.success) {
    return applyStandardApiHeaders(
      NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Data tidak valid" },
        { status: 400 }
      ),
      req
    );
  }

  const loginKey = parsed.data.login.trim();

  // Periksa status lockout akun/IP sebelum menyentuh database atau bcrypt
  const lockStatus = checkLoginLockout(ip, loginKey);
  if (lockStatus.locked) {
    return buildRateLimitResponse(
      req,
      5,
      lockStatus.retryAfterSeconds,
      "Akun dikunci sementara karena terlalu banyak percobaan kata sandi yang salah. Coba lagi nanti."
    );
  }

  const user = await findUserByLogin(loginKey);

  // Selalu jalankan verifikasi bcrypt waktu konstan untuk mencegah enumerasi akun berbasis waktu
  const ok = await verifyPasswordConstantTime(
    parsed.data.password,
    user?.passwordHash
  );

  if (!user || !ok) {
    const failOutcome = recordFailedLogin(ip, loginKey);
    if (failOutcome.locked) {
      return buildRateLimitResponse(
        req,
        5,
        failOutcome.retryAfterSeconds,
        "Akun dikunci sementara karena terlalu banyak percobaan kata sandi yang salah. Coba lagi nanti."
      );
    }
    return applyStandardApiHeaders(
      NextResponse.json(
        { error: "Identifier atau password salah" },
        { status: 401 }
      ),
      req
    );
  }

  clearFailedLogin(ip, loginKey);

  // Peran akun selalu diambil dari data server, mengabaikan klaim role dari klien
  const token = await signSession(user.id, user.role);
  const res = NextResponse.json({
    user: toSafeResponse(user),
    storage: isDbReady() ? "mysql" : "file-storage",
  });
  res.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  return applyStandardApiHeaders(res, req);
}
