import { NextRequest, NextResponse } from "next/server";
import { INSTITUTIONS_CATALOG, estimateDistanceKm } from "@/data/catalog";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const program = searchParams.get("program") || "";
  const kabupaten = searchParams.get("kabupaten") || "Kota Denpasar";
  const level = searchParams.get("level") || "all";

  let filtered = [...INSTITUTIONS_CATALOG];

  if (program) {
    const pLower = program.toLowerCase();
    filtered = filtered.filter((inst) =>
      inst.programName.toLowerCase().includes(pLower)
    );
  }

  if (level !== "all") {
    filtered = filtered.filter((inst) => inst.level === level);
  }

  const withDistance = filtered.map((inst) => ({
    ...inst,
    estimatedDistanceKm: estimateDistanceKm(kabupaten, inst.kabupaten),
  })).sort((a, b) => a.estimatedDistanceKm - b.estimatedDistanceKm);

  return NextResponse.json({
    total: withDistance.length,
    userKabupaten: kabupaten,
    institutions: withDistance,
  });
}
