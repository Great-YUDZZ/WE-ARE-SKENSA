"use client";

import React, { Suspense, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";
import Navbar from "@/components/Navbar";
import LocationOriginControl from "@/components/LocationOriginControl";
import InstitutionDetailDrawer from "@/components/katalog/InstitutionDetailDrawer";
import CompareInstitutionsModal from "@/components/katalog/CompareInstitutionsModal";
import { BALI_KABUPATEN_COORDS, formatOriginLabel } from "@/data/catalog";
import { BaliEntityCategory } from "@/data/bali-institutions";
import {
  UnifiedKatalogInstitution,
  getFieldLabelById,
  getUnifiedKatalogInstitutions,
} from "@/data/katalog-adapter";
import {
  StoredEducationLevel,
  getStoredEducationLevel,
} from "@/lib/test-report-download";
import { useBaliLocation } from "@/lib/useBaliLocation";
import { useCardDeckTransition } from "@/lib/useCardDeckTransition";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);
}

type KatalogTab = "all" | BaliEntityCategory;
type StatusFilter = "all" | "negeri" | "swasta";
type SortOrder = "distance" | "name";

interface SavedSurveySummary {
  fieldId: string;
  score: number;
}

const PAGE_SIZE = 6;
const MAX_COMPARE = 3;
const MAX_CARD_CHIPS = 4;

function isNegeriStatus(status: string): boolean {
  return status.toLowerCase().includes("negeri");
}

function getTestMatchScore(
  item: UnifiedKatalogInstitution,
  fieldId: string,
  educationLevel: StoredEducationLevel | null
): number {
  const hasField = item.matchedFields.includes(fieldId);
  if (educationLevel === "SMP") {
    if (item.category === "smk" && hasField) return 2;
    if (item.category === "sma") return 1;
    return 0;
  }
  if (educationLevel === "SMA" || educationLevel === "SMK") {
    return item.category === "perguruan-tinggi" && hasField ? 2 : 0;
  }
  return hasField ? 2 : 0;
}

function KatalogSkeleton() {
  return (
    <div className="min-h-screen flex flex-col neopop-canvas-subtle text-[#141413]">
      <Navbar />
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10 animate-pulse">
        <div className="h-6 w-56 rounded-lg bg-[#F0ECE1] border border-[#141413]/20" />
        <div className="h-72 rounded-3xl bg-white border-2 border-[#141413]/30 p-8 space-y-4">
          <div className="h-6 w-44 rounded-lg bg-[#F0ECE1]" />
          <div className="h-10 w-3/4 rounded-xl bg-[#F0ECE1]" />
          <div className="h-5 w-2/3 rounded-lg bg-[#F0ECE1]" />
          <div className="grid grid-cols-3 gap-4 pt-4">
            <div className="h-20 rounded-2xl bg-[#FAF7F2]" />
            <div className="h-20 rounded-2xl bg-[#FAF7F2]" />
            <div className="h-20 rounded-2xl bg-[#FAF7F2]" />
          </div>
        </div>
        <div className="h-44 rounded-2xl bg-white border-2 border-[#141413]/30" />
      </main>
    </div>
  );
}

function KatalogPageContent() {
  const searchParams = useSearchParams();
  const explicitKabParam = searchParams.get("kabupaten");
  const initialKabParam = explicitKabParam || "Kota Denpasar";

  const {
    origin,
    isDetecting,
    isGeocoding,
    locationNote,
    setManualKabupaten,
    setManualAddress,
    detectLocation,
  } = useBaliLocation(
    BALI_KABUPATEN_COORDS[initialKabParam] ? initialKabParam : undefined,
    { skipAutoDetect: Boolean(explicitKabParam && BALI_KABUPATEN_COORDS[explicitKabParam]) }
  );
  const originLabel = useMemo(() => formatOriginLabel(origin), [origin]);
  const [activeTab, setActiveTab] = useState<KatalogTab>("all");
  const [lokasiFilter, setLokasiFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [onlyAudited, setOnlyAudited] = useState<boolean>(false);
  const [matchTestFilter, setMatchTestFilter] = useState<boolean>(false);
  const [showTestPrompt, setShowTestPrompt] = useState<boolean>(false);
  const [savedSurvey, setSavedSurvey] = useState<SavedSurveySummary | null>(null);
  const [educationLevel, setEducationLevel] = useState<StoredEducationLevel | null>(null);
  const [sortOrder, setSortOrder] = useState<SortOrder>("distance");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);

  const [selectedDetailId, setSelectedDetailId] = useState<string | null>(null);
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [isCompareOpen, setIsCompareOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const heroTitleRef = useRef<HTMLHeadingElement>(null);
  const heroContourRef = useRef<SVGSVGElement>(null);
  const toastTimerRef = useRef<number | null>(null);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem("kertamarga_survey_result");
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<SavedSurveySummary>;
        if (typeof parsed.fieldId === "string" && parsed.fieldId.trim().length > 0) {
          setSavedSurvey({
            fieldId: parsed.fieldId,
            score: typeof parsed.score === "number" ? parsed.score : 0,
          });
        }
      }
      setEducationLevel(getStoredEducationLevel());
    } catch {
      // Ignore storage read errors
    }

    return () => {
      if (toastTimerRef.current) {
        window.clearTimeout(toastTimerRef.current);
      }
    };
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    if (toastTimerRef.current) {
      window.clearTimeout(toastTimerRef.current);
    }
    toastTimerRef.current = window.setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  const allInstitutions = useMemo(
    () => getUnifiedKatalogInstitutions(origin),
    [origin]
  );

  const counts = useMemo(() => {
    let audited = 0;
    let pt = 0;
    let smk = 0;
    let sma = 0;
    for (const item of allInstitutions) {
      if (item.hasAudit) audited += 1;
      if (item.category === "perguruan-tinggi") pt += 1;
      if (item.category === "smk") smk += 1;
      if (item.category === "sma") sma += 1;
    }
    return {
      all: allInstitutions.length,
      audited,
      pt,
      smk,
      sma,
    };
  }, [allInstitutions]);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, lokasiFilter, statusFilter, onlyAudited, matchTestFilter, sortOrder, searchQuery]);

  const filteredList = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    const matches = allInstitutions.filter((item) => {
      if (activeTab !== "all" && item.category !== activeTab) {
        return false;
      }
      if (onlyAudited && !item.hasAudit) {
        return false;
      }
      if (
        matchTestFilter &&
        savedSurvey &&
        getTestMatchScore(item, savedSurvey.fieldId, educationLevel) === 0
      ) {
        return false;
      }
      if (lokasiFilter !== "all" && item.kabupaten !== lokasiFilter) {
        return false;
      }
      if (statusFilter === "negeri" && !isNegeriStatus(item.status)) {
        return false;
      }
      if (statusFilter === "swasta" && isNegeriStatus(item.status)) {
        return false;
      }
      if (!q) return true;

      return (
        item.name.toLowerCase().includes(q) ||
        item.code.toLowerCase().includes(q) ||
        item.kabupaten.toLowerCase().includes(q) ||
        item.address.toLowerCase().includes(q) ||
        item.programs.some((prog) => prog.toLowerCase().includes(q))
      );
    });

    return matches.sort((a, b) => {
      if (matchTestFilter && savedSurvey) {
        const scoreDiff =
          getTestMatchScore(b, savedSurvey.fieldId, educationLevel) -
          getTestMatchScore(a, savedSurvey.fieldId, educationLevel);
        if (scoreDiff !== 0) return scoreDiff;
      }
      if (sortOrder === "name") {
        return a.name.localeCompare(b.name, "id");
      }
      return (
        a.estimatedDistanceKm - b.estimatedDistanceKm ||
        a.name.localeCompare(b.name, "id")
      );
    });
  }, [
    activeTab,
    allInstitutions,
    educationLevel,
    lokasiFilter,
    matchTestFilter,
    onlyAudited,
    savedSurvey,
    searchQuery,
    sortOrder,
    statusFilter,
  ]);

  const totalPages = Math.max(1, Math.ceil(filteredList.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const paginatedItems = useMemo(() => {
    const start = (safePage - 1) * PAGE_SIZE;
    return filteredList.slice(start, start + PAGE_SIZE);
  }, [filteredList, safePage]);

  const { gridRef: cardsGridRef, transitionToPage } = useCardDeckTransition(
    ".katalog-card-item",
    safePage,
    `${activeTab}-${lokasiFilter}-${statusFilter}-${onlyAudited}-${matchTestFilter}-${sortOrder}-${searchQuery}`
  );

  const selectedDetailInstitution = useMemo(
    () => allInstitutions.find((item) => item.id === selectedDetailId) ?? null,
    [allInstitutions, selectedDetailId]
  );

  const compareItems = useMemo(
    () =>
      compareIds
        .map((id) => allInstitutions.find((item) => item.id === id))
        .filter((item): item is UnifiedKatalogInstitution => Boolean(item)),
    [allInstitutions, compareIds]
  );

  const handleToggleCompare = (institution: UnifiedKatalogInstitution) => {
    const exists = compareIds.includes(institution.id);
    if (exists) {
      setCompareIds((prev) => prev.filter((id) => id !== institution.id));
      showToast(`${institution.name} dihapus dari daftar bandingkan.`);
      return;
    }
    if (compareIds.length >= MAX_COMPARE) {
      showToast(`Maksimal ${MAX_COMPARE} institusi dapat dibandingkan sekaligus.`);
      return;
    }
    setCompareIds((prev) => [...prev, institution.id]);
    showToast(`${institution.name} ditambahkan ke perbandingan.`);
  };

  const handleKabupatenOriginChange = (nextKab: string) => {
    setManualKabupaten(nextKab);
    showToast(`Jarak dihitung ulang dari ${nextKab}.`);
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

  const handleResetFilters = () => {
    setActiveTab("all");
    setLokasiFilter("all");
    setStatusFilter("all");
    setOnlyAudited(false);
    setMatchTestFilter(false);
    setShowTestPrompt(false);
    setSortOrder("distance");
    setSearchQuery("");
    setCurrentPage(1);
  };

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      let split: SplitText | null = null;

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
          split = SplitText.create(heroTitleRef.current, { type: "words" });
          gsap.from(split.words, {
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
              end: "500px top",
              scrub: 0.6,
            },
          });
        }

        const counters = gsap.utils.toArray<HTMLElement>(".katalog-stat-num");
        counters.forEach((el) => {
          const target = Number(el.dataset.target || "0");
          const holder = { value: 0 };
          gsap.to(holder, {
            value: target,
            duration: 0.75,
            ease: "power2.out",
            onUpdate: () => {
              el.textContent = String(Math.round(holder.value));
            },
            onComplete: () => {
              el.textContent = String(target);
            },
          });
        });

        const chapters = gsap.utils.toArray<HTMLElement>(".katalog-reveal");
        chapters.forEach((section) => {
          gsap.from(section, {
            y: 20,
            opacity: 0,
            duration: 0.5,
            ease: "power2.out",
            immediateRender: false,
            clearProps: "transform,opacity",
            scrollTrigger: {
              trigger: section,
              start: "top 90%",
              once: true,
            },
          });
        });
      });

      return () => {
        if (split) split.revert();
        mm.revert();
      };
    },
    { scope: containerRef }
  );

  const tabOptions: { id: KatalogTab; label: string; count: number }[] = [
    { id: "all", label: "Semua Lembaga", count: counts.all },
    { id: "perguruan-tinggi", label: "Perguruan Tinggi", count: counts.pt },
    { id: "smk", label: "SMK Kejuruan", count: counts.smk },
    { id: "sma", label: "SMA", count: counts.sma },
  ];

  const hasActiveFilters =
    activeTab !== "all" ||
    lokasiFilter !== "all" ||
    statusFilter !== "all" ||
    onlyAudited ||
    matchTestFilter ||
    searchQuery.trim().length > 0;

  return (
    <div
      ref={containerRef}
      className="min-h-screen flex flex-col neopop-canvas-subtle text-[#141413] relative selection:bg-[#B8F348] selection:text-[#141413]"
    >
      {/* Scroll-Craft Top Progress Bar */}
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

      {/* High-Contrast Feedback Toast */}
      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          className="fixed top-24 right-4 sm:right-8 z-50 border-2 border-[#141413] shadow-[4px_4px_0px_#B8F348] px-5 py-3.5 rounded-2xl bg-[#141413] text-white flex items-center gap-3 max-w-sm"
        >
          <span className="w-2.5 h-2.5 rounded-full bg-[#B8F348] shrink-0" />
          <span className="text-sm font-display font-bold text-white">
            {toastMessage}
          </span>
        </div>
      )}

      <Navbar />

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10 sm:space-y-12 pb-28">
        {/* Breadcrumb */}
        <nav
          aria-label="Navigasi halaman"
          className="flex flex-wrap items-center gap-2 text-xs sm:text-sm font-semibold text-[#52514E]"
        >
          <Link href="/" className="hover:text-[#141413] underline">
            Beranda
          </Link>
          <span aria-hidden="true">/</span>
          <span className="px-2.5 py-0.5 rounded-lg bg-[#FFBE2E] border border-[#141413] text-[#141413] font-bold">
            Katalog Kampus &amp; Sekolah Bali
          </span>
        </nav>

        {/* Hero Section */}
        <section className="relative overflow-hidden bg-white border-2 border-[#141413] rounded-3xl shadow-[6px_6px_0px_#141413] p-6 sm:p-10 space-y-6">
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

          <div className="relative z-10 space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="px-3.5 py-1 rounded-xl bg-[#141413] text-[#B8F348] text-xs sm:text-sm font-bold border-2 border-[#141413]">
                Direktori &amp; Audit Resmi Bali
              </span>
              <span className="text-xs sm:text-sm font-semibold text-[#52514E]">
                Rujukan PDDIKTI, BAN-PT &amp; BAN-SM
              </span>
            </div>

            <div className="space-y-3">
              <h1
                ref={heroTitleRef}
                className="text-3xl sm:text-4xl lg:text-[2.75rem] font-display font-black text-[#141413] leading-[1.12] tracking-tight"
              >
                Katalog Kampus, SMK &amp; SMA se-Bali
              </h1>
              <p className="text-base text-[#52514E] leading-[1.65] max-w-[65ch]">
                Cari perguruan tinggi, SMK, maupun SMA di 9 kabupaten dan kota Bali, periksa sorotan biaya UKT serta akreditasi resmi, lalu bandingkan hingga 3 pilihan secara berdampingan.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
              <div className="p-4 rounded-2xl bg-[#FAF7F2] border-2 border-[#141413]">
                <p
                  className="katalog-stat-num text-2xl sm:text-3xl font-display font-black text-[#141413]"
                  data-target={counts.all}
                >
                  {counts.all}
                </p>
                <p className="text-xs sm:text-sm font-semibold text-[#52514E] mt-0.5">
                  Total Lembaga Terdaftar
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-[#FAF7F2] border-2 border-[#141413]">
                <p
                  className="katalog-stat-num text-2xl sm:text-3xl font-display font-black text-[#141413]"
                  data-target={counts.audited}
                >
                  {counts.audited}
                </p>
                <p className="text-xs sm:text-sm font-semibold text-[#52514E] mt-0.5">
                  Kampus &amp; SMK Audit Biaya Lengkap
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-[#FAF7F2] border-2 border-[#141413]">
                <p
                  className="katalog-stat-num text-2xl sm:text-3xl font-display font-black text-[#141413]"
                  data-target={9}
                >
                  9
                </p>
                <p className="text-xs sm:text-sm font-semibold text-[#52514E] mt-0.5">
                  Kabupaten &amp; Kota di Bali
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Category Tabs + Multi Filter Strip */}
        <section className="katalog-reveal space-y-5">
          <div
            role="tablist"
            aria-label="Filter kategori lembaga pendidikan"
            className="flex flex-wrap gap-2.5"
          >
            {tabOptions.map((tab) => {
              const selected = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2.5 rounded-xl border-2 border-[#141413] font-display font-bold text-xs sm:text-sm transition-all cursor-pointer flex items-center gap-2 ${
                    selected
                      ? "bg-[#141413] text-[#B8F348] shadow-[3px_3px_0px_#3B66FF]"
                      : "bg-white text-[#141413] hover:bg-[#F0ECE1] shadow-[3px_3px_0px_#141413]"
                  }`}
                >
                  <span>{tab.label}</span>
                  <span
                    className={`px-2 py-0.5 rounded-md font-mono text-xs font-bold ${
                      selected
                        ? "bg-[#B8F348] text-[#141413]"
                        : "bg-[#F0ECE1] text-[#141413]"
                    }`}
                  >
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="bg-white border-2 border-[#141413] rounded-2xl shadow-[4px_4px_0px_#141413] p-5 space-y-4">
            {/* Baris 1: Pencarian, Wilayah, dan Lokasi Asal */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
              {/* Search */}
              <div className="md:col-span-4 space-y-1.5">
                <label
                  htmlFor="katalog-search"
                  className="block text-xs sm:text-sm font-bold text-[#141413]"
                >
                  Cari Sekolah, Kampus, Prodi, atau NPSN
                </label>
                <input
                  id="katalog-search"
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Contoh: Udayana, SMKN 1, Kedokteran, Tabanan..."
                  className="w-full min-h-[44px] px-3.5 py-2 rounded-xl border-2 border-[#141413] bg-white text-sm sm:text-base text-[#141413] placeholder:text-[#52514E]/70 focus:outline-none focus:ring-2 focus:ring-[#3B66FF]"
                />
              </div>

              {/* Lokasi Kampus */}
              <div className="md:col-span-3 space-y-1.5">
                <label
                  htmlFor="katalog-lokasi"
                  className="block text-xs sm:text-sm font-bold text-[#141413]"
                >
                  Wilayah Lokasi
                </label>
                <select
                  id="katalog-lokasi"
                  value={lokasiFilter}
                  onChange={(e) => setLokasiFilter(e.target.value)}
                  className="w-full min-h-[44px] px-3 py-2 rounded-xl border-2 border-[#141413] bg-[#FAF7F2] text-sm font-semibold text-[#141413] focus:outline-none focus:ring-2 focus:ring-[#3B66FF]"
                >
                  <option value="all">Semua 9 Wilayah</option>
                  {Object.keys(BALI_KABUPATEN_COORDS).map((kab) => (
                    <option key={kab} value={kab}>
                      {kab}
                    </option>
                  ))}
                </select>
              </div>

              {/* Lokasi Asal (Alamat Manual + GPS Opsional) */}
              <div className="md:col-span-5">
                <LocationOriginControl
                  id="katalog-asal"
                  label="Hitung Jarak dari Alamat / Lokasi Anda"
                  origin={origin}
                  isDetecting={isDetecting}
                  isGeocoding={isGeocoding}
                  locationNote={locationNote}
                  onChangeManualKabupaten={handleKabupatenOriginChange}
                  onSubmitManualAddress={handleManualAddressSubmit}
                  onDetectLocation={handleDetectLocation}
                  compact
                />
              </div>
            </div>

            {/* Baris 2: Filter Status, Audit, Hasil Tes & Urutan */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#141413]/15">
              <div className="flex flex-wrap items-center gap-2.5">
                <div className="inline-flex bg-[#FAF7F2] p-1 rounded-xl border-2 border-[#141413]">
                  {(
                    [
                      { id: "all", label: "Semua Status" },
                      { id: "negeri", label: "Negeri" },
                      { id: "swasta", label: "Swasta" },
                    ] as { id: StatusFilter; label: string }[]
                  ).map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setStatusFilter(opt.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-bold transition-colors cursor-pointer ${
                        statusFilter === opt.id
                          ? "bg-[#141413] text-white"
                          : "text-[#52514E] hover:text-[#141413]"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>

                <span
                  aria-hidden="true"
                  className="hidden sm:block h-6 w-px bg-[#141413]/20 mx-0.5"
                />

                <button
                  type="button"
                  onClick={() => setOnlyAudited((prev) => !prev)}
                  aria-pressed={onlyAudited}
                  className={`px-3 py-1.5 rounded-xl border-2 border-[#141413] text-xs sm:text-sm font-bold transition-colors cursor-pointer inline-flex items-center gap-1.5 ${
                    onlyAudited
                      ? "bg-[#3B66FF] text-white shadow-[2px_2px_0px_#141413]"
                      : "bg-[#FAF7F2] text-[#141413] hover:bg-[#F0ECE1]"
                  }`}
                >
                  <span>Audit Lengkap</span>
                  <span
                    className={`px-1.5 py-0.5 rounded font-mono text-[11px] font-bold ${
                      onlyAudited
                        ? "bg-white text-[#141413]"
                        : "bg-[#F0ECE1] text-[#141413]"
                    }`}
                  >
                    {counts.audited}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (!savedSurvey) {
                      setShowTestPrompt((prev) => !prev);
                      return;
                    }
                    setShowTestPrompt(false);
                    setMatchTestFilter((prev) => !prev);
                  }}
                  aria-pressed={matchTestFilter}
                  title={
                    savedSurvey
                      ? "Saring sekolah/kampus sesuai bidang dan jenjang hasil tes Anda"
                      : "Kerjakan Tes Keminatan terlebih dahulu untuk membuka filter ini"
                  }
                  className={`px-3 py-1.5 rounded-xl border-2 border-[#141413] text-xs sm:text-sm font-bold transition-colors cursor-pointer inline-flex items-center gap-1.5 ${
                    matchTestFilter && savedSurvey
                      ? "bg-[#B8F348] text-[#141413] shadow-[2px_2px_0px_#141413]"
                      : savedSurvey
                      ? "bg-white text-[#141413] hover:bg-[#F0ECE1]"
                      : "bg-[#F0ECE1] text-[#52514E] hover:bg-[#E7E1D3]"
                  }`}
                >
                  {!savedSurvey && (
                    <svg
                      aria-hidden="true"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      className="w-3.5 h-3.5"
                    >
                      <rect x="4" y="11" width="16" height="10" rx="2" />
                      <path d="M8 11V7a4 4 0 1 1 8 0v4" />
                    </svg>
                  )}
                  <span>Sesuai Hasil Tes</span>
                </button>
              </div>

              <div className="inline-flex items-center gap-2 ml-auto">
                <label
                  htmlFor="katalog-sort"
                  className="text-xs sm:text-sm font-bold text-[#52514E]"
                >
                  Urutkan:
                </label>
                <select
                  id="katalog-sort"
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value as SortOrder)}
                  className="px-3 py-1.5 rounded-xl border-2 border-[#141413] bg-white text-xs sm:text-sm font-bold text-[#141413]"
                >
                  <option value="distance">Jarak Terdekat</option>
                  <option value="name">Nama (A - Z)</option>
                </select>
              </div>
            </div>

            {/* Baris 3: Footer Status Hasil & Reset */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-2.5 border-t border-[#141413]/10">
              <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs sm:text-sm">
                <span className="font-semibold text-[#52514E]">
                  Ditemukan {filteredList.length} institusi (acuan: {originLabel})
                </span>
                {matchTestFilter && savedSurvey && (
                  <span className="font-semibold text-[#141413]">
                    &middot; Bidang: {getFieldLabelById(savedSurvey.fieldId)} (
                    {educationLevel ?? "Semua Jenjang"}){" "}
                    <Link
                      href="/hasil-analisis"
                      className="underline text-[#3B66FF] hover:text-[#141413]"
                    >
                      Detail Tes
                    </Link>
                  </span>
                )}
              </div>

              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="text-xs sm:text-sm font-bold text-[#FF5E4D] underline hover:text-[#141413] cursor-pointer ml-auto"
                >
                  Reset Filter
                </button>
              )}
            </div>

            {showTestPrompt && !savedSurvey && (
              <div className="p-3.5 rounded-xl bg-[#FAF7F2] border-2 border-[#141413] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <p className="text-xs sm:text-sm text-[#52514E]">
                  <strong className="text-[#141413]">Filter Sesuai Hasil Tes belum terbuka.</strong>{" "}
                  Kerjakan Tes Keminatan agar sistem menyaring sekolah sesuai bidang minat dan jenjangmu.
                </p>
                <div className="flex items-center gap-2 shrink-0">
                  <Link
                    href="/tes-keminatan"
                    className="px-3 py-1.5 rounded-xl bg-[#B8F348] hover:bg-[#c8f76b] border-2 border-[#141413] shadow-[2px_2px_0px_#141413] text-xs font-display font-bold text-[#141413]"
                  >
                    Kerjakan Tes
                  </Link>
                  <button
                    type="button"
                    onClick={() => setShowTestPrompt(false)}
                    className="px-2.5 py-1.5 rounded-xl bg-white border-2 border-[#141413] text-xs font-bold text-[#52514E] hover:text-[#141413] cursor-pointer"
                  >
                    Tutup
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Catalog Grid or Empty State */}
        <section aria-labelledby="heading-hasil-katalog" className="space-y-6">
          <h2 id="heading-hasil-katalog" className="sr-only">
            Daftar Kampus dan Sekolah
          </h2>

          {paginatedItems.length === 0 ? (
            <div className="bg-white border-2 border-dashed border-[#141413]/50 rounded-3xl p-10 text-center space-y-4">
              <h3 className="text-xl font-display font-extrabold text-[#141413]">
                Tidak ada kampus atau sekolah yang sesuai filter
              </h3>
              <p className="text-base text-[#52514E] max-w-md mx-auto leading-relaxed">
                Coba bersihkan kata kunci pencarian atau pilih Semua Wilayah agar seluruh direktori Bali tampil kembali.
              </p>
              <button
                type="button"
                onClick={handleResetFilters}
                className="neo-btn px-5 py-2.5 rounded-xl bg-[#B8F348] text-sm sm:text-base font-display font-bold text-[#141413] cursor-pointer"
              >
                Reset Semua Filter
              </button>
            </div>
          ) : (
            <div className="relative overflow-x-clip py-2 px-1 -mx-1">
              {/* Lapisan aksen tumpukan kartu di belakang grid */}
              <div
                aria-hidden="true"
                className="pointer-events-none hidden sm:block absolute inset-x-3 top-4 -bottom-1 rounded-3xl border-2 border-[#141413]/20 bg-[#F0ECE1]/70 translate-x-1.5 translate-y-1.5"
              />
              <div
                ref={cardsGridRef}
                className="relative grid grid-cols-1 md:grid-cols-2 gap-5"
              >
                {paginatedItems.map((item) => {
                const isNegeri = isNegeriStatus(item.status);
                const isCompared = compareIds.includes(item.id);
                const codeLabel =
                  item.category === "perguruan-tinggi" ? "Kode PT" : "NPSN";
                const visiblePrograms = item.programs.slice(0, MAX_CARD_CHIPS);
                const extraProgramCount = Math.max(
                  0,
                  item.programs.length - MAX_CARD_CHIPS
                );

                return (
                  <article
                    key={item.id}
                    className="katalog-card-item bg-white border-2 border-[#141413] rounded-2xl shadow-[4px_4px_0px_#141413] p-5 sm:p-6 flex flex-col justify-between gap-4 transition-transform duration-150 hover:-translate-y-0.5"
                  >
                    <div className="space-y-3.5">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <span
                            className={`px-2.5 py-1 rounded-lg border-2 border-[#141413] text-xs font-bold ${
                              isNegeri ? "bg-[#B8F348]" : "bg-[#F0ECE1]"
                            }`}
                          >
                            {item.bentuk} &middot; {item.status}
                          </span>
                          {item.hasAudit && (
                            <span className="px-2.5 py-1 rounded-lg bg-[#3B66FF] text-white border-2 border-[#141413] text-xs font-bold">
                              Audit Lengkap
                            </span>
                          )}
                          {savedSurvey &&
                            getTestMatchScore(
                              item,
                              savedSurvey.fieldId,
                              educationLevel
                            ) === 2 && (
                              <span className="px-2.5 py-1 rounded-lg bg-[#FFBE2E] text-[#141413] border-2 border-[#141413] text-xs font-bold">
                                Cocok Hasil Tes
                              </span>
                            )}
                        </div>

                        <span
                          title={`Estimasi jarak dari ${originLabel}`}
                          className={`px-2.5 py-1 rounded-lg border border-[#141413] text-xs font-bold ${
                            item.estimatedDistanceKm <= 15
                              ? "bg-[#1AD598]/25 text-[#141413]"
                              : "bg-white text-[#52514E]"
                          }`}
                        >
                          ~{item.estimatedDistanceKm} km
                        </span>
                      </div>

                      <div className="space-y-1">
                        <h3 className="text-lg sm:text-xl font-display font-bold text-[#141413] leading-snug">
                          {item.name}
                        </h3>
                        <p className="text-sm text-[#52514E] leading-relaxed">
                          <strong className="text-[#141413]">
                            {item.kabupaten}
                          </strong>{" "}
                          - {item.address}
                        </p>
                        <p className="text-xs font-mono font-semibold text-[#52514E]">
                          {codeLabel}: {item.code}
                        </p>
                      </div>

                      {item.hasAudit && (
                        <div className="p-3 rounded-xl bg-[#FAF7F2] border border-[#141413]/25 text-xs sm:text-sm space-y-1">
                          <p className="font-bold text-[#141413]">
                            Akreditasi: {item.auditSpotlights[0].accreditation}
                          </p>
                          <p className="text-[#52514E]">
                            {item.auditSpotlights[0].tuitionFeeText}
                          </p>
                        </div>
                      )}

                      <div className="space-y-2">
                        <p className="text-xs font-bold uppercase tracking-wide text-[#52514E]">
                          Program Tersedia ({item.programs.length})
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {visiblePrograms.map((prog) => (
                            <span
                              key={prog}
                              className="px-2.5 py-1 rounded-lg bg-[#FAF7F2] border border-[#141413]/25 text-xs font-medium text-[#141413]"
                            >
                              {prog}
                            </span>
                          ))}
                          {extraProgramCount > 0 && (
                            <button
                              type="button"
                              onClick={() => setSelectedDetailId(item.id)}
                              className="px-2.5 py-1 rounded-lg bg-[#FFBE2E] border border-[#141413] text-xs font-bold text-[#141413] cursor-pointer hover:bg-[#ffd262]"
                            >
                              +{extraProgramCount} lainnya
                            </button>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-[#141413]/15 flex flex-wrap items-center justify-between gap-2">
                      <button
                        type="button"
                        onClick={() => handleToggleCompare(item)}
                        className={`px-3.5 py-2 rounded-xl border-2 border-[#141413] text-xs sm:text-sm font-display font-bold transition-colors cursor-pointer ${
                          isCompared
                            ? "bg-[#141413] text-[#B8F348]"
                            : "bg-[#FAF7F2] text-[#141413] hover:bg-[#F0ECE1]"
                        }`}
                      >
                        {isCompared ? "Dipilih Bandingkan" : "+ Bandingkan"}
                      </button>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setSelectedDetailId(item.id)}
                          className="px-3.5 py-2 rounded-xl bg-[#B8F348] hover:bg-[#c8f76b] border-2 border-[#141413] shadow-[2px_2px_0px_#141413] text-xs sm:text-sm font-display font-bold text-[#141413] cursor-pointer"
                        >
                          Lihat Detail
                        </button>
                        <a
                          href={item.mapsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="Buka rute Google Maps dari lokasi Anda"
                          className="px-3 py-2 rounded-xl bg-white hover:bg-[#F0ECE1] border-2 border-[#141413] text-xs sm:text-sm font-display font-bold text-[#141413]"
                        >
                          Rute Maps
                        </a>
                      </div>
                    </div>
                  </article>
                );
              })}
              </div>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
              <p className="text-sm font-semibold text-[#52514E]">
                Menampilkan {(safePage - 1) * PAGE_SIZE + 1} -{" "}
                {Math.min(safePage * PAGE_SIZE, filteredList.length)} dari{" "}
                {filteredList.length} institusi
              </p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={safePage <= 1}
                  onClick={() =>
                    transitionToPage(Math.max(1, safePage - 1), -1, setCurrentPage)
                  }
                  className="px-4 py-2 rounded-xl border-2 border-[#141413] bg-white text-sm font-display font-bold text-[#141413] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#F0ECE1] cursor-pointer shadow-[2px_2px_0px_#141413]"
                >
                  Sebelumnya
                </button>
                <span className="px-3 py-2 rounded-xl bg-[#FAF7F2] border-2 border-[#141413] text-xs sm:text-sm font-mono font-bold text-[#141413]">
                  Hal {safePage} / {totalPages}
                </span>
                <button
                  type="button"
                  disabled={safePage >= totalPages}
                  onClick={() =>
                    transitionToPage(
                      Math.min(totalPages, safePage + 1),
                      1,
                      setCurrentPage
                    )
                  }
                  className="px-4 py-2 rounded-xl border-2 border-[#141413] bg-white text-sm font-display font-bold text-[#141413] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#F0ECE1] cursor-pointer shadow-[2px_2px_0px_#141413]"
                >
                  Berikutnya
                </button>
              </div>
            </div>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full bg-[#141413] text-white border-t-2 border-[#141413] py-8 px-4 sm:px-6 lg:px-8 mt-8">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left text-xs sm:text-sm text-[#F0ECE1]/85">
          <div>
            <span className="font-display font-black text-white text-base block">
              KertaMarga Bali
            </span>
            <span>Katalog Institusi Pendidikan se-Bali</span>
          </div>
          <div className="flex flex-wrap justify-center gap-4 font-semibold">
            <Link href="/" className="hover:underline">
              Beranda
            </Link>
            <Link href="/eksplorasi" className="hover:underline">
              Eksplorasi Minat
            </Link>
            <Link href="/peta-bidang" className="hover:underline">
              Peta Bidang
            </Link>
            <Link href="/ai-navigator" className="hover:underline">
              AI Navigator
            </Link>
          </div>
        </div>
      </footer>

      {/* Floating Compare Dock */}
      {compareItems.length > 0 && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-[calc(100vw-2rem)] max-w-3xl bg-[#141413] text-white border-2 border-[#141413] shadow-[0_6px_0_#B8F348] rounded-2xl px-4 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-0.5 min-w-0">
            <p className="text-xs sm:text-sm font-display font-bold text-[#B8F348]">
              Bandingkan Institusi ({compareItems.length}/{MAX_COMPARE})
            </p>
            <p className="text-xs text-[#F0ECE1] truncate">
              {compareItems.map((i) => i.name).join(" vs ")}
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setCompareIds([])}
              className="px-3 py-2 rounded-xl border border-[#F0ECE1]/40 text-xs font-bold text-[#F0ECE1] hover:bg-white/10 cursor-pointer"
            >
              Bersihkan
            </button>
            <button
              type="button"
              onClick={() => setIsCompareOpen(true)}
              className="px-4 py-2 rounded-xl bg-[#B8F348] text-[#141413] border-2 border-[#141413] text-xs sm:text-sm font-display font-black cursor-pointer hover:bg-[#c8f76b]"
            >
              Bandingkan Sekarang
            </button>
          </div>
        </div>
      )}

      {/* Detail Slide-Over Drawer */}
      <InstitutionDetailDrawer
        institution={selectedDetailInstitution}
        kabupatenOrigin={origin.kabupaten}
        locationOrigin={origin}
        originLabel={originLabel}
        isCompared={
          selectedDetailInstitution
            ? compareIds.includes(selectedDetailInstitution.id)
            : false
        }
        onToggleCompare={handleToggleCompare}
        onClose={() => setSelectedDetailId(null)}
      />

      {/* Compare Table Modal */}
      <CompareInstitutionsModal
        isOpen={isCompareOpen}
        items={compareItems}
        kabupatenOrigin={origin.kabupaten}
        locationOrigin={origin}
        originLabel={originLabel}
        onRemoveItem={(id) =>
          setCompareIds((prev) => prev.filter((item) => item !== id))
        }
        onClose={() => setIsCompareOpen(false)}
      />
    </div>
  );
}

export default function KatalogInstitusiPage() {
  return (
    <Suspense fallback={<KatalogSkeleton />}>
      <KatalogPageContent />
    </Suspense>
  );
}
