import { NextRequest, NextResponse } from "next/server";
import {
  applyStandardApiHeaders,
  buildRateLimitResponse,
  checkSlidingRateLimit,
  getClientIp,
  handleCorsPreflight,
  readBoundedJsonBody,
  verifyRequestOrigin,
} from "@/lib/api-security";
import { analyzeAssessment, UserAssessmentInput } from "@/lib/scoring";

export async function OPTIONS(req: NextRequest) {
  return handleCorsPreflight(req, "POST, OPTIONS");
}

export async function POST(request: NextRequest) {
  const originErr = verifyRequestOrigin(request);
  if (originErr) return originErr;

  const ip = getClientIp(request);
  const rateLimit = checkSlidingRateLimit(`assessment:${ip}`, 30, 60_000);
  if (!rateLimit.allowed) {
    return buildRateLimitResponse(
      request,
      rateLimit.limit,
      rateLimit.retryAfterSeconds
    );
  }

  const parsedBody = await readBoundedJsonBody<Record<string, unknown>>(request, 16_384);
  if (!parsedBody.ok) {
    return applyStandardApiHeaders(
      NextResponse.json({ error: parsedBody.error }, { status: parsedBody.status }),
      request
    );
  }

  try {
    const body = parsedBody.data;

    // Input sanitization & validation
    const currentEducation =
      typeof body.currentEducation === "string"
        ? (body.currentEducation as UserAssessmentInput["currentEducation"])
        : "SMP";
    const homeKabupaten =
      typeof body.homeKabupaten === "string"
        ? body.homeKabupaten.slice(0, 60)
        : "Kota Denpasar";
    const rawCoords = body.homeCoords as { lat?: unknown; lng?: unknown } | undefined;
    const homeCoords =
      rawCoords &&
      typeof rawCoords === "object" &&
      typeof rawCoords.lat === "number" &&
      typeof rawCoords.lng === "number" &&
      Number.isFinite(rawCoords.lat) &&
      Number.isFinite(rawCoords.lng) &&
      rawCoords.lat >= -90 &&
      rawCoords.lat <= 90 &&
      rawCoords.lng >= -180 &&
      rawCoords.lng <= 180
        ? { lat: rawCoords.lat, lng: rawCoords.lng }
        : undefined;
    const selectedAnswers =
      body.selectedAnswers && typeof body.selectedAnswers === "object" && !Array.isArray(body.selectedAnswers)
        ? (body.selectedAnswers as Record<string, string>)
        : {};
    const openEndedReflection =
      typeof body.openEndedReflection === "string"
        ? body.openEndedReflection.slice(0, 500)
        : "";
    const weights =
      body.weights && typeof body.weights === "object" && !Array.isArray(body.weights)
        ? (body.weights as Partial<UserAssessmentInput["weights"]>)
        : {};

    const assessmentInput: UserAssessmentInput = {
      currentEducation,
      homeKabupaten,
      homeCoords,
      selectedAnswers,
      openEndedReflection,
      weights,
    };

    const analysis = analyzeAssessment(assessmentInput);

    return applyStandardApiHeaders(NextResponse.json(analysis), request);
  } catch (error) {
    return applyStandardApiHeaders(
      NextResponse.json(
        {
          error: "Terjadi kendala saat memproses kuesioner.",
          message: error instanceof Error ? error.message : "Invalid payload",
        },
        { status: 400 }
      ),
      request
    );
  }
}
