import { NextRequest, NextResponse } from "next/server";
import { applyStandardApiHeaders, handleCorsPreflight } from "@/lib/api-security";
import { getSessionUserId } from "@/lib/auth";
import { findUserById, toSafeResponse } from "@/lib/db";

export async function OPTIONS(req: NextRequest) {
  return handleCorsPreflight(req, "GET, OPTIONS");
}

export async function GET(req: NextRequest) {
  const userId = await getSessionUserId();
  if (!userId) {
    return applyStandardApiHeaders(
      NextResponse.json({ user: null }, { status: 401 }),
      req
    );
  }
  const user = await findUserById(userId);
  if (!user) {
    return applyStandardApiHeaders(
      NextResponse.json({ user: null }, { status: 401 }),
      req
    );
  }
  return applyStandardApiHeaders(
    NextResponse.json({ user: toSafeResponse(user) }),
    req
  );
}
