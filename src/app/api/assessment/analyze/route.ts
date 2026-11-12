import { NextRequest, NextResponse } from "next/server";
import { analyzeAssessment, UserAssessmentInput } from "@/lib/scoring";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Input sanitization & validation
    const currentEducation = body.currentEducation || "SMP";
    const homeKabupaten = body.homeKabupaten || "Kota Denpasar";
    const rawCoords = body.homeCoords;
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
    const selectedAnswers = typeof body.selectedAnswers === "object" ? body.selectedAnswers : {};
    const openEndedReflection = typeof body.openEndedReflection === "string" ? body.openEndedReflection.slice(0, 500) : "";
    const weights = typeof body.weights === "object" ? body.weights : {};

    const assessmentInput: UserAssessmentInput = {
      currentEducation,
      homeKabupaten,
      homeCoords,
      selectedAnswers,
      openEndedReflection,
      weights,
    };

    const analysis = analyzeAssessment(assessmentInput);

    return NextResponse.json(analysis);
  } catch (error) {
    return NextResponse.json(
      {
        error: "Terjadi kendala saat memproses kuesioner.",
        message: error instanceof Error ? error.message : "Invalid payload",
      },
      { status: 400 }
    );
  }
}
