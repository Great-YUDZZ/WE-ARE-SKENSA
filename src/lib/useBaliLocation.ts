"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  BALI_KABUPATEN_COORDS,
  UserLocationOrigin,
  findNearestBaliKabupaten,
  resolveLocalAddressPoint,
} from "@/data/catalog";

const STORAGE_KEY = "kertamarga_user_location";

function normalizeManualKab(kab?: string): string {
  if (kab && BALI_KABUPATEN_COORDS[kab]) return kab;
  return "Kota Denpasar";
}

function readStoredOrigin(): UserLocationOrigin | null {
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<UserLocationOrigin>;
    if (!parsed || typeof parsed.kabupaten !== "string") return null;
    if (!BALI_KABUPATEN_COORDS[parsed.kabupaten]) return null;
    if (
      parsed.source !== "manual" &&
      parsed.source !== "address" &&
      parsed.source !== "gps" &&
      parsed.source !== "ip"
    ) {
      return null;
    }
    return {
      kabupaten: parsed.kabupaten,
      source: parsed.source,
      coords:
        parsed.coords &&
        typeof parsed.coords.lat === "number" &&
        typeof parsed.coords.lng === "number"
          ? parsed.coords
          : undefined,
      areaLabel: typeof parsed.areaLabel === "string" ? parsed.areaLabel : undefined,
      addressQuery:
        typeof parsed.addressQuery === "string" ? parsed.addressQuery : undefined,
      isOutsideBali: Boolean(parsed.isOutsideBali),
    };
  } catch {
    return null;
  }
}

function writeStoredOrigin(origin: UserLocationOrigin) {
  try {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(origin));
  } catch {
    // Abaikan jika penyimpanan sesi dibatasi browser
  }
}

function shouldQueryRemoteGeocode(rawAddress: string, localMatched: boolean): boolean {
  if (!localMatched) return true;
  const lower = rawAddress.toLowerCase();
  const hasStreetMarker = /\b(jl|jalan|gg|gang|no|nomor|banjar|br|km|perum|blok|komplek)\b|\d+/.test(
    lower
  );
  const wordCount = lower.split(/\s+/).filter(Boolean).length;
  return hasStreetMarker || wordCount >= 3;
}

export interface DetectLocationOutcome {
  ok: boolean;
  origin: UserLocationOrigin;
  message: string;
}

export function useBaliLocation(
  initialKabupaten?: string,
  _options?: { skipAutoDetect?: boolean }
) {
  const safeInitial = normalizeManualKab(initialKabupaten);
  const [origin, setOrigin] = useState<UserLocationOrigin>({
    kabupaten: safeInitial,
    source: "manual",
  });
  const [isDetecting, setIsDetecting] = useState(false);
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [locationNote, setLocationNote] = useState<string | null>(null);
  const originRef = useRef(origin);
  originRef.current = origin;

  const setManualKabupaten = useCallback((kabupaten: string) => {
    const normalized = normalizeManualKab(kabupaten);
    const next: UserLocationOrigin = {
      kabupaten: normalized,
      source: "manual",
      coords: undefined,
      areaLabel: undefined,
      addressQuery: undefined,
      isOutsideBali: false,
    };
    setOrigin(next);
    setLocationNote(null);
    writeStoredOrigin(next);
    return next;
  }, []);

  const setManualAddress = useCallback(
    async (
      rawAddress: string,
      preferredKabupaten?: string
    ): Promise<DetectLocationOutcome> => {
      const clean = rawAddress.replace(/\s+/g, " ").trim().slice(0, 160);
      const targetKab = normalizeManualKab(
        preferredKabupaten || originRef.current.kabupaten
      );

      if (!clean) {
        const next = setManualKabupaten("Kota Denpasar");
        return {
          ok: true,
          origin: next,
          message: "Alamat rumah dihapus; sementara memakai acuan default Kota Denpasar.",
        };
      }

      const local = resolveLocalAddressPoint(clean, preferredKabupaten);

      if (!shouldQueryRemoteGeocode(clean, local.matched) && local.matched) {
        const areaText = `${local.matchedKeyword || clean} (${local.kabupaten})`;
        const next: UserLocationOrigin = {
          kabupaten: local.kabupaten,
          source: "address",
          coords: local.coords,
          areaLabel: areaText,
          addressQuery: clean,
          isOutsideBali: false,
        };
        setOrigin(next);
        writeStoredOrigin(next);
        const msg = `Jarak dihitung dari alamat Anda: ${areaText}.`;
        setLocationNote(msg);
        return { ok: true, origin: next, message: msg };
      }

      setIsGeocoding(true);
      setLocationNote("Mencari titik koordinat alamat rumah Anda di Bali...");

      try {
        const params = new URLSearchParams({ q: clean });
        if (preferredKabupaten && BALI_KABUPATEN_COORDS[preferredKabupaten]) {
          params.set("kabupaten", preferredKabupaten);
        }

        const res = await fetch(`/api/geocode?${params.toString()}`, {
          cache: "no-store",
        });

        if (res.ok) {
          const data = await res.json();
          if (data?.ok && data.coords) {
            const resolvedKab = normalizeManualKab(data.nearestKabupaten || targetKab);
            const isExactOrArea =
              data.source === "nominatim" || data.source === "local_area";

            const areaText =
              data.source === "nominatim"
                ? `${clean} (${resolvedKab})`
                : data.source === "local_area"
                  ? `${data.matchedLabel || clean} (${resolvedKab})`
                  : resolvedKab;

            const next: UserLocationOrigin = {
              kabupaten: resolvedKab,
              source: isExactOrArea ? "address" : "manual",
              coords: isExactOrArea
                ? { lat: Number(data.coords.lat), lng: Number(data.coords.lng) }
                : undefined,
              areaLabel: isExactOrArea ? areaText : undefined,
              addressQuery: isExactOrArea ? clean : undefined,
              isOutsideBali: false,
            };
            setOrigin(next);
            writeStoredOrigin(next);

            const msg = isExactOrArea
              ? `Jarak dihitung dari alamat: ${areaText}.`
              : `Alamat spesifik tidak ditemukan; jarak dihitung dari pusat ${resolvedKab}.`;
            setLocationNote(msg);
            return { ok: isExactOrArea, origin: next, message: msg };
          }
        }
      } catch {
        // Fallback ke hasil pencocokan area lokal di bawah
      } finally {
        setIsGeocoding(false);
      }

      if (local.matched) {
        const areaText = `${local.matchedKeyword || clean} (${local.kabupaten})`;
        const next: UserLocationOrigin = {
          kabupaten: local.kabupaten,
          source: "address",
          coords: local.coords,
          areaLabel: areaText,
          addressQuery: clean,
          isOutsideBali: false,
        };
        setOrigin(next);
        writeStoredOrigin(next);
        const msg = `Koneksi peta offline, memakai area terdekat: ${areaText}.`;
        setLocationNote(msg);
        return { ok: true, origin: next, message: msg };
      }

      const fallbackOrigin = setManualKabupaten(local.kabupaten);
      const fallbackMsg = `Alamat tidak ditemukan; memakai pusat ${fallbackOrigin.kabupaten}.`;
      setLocationNote(fallbackMsg);
      return { ok: false, origin: fallbackOrigin, message: fallbackMsg };
    },
    [setManualKabupaten]
  );

  const detectLocation = useCallback(async (): Promise<DetectLocationOutcome> => {
    setIsDetecting(true);
    setLocationNote("Meminta koordinat GPS perangkat...");

    try {
      if (typeof window !== "undefined" && "geolocation" in navigator) {
        const position = await new Promise<GeolocationPosition>(
          (resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, {
              enableHighAccuracy: true,
              timeout: 7000,
              maximumAge: 0,
            });
          }
        );

        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        const nearest = findNearestBaliKabupaten(lat, lng);

        const next: UserLocationOrigin = {
          kabupaten: nearest.kabupaten,
          source: "gps",
          coords: { lat, lng },
          areaLabel: undefined,
          addressQuery: undefined,
          isOutsideBali: nearest.isOutsideBali,
        };
        setOrigin(next);
        writeStoredOrigin(next);

        const msg = next.isOutsideBali
          ? "GPS aktif di luar Bali. Jarak dihitung dari koordinat perangkat Anda."
          : `GPS aktif (dekat ${next.kabupaten}). Jika laptop tanpa GPS, ketik alamat manual di atas agar presisi.`;
        setLocationNote(msg);
        return { ok: true, origin: next, message: msg };
      }

      const noGpsMsg =
        "Perangkat tidak mendukung GPS. Ketik alamat atau kelurahan Anda secara manual.";
      setLocationNote(noGpsMsg);
      return { ok: false, origin: originRef.current, message: noGpsMsg };
    } catch {
      const deniedMsg =
        "Izin GPS ditolak atau tidak tersedia. Ketik alamat/kelurahan Anda secara manual agar jarak akurat.";
      setLocationNote(deniedMsg);
      return { ok: false, origin: originRef.current, message: deniedMsg };
    } finally {
      setIsDetecting(false);
    }
  }, []);

  useEffect(() => {
    const stored = readStoredOrigin();
    if (stored) {
      const curr = originRef.current;
      const sameOrigin =
        curr.kabupaten === stored.kabupaten &&
        curr.source === stored.source &&
        curr.addressQuery === stored.addressQuery &&
        curr.coords?.lat === stored.coords?.lat &&
        curr.coords?.lng === stored.coords?.lng;
      if (!sameOrigin) {
        setOrigin(stored);
      }
      return;
    }

    if (initialKabupaten && BALI_KABUPATEN_COORDS[initialKabupaten]) {
      const curr = originRef.current;
      if (curr.kabupaten !== initialKabupaten || curr.source !== "manual") {
        setOrigin({ kabupaten: initialKabupaten, source: "manual" });
      }
    }
  }, [initialKabupaten]);

  return {
    origin,
    isDetecting,
    isGeocoding,
    locationNote,
    setManualKabupaten,
    setManualAddress,
    detectLocation,
  };
}
