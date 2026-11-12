import { NextRequest, NextResponse } from "next/server";
import { findNearestBaliKabupaten } from "@/data/catalog";

function isPrivateOrLoopbackIp(ip: string): boolean {
  const clean = ip.replace(/^::ffff:/, "").trim();
  if (!clean) return true;
  if (clean === "127.0.0.1" || clean === "::1" || clean === "localhost") {
    return true;
  }
  if (clean.startsWith("10.") || clean.startsWith("192.168.")) return true;
  if (/^172\.(1[6-9]|2\d|3[0-1])\./.test(clean)) return true;
  return false;
}

function extractClientIp(request: NextRequest): string | null {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first && !isPrivateOrLoopbackIp(first)) return first;
  }
  const realIp = request.headers.get("x-real-ip")?.trim();
  if (realIp && !isPrivateOrLoopbackIp(realIp)) return realIp;
  return null;
}

export async function GET(request: NextRequest) {
  const clientIp = extractClientIp(request);
  const endpoint = clientIp
    ? `https://ipwho.is/${encodeURIComponent(clientIp)}`
    : "https://ipwho.is/";

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 3500);

  try {
    const res = await fetch(endpoint, {
      signal: controller.signal,
      headers: { Accept: "application/json" },
      cache: "no-store",
    });

    if (!res.ok) {
      return NextResponse.json({
        ok: false,
        fallbackKabupaten: "Kota Denpasar",
        reason: `Layanan IP mengembalikan status ${res.status}`,
      });
    }

    const data = await res.json();
    if (
      !data ||
      data.success === false ||
      typeof data.latitude !== "number" ||
      typeof data.longitude !== "number"
    ) {
      return NextResponse.json({
        ok: false,
        fallbackKabupaten: "Kota Denpasar",
        reason: "Koordinat IP tidak tersedia dari penyedia.",
      });
    }

    const nearest = findNearestBaliKabupaten(data.latitude, data.longitude);

    return NextResponse.json({
      ok: true,
      source: "ip" as const,
      coords: {
        lat: data.latitude,
        lng: data.longitude,
      },
      nearestKabupaten: nearest.kabupaten,
      distanceToCenterKm: nearest.distanceToCenterKm,
      isOutsideBali: nearest.isOutsideBali,
      city: typeof data.city === "string" ? data.city : "",
      region: typeof data.region === "string" ? data.region : "",
    });
  } catch {
    return NextResponse.json({
      ok: false,
      fallbackKabupaten: "Kota Denpasar",
      reason: "Koneksi IP geolokasi timeout atau tidak aktif.",
    });
  } finally {
    clearTimeout(timer);
  }
}
