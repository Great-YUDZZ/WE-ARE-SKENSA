"use client";

import React, { Suspense, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";
import Navbar from "@/components/Navbar";
import InstitutionDirectorySection from "@/components/peta-bidang/InstitutionDirectorySection";
import {
  BALI_KABUPATEN_COORDS,
  PROGRAM_FIELDS,
  TrackKey,
  formatOriginLabel,
  getLevelComparisonSummary,
} from "@/data/catalog";
import { getBaliEntitiesForField } from "@/data/bali-institutions";
import { useBaliLocation } from "@/lib/useBaliLocation";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);
}

const STORAGE_SAVED_KEY = "kertamarga_saved_fields";

function PetaBidangSkeleton() {
  return (
    <div className="min-h-screen flex flex-col neopop-canvas-subtle text-[#141413]">
      <Navbar />
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 pb-16 space-y-8 animate-pulse">
        <div className="h-6 w-64 rounded-lg bg-[#F0ECE1] border border-[#141413]/20" />
        <div className="h-72 rounded-3xl bg-white border-2 border-[#141413]/30 p-8 space-y-4">
          <div className="h-6 w-40 rounded-lg bg-[#F0ECE1]" />
          <div className="h-10 w-3/4 rounded-xl bg-[#F0ECE1]" />
          <div className="h-5 w-2/3 rounded-lg bg-[#F0ECE1]" />
          <div className="grid grid-cols-3 gap-4 pt-4">
            <div className="h-20 rounded-2xl bg-[#FAF7F2]" />
            <div className="h-20 rounded-2xl bg-[#FAF7F2]" />
            <div className="h-20 rounded-2xl bg-[#FAF7F2]" />
          </div>
        </div>
        <div className="h-64 rounded-3xl bg-white border-2 border-[#141413]/30" />
      </main>
    </div>
  );
}

function PetaBidangDetailContent() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const rawFieldId = (params?.id as string) || "informatika";
  const explicitKab = searchParams.get("kabupaten");
  const initialKab = explicitKab || "Kota Denpasar";

  const matchedField = PROGRAM_FIELDS.find((p) => p.id === rawFieldId);
  const field = matchedField ?? PROGRAM_FIELDS[0];
  const isUnknownRoute = !matchedField;

  const {
    origin,
    isDetecting,
    isGeocoding,
    locationNote,
    setManualKabupaten,
    setManualAddress,
    detectLocation,
  } = useBaliLocation(
    BALI_KABUPATEN_COORDS[initialKab] ? initialKab : undefined,
    { skipAutoDetect: Boolean(explicitKab && BALI_KABUPATEN_COORDS[explicitKab]) }
  );
  const originLabel = useMemo(() => formatOriginLabel(origin), [origin]);
  const [activeTrack, setActiveTrack] = useState<TrackKey>("vokasi");
  const [contextTab, setContextTab] = useState<"masalah" | "karier">("masalah");
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const heroTitleRef = useRef<HTMLHeadingElement>(null);
  const heroContourRef = useRef<SVGSVGElement>(null);
  const toastTimerRef = useRef<number | null>(null);

  // Sinkronkan bookmark tersimpan dari localStorage
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
      // Abaikan jika penyimpanan lokal dibatasi browser
    }
  }, []);

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) {
        window.clearTimeout(toastTimerRef.current);
      }
    };
  }, []);

  const showToast = (message: string) => {
    setToastMessage(message);
    if (toastTimerRef.current) {
      window.clearTimeout(toastTimerRef.current);
    }
    toastTimerRef.current = window.setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  const handleKabupatenChange = (nextKabupaten: string) => {
    setManualKabupaten(nextKabupaten);
    try {
      const url = new URL(window.location.href);
      url.searchParams.set("kabupaten", nextKabupaten);
      window.history.replaceState({}, "", url.toString());
    } catch {
      // Abaikan jika history API tidak tersedia
    }
    showToast(`Estimasi jarak diperbarui dari ${nextKabupaten}.`);
  };

  const handleManualAddressSubmit = async (
    rawAddress: string,
    preferredKabupaten?: string
  ) => {
    const outcome = await setManualAddress(rawAddress, preferredKabupaten);
    showToast(outcome.message);
  };

  const handleDetectLocation = async () => {
    const outcome = await detectLocation();
    showToast(outcome.message);
  };

  const isSaved = savedIds.includes(field.id);

  const handleToggleBookmark = () => {
    const next = isSaved
      ? savedIds.filter((id) => id !== field.id)
      : [...savedIds, field.id];
    setSavedIds(next);
    try {
      window.localStorage.setItem(STORAGE_SAVED_KEY, JSON.stringify(next));
    } catch {
      // Tetap perbarui state memori meskipun penyimpanan lokal dibatasi
    }
    showToast(
      isSaved
        ? `${field.name} dihapus dari bookmark bidang.`
        : `${field.name} disimpan ke bookmark bidang Anda.`
    );
  };

  const baliEntities = useMemo(
    () => getBaliEntitiesForField(field.id, origin),
    [field.id, origin]
  );

  const levelSummaries = useMemo(
    () => getLevelComparisonSummary(field.id),
    [field.id]
  );

  const nearestKm = useMemo(() => {
    const combined = [
      ...baliEntities.perguruanTinggi,
      ...baliEntities.smk,
    ];
    if (combined.length === 0) return 0;
    return Math.min(...combined.map((item) => item.estimatedDistanceKm));
  }, [baliEntities.perguruanTinggi, baliEntities.smk]);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      let splitInstance: SplitText | null = null;

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        if (progressBarRef.current && containerRef.current) {
          gsap.fromTo(
            progressBarRef.current,
            { scaleX: 0 },
            {
              scaleX: 1,
              ease: "none",
              scrollTrigger: {
                trigger: containerRef.current,
                start: "top top",
                end: "bottom bottom",
                scrub: 0.2,
              },
            }
          );
        }

        if (heroTitleRef.current) {
          splitInstance = SplitText.create(heroTitleRef.current, {
            type: "words",
          });
          gsap.from(splitInstance.words, {
            y: 16,
            opacity: 0,
            duration: 0.5,
            stagger: 0.04,
            ease: "power3.out",
            clearProps: "transform,opacity",
          });
        }

        if (heroContourRef.current) {
          gsap.to(heroContourRef.current, {
            y: 26,
            ease: "none",
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top top",
              end: "520px top",
              scrub: 0.6,
            },
          });
        }

        const statEls = gsap.utils.toArray<HTMLElement>(".hero-stat-counter");
        statEls.forEach((el) => {
          const target = Number(el.dataset.target || "0");
          const suffix = el.dataset.suffix || "";
          const prefix = el.dataset.prefix || "";
          const holder = { value: 0 };
          gsap.to(holder, {
            value: target,
            duration: 0.75,
            ease: "power2.out",
            onUpdate: () => {
              el.textContent = `${prefix}${Math.round(holder.value)}${suffix}`;
            },
            onComplete: () => {
              el.textContent = `${prefix}${target}${suffix}`;
            },
          });
        });

        const chapters = gsap.utils.toArray<HTMLElement>(".chapter-reveal");
        chapters.forEach((chapter) => {
          gsap.from(chapter, {
            y: 14,
            duration: 0.4,
            ease: "power2.out",
            immediateRender: false,
            clearProps: "transform",
            scrollTrigger: {
              trigger: chapter,
              start: "top 92%",
              once: true,
            },
          });
        });
      });

      return () => {
        if (splitInstance) {
          splitInstance.revert();
        }
        mm.revert();
      };
    },
    { scope: containerRef, dependencies: [field.id] }
  );

  const activeSummary = levelSummaries[activeTrack];
  const activeCurriculum = field.whatYouLearn[activeTrack];

  return (
    <div
      ref={containerRef}
      className="min-h-screen flex flex-col neopop-canvas-subtle text-[#141413] relative selection:bg-[#B8F348] selection:text-[#141413]"
    >
      {/* Top Scroll-Craft Progress Line */}
      <div
        aria-hidden="true"
        className="fixed top-0 left-0 right-0 h-1 z-50 bg-transparent pointer-events-none"
      >
        <div
          ref={progressBarRef}
          className="h-full w-full bg-[#B8F348] border-b border-[#141413] origin-left"
          style={{ transform: "scaleX(0)" }}
        />
      </div>

      {/* Feedback Toast */}
      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-6 right-4 sm:right-8 z-50 border-2 border-[#141413] shadow-[4px_4px_0px_#B8F348] px-5 py-3.5 rounded-2xl bg-[#141413] text-white flex items-center gap-3 max-w-sm"
        >
          <span className="w-2.5 h-2.5 rounded-full bg-[#B8F348] shrink-0" />
          <span className="text-sm font-display font-bold text-white">{toastMessage}</span>
        </div>
      )}

      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 pb-16 space-y-8 sm:space-y-10">
        {/* Route Not Found Notice (Fallback Banner) */}
        {isUnknownRoute && (
          <div
            role="alert"
            className="bg-[#FFBE2E]/25 border-2 border-[#141413] rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
          >
            <p className="text-sm sm:text-base font-medium text-[#141413]">
              Bidang dengan kode <strong>{rawFieldId}</strong> tidak ditemukan. Menampilkan panduan standar untuk {field.name}.
            </p>
            <Link
              href="/peta-bidang"
              className="text-sm font-display font-bold underline text-[#141413] shrink-0"
            >
              Lihat semua 11 bidang
            </Link>
          </div>
        )}

        {/* Breadcrumb & Compact Switcher */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white border-2 border-[#141413] rounded-2xl shadow-[3px_3px_0px_#141413] px-4 py-3">
          <nav
            aria-label="Navigasi halaman"
            className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#52514E] min-w-0 flex-1"
          >
            <Link href="/" className="hover:text-[#141413] underline shrink-0">
              Beranda
            </Link>
            <span aria-hidden="true" className="shrink-0">/</span>
            <Link href="/peta-bidang" className="hover:text-[#141413] underline shrink-0">
              Peta Bidang
            </Link>
            <span aria-hidden="true" className="shrink-0">/</span>
            <span className="px-2.5 py-0.5 rounded-lg bg-[#B8F348] border border-[#141413] text-[#141413] font-bold truncate">
              {field.name}
            </span>
          </nav>

          <div className="flex items-center gap-2.5 shrink-0">
            <label
              htmlFor="quick-switch-field"
              className="text-xs sm:text-sm font-bold text-[#141413] shrink-0"
            >
              Pindah Bidang:
            </label>
            <select
              id="quick-switch-field"
              value={field.id}
              onChange={(e) => {
                router.push(
                  `/peta-bidang/${e.target.value}?kabupaten=${encodeURIComponent(
                    origin.kabupaten
                  )}`
                );
              }}
              className="min-h-[40px] max-w-[240px] sm:max-w-[320px] px-3 py-1.5 rounded-xl border-2 border-[#141413] bg-[#FAF7F2] text-xs sm:text-sm font-display font-bold text-[#141413] focus:outline-none focus:ring-2 focus:ring-[#3B66FF] cursor-pointer"
            >
              {PROGRAM_FIELDS.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Hero Editorial Section */}
        <section className="relative overflow-hidden bg-white border-2 border-[#141413] rounded-3xl shadow-[6px_6px_0px_#141413] p-6 sm:p-8 space-y-5">
          <svg
            ref={heroContourRef}
            aria-hidden="true"
            viewBox="0 0 420 260"
            fill="none"
            className="pointer-events-none select-none absolute -right-10 -top-8 w-72 sm:w-96 opacity-15 text-[#141413]"
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
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="px-3.5 py-1 rounded-xl bg-[#3B66FF] text-white text-xs sm:text-sm font-bold border-2 border-[#141413]">
                {field.categoryName}
              </span>

              <button
                type="button"
                onClick={handleToggleBookmark}
                aria-pressed={isSaved}
                className={`px-4 py-2 rounded-xl border-2 border-[#141413] text-xs sm:text-sm font-display font-bold transition-colors cursor-pointer ${
                  isSaved
                    ? "bg-[#B8F348] text-[#141413]"
                    : "bg-[#FAF7F2] text-[#141413] hover:bg-[#F0ECE1]"
                }`}
              >
                {isSaved ? "Tersimpan di Bookmark" : "Simpan Bidang"}
              </button>
            </div>

            <div className="space-y-3">
              <h1
                key={`title-${field.id}`}
                ref={heroTitleRef}
                className="text-3xl sm:text-4xl lg:text-[2.75rem] font-display font-black text-[#141413] leading-[1.12] tracking-tight"
              >
                {field.name}
              </h1>
              <p className="text-base sm:text-lg font-display font-bold text-[#3B66FF]">
                {field.vibeTagline}
              </p>
              <p className="text-base text-[#52514E] leading-[1.65] max-w-[65ch]">
                {field.shortDesc}
              </p>
            </div>

            {/* 3 Hero Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
              <div className="p-4 rounded-2xl bg-[#FAF7F2] border-2 border-[#141413]">
                <p
                  className="hero-stat-counter text-2xl sm:text-3xl font-display font-black text-[#141413]"
                  data-target={baliEntities.perguruanTinggi.length}
                >
                  {baliEntities.perguruanTinggi.length}
                </p>
                <p className="text-xs sm:text-sm font-semibold text-[#52514E] mt-0.5">
                  Perguruan Tinggi di Bali
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-[#FAF7F2] border-2 border-[#141413]">
                <p
                  className="hero-stat-counter text-2xl sm:text-3xl font-display font-black text-[#141413]"
                  data-target={baliEntities.smk.length}
                >
                  {baliEntities.smk.length}
                </p>
                <p className="text-xs sm:text-sm font-semibold text-[#52514E] mt-0.5">
                  SMK Kejuruan Terkait
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-[#FAF7F2] border-2 border-[#141413]">
                <p
                  className="hero-stat-counter text-2xl sm:text-3xl font-display font-black text-[#141413]"
                  data-target={nearestKm}
                  data-prefix="~"
                  data-suffix=" km"
                >
                  ~{nearestKm} km
                </p>
                <p className="text-xs sm:text-sm font-semibold text-[#52514E] mt-0.5">
                  Jarak Terdekat dari {originLabel}
                </p>
              </div>
            </div>

            {/* Hero Action Links */}
            <div className="flex flex-wrap gap-3 pt-1">
              <Link
                href={`/tes-keminatan?field=${encodeURIComponent(field.id)}`}
                className="neo-btn px-5 py-2.5 rounded-xl bg-[#B8F348] text-sm sm:text-base font-display font-bold text-[#141413]"
              >
                Survey Minat Bidang Ini
              </Link>
              <Link
                href="/eksplorasi"
                className="neo-btn px-5 py-2.5 rounded-xl bg-white text-sm sm:text-base font-display font-bold text-[#141413]"
              >
                Cek Kecocokan Minat
              </Link>
              <Link
                href={`/hasil-analisis?field=${field.id}&kabupaten=${encodeURIComponent(
                  origin.kabupaten
                )}`}
                className="neo-btn px-5 py-2.5 rounded-xl bg-white text-sm sm:text-base font-display font-bold text-[#141413]"
              >
                Lihat Simulasi Skor
              </Link>
              <Link
                href={`/ai-navigator?field=${encodeURIComponent(field.name)}`}
                className="neo-btn px-5 py-2.5 rounded-xl bg-[#FAF7F2] text-sm sm:text-base font-display font-bold text-[#141413]"
              >
                Diskusi dengan Mentor AI
              </Link>
            </div>
          </div>
        </section>

        {/* Bab 1: Komparasi & Kurikulum 3 Jalur */}
        <section
          aria-labelledby="heading-bab-1"
          className="chapter-reveal space-y-6"
        >
          <div className="space-y-2">
            <span className="inline-block px-3 py-1 rounded-lg bg-[#B8F348] border-2 border-[#141413] text-xs sm:text-sm font-bold text-[#141413]">
              Bab 1 - Jalur Pendidikan
            </span>
            <h2
              id="heading-bab-1"
              className="text-2xl sm:text-[1.75rem] font-display font-extrabold text-[#141413] leading-tight"
            >
              Perbandingan SMK, Politeknik D3/D4, dan Sarjana S1
            </h2>
            <p className="text-base text-[#52514E] leading-relaxed max-w-[65ch]">
              Pilih salah satu jenjang di bawah ini untuk membandingkan durasi, porsi praktik, dan topik belajar utama.
            </p>
          </div>

          <div className="bg-white border-2 border-[#141413] rounded-3xl shadow-[4px_4px_0px_#141413] p-5 sm:p-8 space-y-6">
            {/* Level Tabs */}
            <div
              role="tablist"
              aria-label="Pilihan jenjang pendidikan"
              className="grid grid-cols-1 sm:grid-cols-3 gap-2.5"
            >
              {(["smk", "vokasi", "akademik"] as TrackKey[]).map((track) => {
                const meta = levelSummaries[track];
                const active = activeTrack === track;
                return (
                  <button
                    key={track}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => setActiveTrack(track)}
                    className={`px-4 py-3 rounded-xl border-2 border-[#141413] font-display font-bold text-sm sm:text-base text-left transition-all cursor-pointer ${
                      active
                        ? "bg-[#141413] text-[#B8F348] shadow-[3px_3px_0px_#3B66FF]"
                        : "bg-[#FAF7F2] text-[#141413] hover:bg-[#F0ECE1]"
                    }`}
                  >
                    {meta.shortLabel}
                  </button>
                );
              })}
            </div>

            {/* Comparison Summary Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#141413]/30 space-y-1">
                <p className="text-xs font-bold uppercase tracking-wide text-[#52514E]">
                  Durasi Tempuh
                </p>
                <p className="text-sm sm:text-base font-bold text-[#141413]">
                  {activeSummary.duration}
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#141413]/30 space-y-1">
                <p className="text-xs font-bold uppercase tracking-wide text-[#52514E]">
                  Porsi Praktik &amp; Teori
                </p>
                <p className="text-sm sm:text-base font-bold text-[#141413]">
                  {activeSummary.practiceRatio}
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#141413]/30 space-y-1">
                <p className="text-xs font-bold uppercase tracking-wide text-[#52514E]">
                  Jalur Masuk Umum
                </p>
                <p className="text-sm sm:text-base font-bold text-[#141413]">
                  {activeSummary.targetEntrance}
                </p>
              </div>
            </div>

            {/* Curriculum & Bridge Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-2">
              <div className="lg:col-span-7 space-y-3">
                <h3 className="text-lg sm:text-xl font-display font-bold text-[#141413]">
                  Topik Belajar Utama ({activeSummary.label})
                </h3>
                <ul className="space-y-2.5">
                  {activeCurriculum.map((topic, index) => (
                    <li
                      key={topic}
                      className="flex items-start gap-3 p-3.5 rounded-xl bg-[#FAF7F2] border border-[#141413]/20 text-base text-[#141413] leading-relaxed"
                    >
                      <span className="px-2 py-0.5 rounded-md bg-[#B8F348] border border-[#141413] font-mono text-xs font-bold shrink-0 mt-0.5">
                        0{index + 1}
                      </span>
                      <span>{topic}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="lg:col-span-5 space-y-4">
                <div className="p-5 rounded-2xl bg-[#FAF7F2] border-2 border-[#141413] space-y-2">
                  <h3 className="text-lg font-display font-bold text-[#141413]">
                    Arah Lulusan
                  </h3>
                  <p className="text-base text-[#52514E] leading-relaxed">
                    {activeSummary.careerOrientation}
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-[#FFBE2E]/25 border-2 border-[#141413] space-y-2.5">
                  <h3 className="text-lg font-display font-bold text-[#141413]">
                    Bekal Persiapan Awal
                  </h3>
                  <ul className="space-y-2">
                    {field.readinessBridgeTips.map((tip) => (
                      <li
                        key={tip}
                        className="text-sm sm:text-base text-[#141413] leading-relaxed flex items-start gap-2"
                      >
                        <span className="font-bold text-[#141413] shrink-0">-</span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Bab 2: Masalah Nyata Bali vs Peluang Karier */}
        <section
          aria-labelledby="heading-bab-2"
          className="chapter-reveal space-y-6"
        >
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="space-y-2">
              <span className="inline-block px-3 py-1 rounded-lg bg-[#FF5E4D] text-white border-2 border-[#141413] text-xs sm:text-sm font-bold">
                Bab 2 - Konteks Bali &amp; Prospek
              </span>
              <h2
                id="heading-bab-2"
                className="text-2xl sm:text-[1.75rem] font-display font-extrabold text-[#141413] leading-tight"
              >
                Relevansi Daerah dan Masa Depan Karier
              </h2>
            </div>

            <div
              role="tablist"
              aria-label="Pilih fokus pembahasan"
              className="inline-flex bg-white p-1.5 rounded-2xl border-2 border-[#141413] shadow-[3px_3px_0px_#141413] shrink-0"
            >
              <button
                type="button"
                role="tab"
                aria-selected={contextTab === "masalah"}
                onClick={() => setContextTab("masalah")}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-display font-bold transition-colors cursor-pointer ${
                  contextTab === "masalah"
                    ? "bg-[#141413] text-[#B8F348]"
                    : "text-[#52514E] hover:text-[#141413]"
                }`}
              >
                Masalah Nyata di Bali
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={contextTab === "karier"}
                onClick={() => setContextTab("karier")}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-display font-bold transition-colors cursor-pointer ${
                  contextTab === "karier"
                    ? "bg-[#141413] text-[#B8F348]"
                    : "text-[#52514E] hover:text-[#141413]"
                }`}
              >
                Karier &amp; Wirausaha
              </button>
            </div>
          </div>

          <div className="bg-white border-2 border-[#141413] rounded-3xl shadow-[4px_4px_0px_#141413] p-5 sm:p-8 space-y-6">
            {contextTab === "masalah" ? (
              <div className="space-y-4">
                <h3 className="text-lg sm:text-xl font-display font-bold text-[#141413]">
                  Tantangan Nyata yang Dapat Diselesaikan di Bali
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {field.realProblemsSolvedInBali.map((problem, idx) => (
                    <div
                      key={problem}
                      className="p-4 sm:p-5 rounded-2xl bg-[#FAF7F2] border border-[#141413]/25 space-y-2"
                    >
                      <span className="inline-block px-2.5 py-0.5 rounded-md bg-white border border-[#141413] font-mono text-xs font-bold text-[#141413]">
                        Studi Kasus 0{idx + 1}
                      </span>
                      <p className="text-base text-[#141413] leading-[1.6]">
                        {problem}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-5 rounded-2xl bg-[#FAF7F2] border border-[#141413]/25 space-y-3">
                  <h3 className="text-lg sm:text-xl font-display font-bold text-[#141413]">
                    Jalur Profesi Utama
                  </h3>
                  <ul className="space-y-2.5">
                    {field.careerPaths.map((roleName) => (
                      <li
                        key={roleName}
                        className="text-base font-medium text-[#141413] flex items-start gap-2.5"
                      >
                        <span className="w-2 h-2 rounded-full bg-[#3B66FF] mt-2 shrink-0" />
                        <span>{roleName}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-5 rounded-2xl bg-[#FAF7F2] border border-[#141413]/25 space-y-3">
                  <h3 className="text-lg sm:text-xl font-display font-bold text-[#141413]">
                    Peluang Usaha Mandiri di Bali
                  </h3>
                  <ul className="space-y-2.5">
                    {field.localEntrepreneurshipIdeas.map((idea) => (
                      <li
                        key={idea}
                        className="text-base font-medium text-[#141413] flex items-start gap-2.5"
                      >
                        <span className="w-2 h-2 rounded-full bg-[#1AD598] mt-2 shrink-0" />
                        <span>{idea}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Core Competencies Strip */}
            <div className="pt-4 border-t border-[#141413]/15 space-y-3">
              <p className="text-xs sm:text-sm font-bold text-[#52514E] uppercase tracking-wide">
                Keahlian Kunci yang Dikembangkan
              </p>
              <div className="flex flex-wrap gap-2">
                {field.coreCompetencies.map((skill) => (
                  <span
                    key={skill}
                    className="px-3.5 py-1.5 rounded-xl bg-[#FAF7F2] border border-[#141413]/30 text-sm font-semibold text-[#141413]"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Bab 3: Direktori Sekolah & Perguruan Tinggi */}
        <InstitutionDirectorySection
          fieldId={field.id}
          fieldName={field.name}
          kabupatenOrigin={origin.kabupaten}
          locationOrigin={origin}
          isDetectingLocation={isDetecting}
          isGeocodingLocation={isGeocoding}
          locationNote={locationNote}
          onChangeKabupatenOrigin={handleKabupatenChange}
          onSubmitManualAddress={handleManualAddressSubmit}
          onDetectLocation={handleDetectLocation}
        />

        {/* Bab 4: Rujukan Resmi & Transparansi Data */}
        <section
          aria-labelledby="heading-bab-4"
          className="chapter-reveal space-y-4"
        >
          <div className="bg-[#FAF7F2] border-2 border-[#141413] rounded-2xl p-5 sm:p-7 space-y-4">
            <div className="space-y-1">
              <h2
                id="heading-bab-4"
                className="text-lg sm:text-xl font-display font-extrabold text-[#141413]"
              >
                Rujukan Kurikulum &amp; Validitas Direktori Bali
              </h2>
              <p className="text-sm sm:text-base text-[#52514E] leading-relaxed max-w-[65ch]">
                Estimasi jarak dihitung menggunakan formula Haversine dari alamat manual, pusat kabupaten, atau koordinat GPS opsional Anda menuju area kampus dan sekolah di Bali. Selalu periksa jadwal penerimaan mahasiswa baru atau PPDB terbaru melalui kanal resmi lembaga masing-masing.
              </p>
            </div>

            {field.sourceRecords.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                {field.sourceRecords.map((source) => (
                  <div
                    key={`${source.publisher}-${source.checkDate}`}
                    className="p-4 rounded-xl bg-white border border-[#141413]/25 space-y-1.5"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="text-sm font-bold text-[#141413]">
                        {source.publisher}
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-[#B8F348] border border-[#141413] text-xs font-bold text-[#141413]">
                        {source.status}
                      </span>
                    </div>
                    {source.notes && (
                      <p className="text-xs sm:text-sm text-[#52514E]">
                        {source.notes}
                      </p>
                    )}
                    <div className="flex items-center justify-between text-xs text-[#52514E] pt-1">
                      <span>Diperiksa: {source.checkDate}</span>
                      <a
                        href={source.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-bold text-[#3B66FF] underline"
                      >
                        Kunjungi Sumber
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

export default function PetaBidangDetailPage() {
  return (
    <Suspense fallback={<PetaBidangSkeleton />}>
      <PetaBidangDetailContent />
    </Suspense>
  );
}
