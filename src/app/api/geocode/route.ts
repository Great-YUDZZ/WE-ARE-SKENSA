import { NextRequest, NextResponse } from "next/server";
import {
  BALI_KABUPATEN_COORDS,
  findNearestBaliKabupaten,
  resolveLocalAddressPoint,
} from "@/data/catalog";

interface NominatimItem {
  lat?: string;
  lon?: string;
  display_name?: string;
  name?: string;
}

function sanitizeAddressInput(raw: string): string {
  return raw
    .replace(/[\u0000-\u001F\u007F]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 160);
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const rawQuery = searchParams.get("q") || "";
  const rawKab = (searchParams.get("kabupaten") || "").trim();

  const cleanQ = sanitizeAddressInput(rawQuery);
  const safeKab = BALI_KABUPATEN_COORDS[rawKab] ? rawKab : undefined;

  if (cleanQ.length < 2) {
    return NextResponse.json(
      {
        ok: false,
        error: "Masukkan minimal 2 karakter alamat atau nama area di Bali.",
      },
      { status: 400 }
    );
  }

  const localFallback = resolveLocalAddressPoint(cleanQ, safeKab);
  const queryHasBali = cleanQ.toLowerCase().includes("bali");
  const searchQuery = [
    cleanQ,
    safeKab && !cleanQ.toLowerCase().includes(safeKab.replace(/^Kota\s+/i, "").toLowerCase())
      ? safeKab
      : null,
    queryHasBali ? null : "Bali",
    "Indonesia",
  ]
    .filter(Boolean)
    .join(", ");

  try {
    const nominatimUrl = new URL("https://nominatim.openstreetmap.org/search");
    nominatimUrl.searchParams.set("q", searchQuery);
    nominatimUrl.searchParams.set("format", "jsonv2");
    nominatimUrl.searchParams.set("limit", "1");
    nominatimUrl.searchParams.set("countrycodes", "id");
    nominatimUrl.searchParams.set("viewbox", "114.4,-8.9,115.8,-8.0");
    nominatimUrl.searchParams.set("bounded", "1");

    const res = await fetch(nominatimUrl.toString(), {
      headers: {
        "User-Agent": "KertaMargaBali/1.0 (edukasi-jalur-studi-bali)",
        "Accept-Language": "id,en",
      },
      signal: AbortSignal.timeout(4000),
      cache: "no-store",
    });

    if (res.ok) {
      const items = (await res.json()) as NominatimItem[];
      const top = Array.isArray(items) ? items[0] : undefined;
      const lat = top?.lat ? Number(top.lat) : Number.NaN;
      const lng = top?.lon ? Number(top.lon) : Number.NaN;

      if (
        Number.isFinite(lat) &&
        Number.isFinite(lng) &&
        lat >= -9.0 &&
        lat <= -7.9 &&
        lng >= 114.3 &&
        lng <= 115.9
      ) {
        const nearest = findNearestBaliKabupaten(lat, lng);
        const displayLabel = top?.name?.trim() || cleanQ;
        return NextResponse.json(
          {
            ok: true,
            source: "nominatim",
            coords: { lat, lng },
            nearestKabupaten: nearest.kabupaten,
            matchedLabel: displayLabel,
          },
          { status: 200 }
        );
      }
    }
  } catch {
    // Abaikan kegagalan jaringan eksternal dan gunakan pencocokan lokal Bali
  }

  return NextResponse.json(
    {
      ok: true,
      source: localFallback.matched ? "local_area" : "kabupaten_fallback",
      coords: localFallback.coords,
      nearestKabupaten: localFallback.kabupaten,
      matchedLabel: localFallback.matchedKeyword || localFallback.kabupaten,
    },
    { status: 200 }
  );
}
