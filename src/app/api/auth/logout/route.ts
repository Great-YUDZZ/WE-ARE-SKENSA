import { NextResponse } from "next/server";
import { clearSessionCookie } from "@/lib/auth";

export async function POST() {
  await clearSessionCookie();
  const res = NextResponse.json({ ok: true });
  res.cookies.delete("kertamarga_session");
  return res;
}

export async function DELETE() {
  await clearSessionCookie();
  const res = NextResponse.json({ ok: true });
  res.cookies.delete("kertamarga_session");
  return res;
}
