"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";
import Navbar from "@/components/Navbar";
import LocationOriginControl from "@/components/LocationOriginControl";
import { FieldGroup, PROGRAM_FIELDS } from "@/data/catalog";
import {
  BALI_EDUCATION_DIRECTORY,
  getBaliDirectoryStats,
} from "@/data/bali-institutions";
import { useBaliLocation } from "@/lib/useBaliLocation";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);
}

const GROUP_OPTIONS: {
  id: "all" | FieldGroup;
  label: string;
  accentBg: string;
}[] = [
  { id: "all", label: "Semua Bidang", accentBg: "bg-[#B8F348]" },
  { id: "teknologi", label: "Teknologi & Desain", accentBg: "bg-[#3B66FF] text-white" },
  { id: "manusia", label: "Manusia & Budaya", accentBg: "bg-[#FF5E4D] text-white" },
  { id: "alam", label: "Alam & Maritim", accentBg: "bg-[#1AD598]" },
  { id: "usaha", label: "Usaha & Pariwisata", accentBg: "bg-[#FFBE2E]" },
];

const GROUP_BADGE_MAP: Record<FieldGroup, { label: string; bg: string }> = {
  teknologi: { label: "Teknologi & Desain", bg: "bg-[#3B66FF] text-white" },
  manusia: { label: "Manusia & Budaya", bg: "bg-[#FF5E4D] text-white" },
  alam: { label: "Alam & Maritim", bg: "bg-[#1AD598] text-[#141413]" },
  usaha: { label: "Usaha & Pariwisata", bg: "bg-[#FFBE2E] text-[#141413]" },
};

const STORAGE_SAVED_KEY = "kertamarga_saved_fields";

export default function PetaBidangIndexPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const heroTitleRef = useRef<HTMLHeadingElement>(null);
  const contourRef = useRef<SVGSVGElement>(null);

  const [selectedGroup, setSelectedGroup] = useState<"all" | FieldGroup>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const {
    origin,
    isDetecting,
    isGeocoding,
    locationNote,
    setManualKabupaten,
    setManualAddress,
    detectLocation,
  } = useBaliLocation();
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [onlySaved, setOnlySaved] = useState(false);

  const directoryStats = useMemo(() => getBaliDirectoryStats(), []);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_SAVED_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          setSavedIds(parsed.filter((item): item is string => typeof item === "string"));
        }
      }
    } catch {
      // Abaikan jika penyimpanan lokal tidak tersedia
    }
  }, []);

  const countsPerField = useMemo(() => {
    const map: Record<string, { pt: number; smk: number }> = {};
    for (const field of PROGRAM_FIELDS) {
      map[field.id] = { pt: 0, smk: 0 };
    }
    for (const entity of BALI_EDUCATION_DIRECTORY) {
      for (const fieldId of entity.matchedFields) {
        if (!map[fieldId]) continue;
        if (entity.category === "perguruan-tinggi") map[fieldId].pt += 1;
        if (entity.category === "smk") map[fieldId].smk += 1;
      }
    }
    return map;
  }, []);

  const filteredFields = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return PROGRAM_FIELDS.filter((field) => {
      if (selectedGroup !== "all" && field.group !== selectedGroup) return false;
      if (onlySaved && !savedIds.includes(field.id)) return false;
      if (!q) return true;
      return (
        field.name.toLowerCase().includes(q) ||
        field.shortDesc.toLowerCase().includes(q) ||
        field.categoryName.toLowerCase().includes(q) ||
        field.careerPaths.some((c) => c.toLowerCase().includes(q))
      );
    });
  }, [onlySaved, savedIds, searchQuery, selectedGroup]);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      let splitInstance: SplitText | null = null;

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        if (heroTitleRef.current) {
          splitInstance = SplitText.create(heroTitleRef.current, {
            type: "words",
          });
          gsap.from(splitInstance.words, {
            y: 18,
            opacity: 0,
            duration: 0.55,
            stagger: 0.04,
            ease: "power3.out",
            clearProps: "transform,opacity",
          });
        }

        if (contourRef.current) {
          gsap.to(contourRef.current, {
            y: 28,
            ease: "none",
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top top",
              end: "450px top",
              scrub: 0.6,
            },
          });
        }

        const statEls = gsap.utils.toArray<HTMLElement>(".stat-count-num");
        statEls.forEach((el) => {
          const target = Number(el.dataset.target || "0");
          const counter = { val: 0 };
          gsap.to(counter, {
            val: target,
            duration: 0.75,
            ease: "power2.out",
            onUpdate: () => {
              el.textContent = String(Math.round(counter.val));
            },
            onComplete: () => {
              el.textContent = String(target);
            },
          });
        });

        const cards = gsap.utils.toArray<HTMLElement>(".field-index-card");
        if (cards.length > 0) {
          gsap.from(cards, {
            y: 20,
            opacity: 0,
            duration: 0.45,
            stagger: 0.05,
            ease: "power2.out",
            immediateRender: false,
            clearProps: "transform,opacity",
            scrollTrigger: {
              trigger: ".field-index-grid",
              start: "top 88%",
              once: true,
            },
          });
        }
      });

      return () => {
        splitInstance?.revert();
        mm.revert();
      };
    },
    { scope: containerRef }
  );

  return (
    <div
      ref={containerRef}
      className="min-h-screen flex flex-col neopop-canvas-subtle text-[#141413] selection:bg-[#B8F348] selection:text-[#141413]"
    >
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 pb-16 space-y-8 sm:space-y-10">
        {/* Hero Editorial Section */}
        <section className="relative overflow-hidden bg-white border-2 border-[#141413] rounded-3xl shadow-[6px_6px_0px_#141413] p-6 sm:p-10">
          {/* Subak Contour Accent */}
          <svg
            ref={contourRef}
            aria-hidden="true"
            viewBox="0 0 420 260"
            fill="none"
            className="pointer-events-none select-none absolute -right-12 -top-8 w-72 sm:w-96 opacity-15 text-[#141413]"
          >
            <path
              d="M24 210C92 140 164 176 238 112C304 54 358 76 410 24"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <path
              d="M12 162C88 94 156 134 226 70C292 12 348 34 404 -10"
              stroke="currentColor"
              strokeWidth="2"
              strokeDasharray="6 6"
            />
            <path
              d="M46 250C114 186 184 218 258 156C322 102 372 120 418 76"
              stroke="currentColor"
              strokeWidth="2"
            />
          </svg>

          <div className="relative z-10 space-y-6">
            <div className="flex flex-wrap items-center gap-3">
              <span className="px-3.5 py-1 rounded-xl bg-[#B8F348] border-2 border-[#141413] text-xs sm:text-sm font-bold text-[#141413]">
                Direktori Peta Bidang Bali
              </span>
              <span className="text-sm font-semibold text-[#52514E]">
                Terhubung ke {directoryStats.total} Sekolah &amp; Perguruan Tinggi se-Bali
              </span>
            </div>

            <div className="space-y-3">
              <h1
                ref={heroTitleRef}
                className="text-3xl sm:text-4xl lg:text-[2.75rem] font-display font-black text-[#141413] leading-[1.12] tracking-tight"
              >
                Jelajahi 11 Peta Bidang Studi &amp; Karier di Bali
              </h1>
              <p className="text-base text-[#52514E] leading-[1.65] max-w-[65ch]">
                Pelajari perbandingan jalur SMK, Vokasi Politeknik (D3/D4), dan Sarjana (S1) beserta daftar nyata sekolah dan perguruan tinggi di 9 kabupaten dan kota Bali.
              </p>
            </div>

            {/* 3 Stat Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-[#FAF7F2] border-2 border-[#141413]">
                <p className="text-2xl sm:text-3xl font-display font-black text-[#141413]">
                  <span
                    className="stat-count-num"
                    data-target={directoryStats.perguruanTinggi}
                  >
                    {directoryStats.perguruanTinggi}
                  </span>
                </p>
                <p className="text-sm font-semibold text-[#52514E] mt-0.5">
                  Perguruan Tinggi (PTN &amp; PTS)
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-[#FAF7F2] border-2 border-[#141413]">
                <p className="text-2xl sm:text-3xl font-display font-black text-[#141413]">
                  <span className="stat-count-num" data-target={directoryStats.smk}>
                    {directoryStats.smk}
                  </span>
                </p>
                <p className="text-sm font-semibold text-[#52514E] mt-0.5">
                  SMK Negeri &amp; Swasta Bali
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-[#FAF7F2] border-2 border-[#141413]">
                <p className="text-2xl sm:text-3xl font-display font-black text-[#141413]">
                  <span className="stat-count-num" data-target={directoryStats.sma}>
                    {directoryStats.sma}
                  </span>
                </p>
                <p className="text-sm font-semibold text-[#52514E] mt-0.5">
                  SMA Jalur Persiapan S1
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Filter & Kabupaten Strip */}
        <section className="space-y-5">
          <div className="bg-white border-2 border-[#141413] rounded-2xl shadow-[4px_4px_0px_#141413] p-5 space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
              <div className="md:col-span-6 space-y-1.5">
                <label
                  htmlFor="search-bidang"
                  className="block text-xs sm:text-sm font-bold text-[#141413]"
                >
                  Cari Bidang Studi atau Profesi
                </label>
                <input
                  id="search-bidang"
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Contoh: Informatika, Perhotelan, Kesehatan, Desain..."
                  className="w-full min-h-[44px] px-3.5 py-2 rounded-xl border-2 border-[#141413] bg-white text-sm sm:text-base text-[#141413] placeholder:text-[#52514E]/70 focus:outline-none focus:ring-2 focus:ring-[#3B66FF]"
                />
              </div>

              <div className="md:col-span-6">
                <LocationOriginControl
                  id="index-kabupaten-origin"
                  label="Alamat / Lokasi Asal (untuk Estimasi Jarak)"
                  origin={origin}
                  isDetecting={isDetecting}
                  isGeocoding={isGeocoding}
                  locationNote={locationNote}
                  onChangeManualKabupaten={setManualKabupaten}
                  onSubmitManualAddress={setManualAddress}
                  onDetectLocation={detectLocation}
                  compact
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              {GROUP_OPTIONS.map((opt) => {
                const active = selectedGroup === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setSelectedGroup(opt.id)}
                    className={`px-3.5 py-2 rounded-xl border-2 border-[#141413] text-xs sm:text-sm font-display font-bold transition-all cursor-pointer ${
                      active
                        ? `${opt.accentBg} shadow-[2px_2px_0px_#141413]`
                        : "bg-[#FAF7F2] text-[#141413] hover:bg-[#F0ECE1]"
                    }`}
                  >
                    {opt.label}
                  </button>
                );
              })}

              {savedIds.length > 0 && (
                <button
                  type="button"
                  onClick={() => setOnlySaved((prev) => !prev)}
                  className={`px-3.5 py-2 rounded-xl border-2 border-[#141413] text-xs sm:text-sm font-display font-bold transition-all cursor-pointer ${
                    onlySaved
                      ? "bg-[#141413] text-[#B8F348]"
                      : "bg-white text-[#141413] hover:bg-[#F0ECE1]"
                  }`}
                >
                  Bidang Tersimpan ({savedIds.length})
                </button>
              )}
            </div>
          </div>

          {/* Fields Grid */}
          {filteredFields.length === 0 ? (
            <div className="bg-white border-2 border-dashed border-[#141413]/50 rounded-2xl p-8 text-center space-y-3">
              <h2 className="text-xl font-display font-bold text-[#141413]">
                Tidak ada bidang studi yang cocok
              </h2>
              <p className="text-base text-[#52514E] max-w-md mx-auto">
                Coba bersihkan kata kunci pencarian atau pilih filter Semua Bidang.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSelectedGroup("all");
                  setSearchQuery("");
                  setOnlySaved(false);
                }}
                className="neo-btn px-5 py-2.5 rounded-xl bg-[#B8F348] text-sm sm:text-base font-display font-bold cursor-pointer"
              >
                Tampilkan Semua Bidang
              </button>
            </div>
          ) : (
            <div className="field-index-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredFields.map((field) => {
                const badge = GROUP_BADGE_MAP[field.group];
                const counts = countsPerField[field.id] ?? { pt: 0, smk: 0 };
                const isSaved = savedIds.includes(field.id);

                return (
                  <Link
                    key={field.id}
                    href={`/peta-bidang/${field.id}?kabupaten=${encodeURIComponent(
                      origin.kabupaten
                    )}`}
                    className="field-index-card group bg-white border-2 border-[#141413] rounded-2xl shadow-[4px_4px_0px_#141413] p-5 sm:p-6 flex flex-col justify-between gap-5 transition-transform duration-150 hover:-translate-y-1 hover:shadow-[6px_6px_0px_#141413]"
                  >
                    <div className="space-y-3.5">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span
                          className={`px-2.5 py-1 rounded-lg border-2 border-[#141413] text-xs font-bold ${badge.bg}`}
                        >
                          {badge.label}
                        </span>
                        {isSaved && (
                          <span className="px-2.5 py-1 rounded-lg bg-[#B8F348] border border-[#141413] text-xs font-bold text-[#141413]">
                            Tersimpan
                          </span>
                        )}
                      </div>

                      <div className="space-y-2">
                        <h2 className="text-xl font-display font-extrabold text-[#141413] leading-snug group-hover:text-[#3B66FF] transition-colors">
                          {field.name}
                        </h2>
                        <p className="text-base text-[#52514E] leading-relaxed">
                          {field.shortDesc}
                        </p>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-[#141413]/15 space-y-3">
                      <div className="flex items-center justify-between gap-2 text-xs sm:text-sm font-semibold text-[#52514E]">
                        <span>{counts.pt} Perguruan Tinggi</span>
                        <span>{counts.smk} SMK di Bali</span>
                      </div>
                      <div className="flex items-center justify-between font-display font-bold text-sm sm:text-base text-[#141413]">
                        <span>Buka Peta Bidang</span>
                        <span className="group-hover:translate-x-1 transition-transform">
                          -&gt;
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </section>

        {/* Bottom Guidance Strip */}
        <section className="bg-[#FAF7F2] border-2 border-[#141413] rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <h2 className="text-xl sm:text-2xl font-display font-extrabold text-[#141413]">
              Belum yakin bidang mana yang paling cocok?
            </h2>
            <p className="text-base text-[#52514E] max-w-[65ch]">
              Mulai asesmen minat adaptif selama 5 menit atau konsultasikan langsung pilihan jurusanmu dengan Mentor AI KertaMarga.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 shrink-0">
            <Link
              href="/eksplorasi"
              className="neo-btn px-5 py-3 rounded-xl bg-[#B8F348] text-sm sm:text-base font-display font-bold text-[#141413]"
            >
              Mulai Asesmen
            </Link>
            <Link
              href="/ai-navigator"
              className="neo-btn px-5 py-3 rounded-xl bg-white text-sm sm:text-base font-display font-bold text-[#141413]"
            >
              Tanya Mentor AI
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
