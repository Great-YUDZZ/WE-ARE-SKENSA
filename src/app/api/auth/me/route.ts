import { NextResponse } from "next/server";
import { getSessionUserId } from "@/lib/auth";
import { findUserById, toSafeResponse } from "@/lib/db";

export async function GET() {
  const userId = await getSessionUserId();
  if (!userId) {
    return NextResponse.json({ user: null }, { status: 401 });
  }
  const user = await findUserById(userId);
  if (!user) {
    return NextResponse.json({ user: null }, { status: 401 });
  }
  return NextResponse.json({ user: toSafeResponse(user) });
}
