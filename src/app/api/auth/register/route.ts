import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createUser, findUserByLogin, isDbReady, toSafeResponse } from "@/lib/db";
import {
  ACCOUNT_VAULT_COOKIE,
  buildUpdatedVaultToken,
  hashPassword,
  hydrateVaultUsers,
  resolveVerifiedRole,
  SESSION_COOKIE,
  signSession,
  validatePasswordStrength,
  VAULT_MAX_AGE_SECONDS,
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

const registerSchema = z
  .object({
    name: z.string().trim().min(2, "Nama minimal 2 karakter").max(120),
    identifier: z.string().trim().max(80).optional().default(""),
    email: z.string().trim().email("Format email tidak valid").max(160),
    password: z.string().min(8, "Kata sandi minimal 8 karakter").max(128),
    passwordConfirm: z
      .string()
      .min(8, "Konfirmasi kata sandi minimal 8 karakter")
      .max(128),
    role: z.enum(["siswa", "guru"]).optional().default("siswa"),
    interests: z.array(z.string().trim().min(1).max(80)).max(12).default([]),
    agreed: z
      .boolean()
      .refine((v) => v === true, "Wajib menyetujui kebijakan privasi minim data"),
    vaultToken: z.string().max(16384).optional(),
  })
  .refine((v) => v.password === v.passwordConfirm, {
    message: "Konfirmasi kata sandi tidak sama",
    path: ["passwordConfirm"],
  });

export async function OPTIONS(req: NextRequest) {
  return handleCorsPreflight(req, "POST, OPTIONS");
}

export async function POST(req: NextRequest) {
  const originErr = verifyRequestOrigin(req);
  if (originErr) return originErr;

  const ip = getClientIp(req);
  const rl = checkSlidingRateLimit(`register:${ip}`, 10, 60_000);
  if (rl.limited) {
    return buildRateLimitResponse(
      req,
      10,
      rl.retryAfterSeconds,
      "Terlalu banyak percobaan pendaftaran, silakan coba lagi sebentar lagi."
    );
  }

  const bodyResult = await readBoundedJsonBody(req, 8192);
  if (!bodyResult.ok) {
    return applyStandardApiHeaders(
      NextResponse.json({ error: bodyResult.error }, { status: bodyResult.status }),
      req
    );
  }

  const parsed = registerSchema.safeParse(bodyResult.data);
  if (!parsed.success) {
    return applyStandardApiHeaders(
      NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Data tidak valid" },
        { status: 400 }
      ),
      req
    );
  }

  const data = parsed.data;

  const pwCheck = validatePasswordStrength(data.password);
  if (!pwCheck.valid) {
    return applyStandardApiHeaders(
      NextResponse.json(
        { error: pwCheck.error || "Kata sandi belum memenuhi syarat keamanan." },
        { status: 400 }
      ),
      req
    );
  }

  const email = data.email.toLowerCase();
  const resolvedIdentifier =
    data.identifier.length >= 4 ? data.identifier : email;

  // Verifikasi peran di sisi server: tolak klaim role "guru" tanpa NIP 18 digit + email institusi resmi
  const roleCheck = resolveVerifiedRole({
    requestedRole: data.role,
    identifier: resolvedIdentifier,
    email,
  });
  if (!roleCheck.allowed) {
    return applyStandardApiHeaders(
      NextResponse.json(
        { error: roleCheck.error || "Peran Guru BK memerlukan verifikasi resmi." },
        { status: 403 }
      ),
      req
    );
  }

  // Sinkronkan akun yang tersimpan di vault cookie/token ke instance serverless aktif
  const incomingVaultToken =
    data.vaultToken || req.headers.get("x-kertamarga-vault") || undefined;
  await hydrateVaultUsers(incomingVaultToken);

  // Gunakan pesan duplikat seragam untuk mencegah enumerasi email/identifier
  const existingByEmail = await findUserByLogin(email);
  const existingByIdentifier =
    resolvedIdentifier !== email
      ? await findUserByLogin(resolvedIdentifier)
      : null;

  if (existingByEmail || existingByIdentifier) {
    return applyStandardApiHeaders(
      NextResponse.json(
        {
          error:
            "Pendaftaran tidak dapat diproses karena identitas atau email sudah terdaftar.",
        },
        { status: 409 }
      ),
      req
    );
  }

  const passwordHash = await hashPassword(data.password);

  try {
    const user = await createUser({
      name: data.name,
      identifier: resolvedIdentifier,
      email,
      passwordHash,
      role: roleCheck.role,
      interests: data.interests,
    });
    const token = await signSession(user.id, user.role, user);
    const vaultToken = await buildUpdatedVaultToken(user, incomingVaultToken);
    const res = NextResponse.json(
      {
        user: toSafeResponse(user),
        storage: isDbReady() ? "mysql" : "file-storage",
        vaultToken,
      },
      { status: 201 }
    );
    res.cookies.set(SESSION_COOKIE, token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });
    res.cookies.set(ACCOUNT_VAULT_COOKIE, vaultToken, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: VAULT_MAX_AGE_SECONDS,
    });
    return applyStandardApiHeaders(res, req);
  } catch (err) {
    const code = (err as { code?: string })?.code;
    const msg = (err as Error)?.message ?? "";
    if (code === "ER_DUP_ENTRY" || msg === "IDENTIFIER_EXISTS") {
      return applyStandardApiHeaders(
        NextResponse.json(
          {
            error:
              "Pendaftaran tidak dapat diproses karena identitas atau email sudah terdaftar.",
          },
          { status: 409 }
        ),
        req
      );
    }
    return applyStandardApiHeaders(
      NextResponse.json(
        { error: "Gagal menyimpan akun, coba lagi" },
        { status: 500 }
      ),
      req
    );
  }
}
