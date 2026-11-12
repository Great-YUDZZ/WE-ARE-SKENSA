import { NextRequest, NextResponse } from "next/server";
import {
  applyStandardApiHeaders,
  handleCorsPreflight,
  verifyRequestOrigin,
} from "@/lib/api-security";
import { clearSessionCookie } from "@/lib/auth";

export async function OPTIONS(req: NextRequest) {
  return handleCorsPreflight(req, "POST, DELETE, OPTIONS");
}

async function handleLogout(req: NextRequest) {
  const originErr = verifyRequestOrigin(req);
  if (originErr) return originErr;
  await clearSessionCookie();
  const res = NextResponse.json({ ok: true });
  res.cookies.delete("kertamarga_session");
  return applyStandardApiHeaders(res, req);
}

export async function POST(req: NextRequest) {
  return handleLogout(req);
}

export async function DELETE(req: NextRequest) {
  return handleLogout(req);
}
