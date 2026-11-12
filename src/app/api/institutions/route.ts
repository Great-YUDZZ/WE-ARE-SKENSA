import { NextRequest, NextResponse } from "next/server";
import {
  INSTITUTIONS_CATALOG,
  estimateDistanceFromOrigin,
  findNearestBaliKabupaten,
} from "@/data/catalog";
import {
  BALI_EDUCATION_DIRECTORY,
  buildGoogleMapsSearchUrl,
  getBaliDirectoryStats,
} from "@/data/bali-institutions";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const program = searchParams.get("program") || "";
  const kabupaten = searchParams.get("kabupaten") || "Kota Denpasar";
  const rawLat = searchParams.get("lat");
  const rawLng = searchParams.get("lng");
  const parsedLat = rawLat !== null ? Number(rawLat) : Number.NaN;
  const parsedLng = rawLng !== null ? Number(rawLng) : Number.NaN;
  const hasValidCoords =
    Number.isFinite(parsedLat) &&
    Number.isFinite(parsedLng) &&
    parsedLat >= -90 &&
    parsedLat <= 90 &&
    parsedLng >= -180 &&
    parsedLng <= 180;
  const distanceOrigin = hasValidCoords
    ? { lat: parsedLat, lng: parsedLng }
    : kabupaten;
  const effectiveKabupaten = hasValidCoords
    ? findNearestBaliKabupaten(parsedLat, parsedLng).kabupaten
    : kabupaten;
  const level = searchParams.get("level") || "all";
  const category = searchParams.get("category");
  const fieldId = searchParams.get("field") || "";
  const statusFilter = searchParams.get("status") || "all";
  const query = searchParams.get("q") || "";

  if (category) {
    let entries = [...BALI_EDUCATION_DIRECTORY];

    if (category !== "all") {
      entries = entries.filter((item) => item.category === category);
    }

    if (fieldId && category !== "sma") {
      entries = entries.filter((item) => item.matchedFields.includes(fieldId));
    }

    if (statusFilter !== "all") {
      const target = statusFilter.toLowerCase();
      entries = entries.filter((item) =>
        target === "negeri"
          ? item.status.toLowerCase().includes("negeri")
          : item.status.toLowerCase().includes("swasta")
      );
    }

    const searchKeyword = (query || program).trim().toLowerCase();
    if (searchKeyword) {
      entries = entries.filter(
        (item) =>
          item.name.toLowerCase().includes(searchKeyword) ||
          item.address.toLowerCase().includes(searchKeyword) ||
          item.kabupaten.toLowerCase().includes(searchKeyword) ||
          item.programs.some((p) => p.toLowerCase().includes(searchKeyword))
      );
    }

    const enriched = entries
      .map((item) => ({
        ...item,
        estimatedDistanceKm: estimateDistanceFromOrigin(
          distanceOrigin,
          item.kabupaten,
          item.address
        ),
        mapsUrl: buildGoogleMapsSearchUrl(item.name, item.address),
      }))
      .sort(
        (a, b) =>
          a.estimatedDistanceKm - b.estimatedDistanceKm ||
          a.name.localeCompare(b.name, "id")
      );

    return NextResponse.json({
      total: enriched.length,
      userKabupaten: effectiveKabupaten,
      category,
      directoryStats: getBaliDirectoryStats(),
      institutions: enriched,
    });
  }

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

  const withDistance = filtered
    .map((inst) => ({
      ...inst,
      estimatedDistanceKm: estimateDistanceFromOrigin(
        distanceOrigin,
        inst.kabupaten,
        inst.district
      ),
    }))
    .sort((a, b) => a.estimatedDistanceKm - b.estimatedDistanceKm);

  return NextResponse.json({
    total: withDistance.length,
    userKabupaten: effectiveKabupaten,
    directoryStats: getBaliDirectoryStats(),
    institutions: withDistance,
  });
}
