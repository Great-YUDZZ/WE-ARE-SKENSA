"use client";

import React, { useEffect, useMemo, useState } from "react";
import LocationOriginControl from "@/components/LocationOriginControl";
import {
  BALI_KABUPATEN_COORDS,
  UserLocationOrigin,
  formatOriginLabel,
} from "@/data/catalog";
import {
  BaliEntityCategory,
  EnrichedBaliEducationEntity,
  getBaliEntitiesForField,
} from "@/data/bali-institutions";
import { useCardDeckTransition } from "@/lib/useCardDeckTransition";

interface InstitutionDirectorySectionProps {
  fieldId: string;
  fieldName: string;
  kabupatenOrigin: string;
  locationOrigin?: UserLocationOrigin;
  isDetectingLocation?: boolean;
  isGeocodingLocation?: boolean;
  locationNote?: string | null;
  onChangeKabupatenOrigin: (kabupaten: string) => void;
  onSubmitManualAddress?: (
    address: string,
    preferredKabupaten?: string
  ) => void | Promise<unknown>;
  onDetectLocation?: () => void | Promise<unknown>;
}

type StatusFilter = "all" | "negeri" | "swasta";

const PAGE_SIZE = 6;
const MAX_VISIBLE_CHIPS = 4;

const CATEGORY_TABS: {
  id: BaliEntityCategory;
  label: string;
  hint: string;
}[] = [
  {
    id: "perguruan-tinggi",
    label: "Perguruan Tinggi",
    hint: "Universitas, institut, politeknik, dan sekolah tinggi dengan program studi relevan.",
  },
  {
    id: "smk",
    label: "SMK Kejuruan",
    hint: "Sekolah menengah kejuruan negeri dan swasta dengan program keahlian terkait.",
  },
  {
    id: "sma",
    label: "SMA (Persiapan S1)",
    hint: "Jalur pendidikan menengah umum di Bali sebagai landasan akademik menuju D4 dan S1.",
  },
];

function isNegeriStatus(status: string): boolean {
  return status.toLowerCase().includes("negeri");
}

function InstitutionCard({
  item,
  originLabel,
}: {
  item: EnrichedBaliEducationEntity;
  originLabel: string;
}) {
  const [expanded, setExpanded] = useState(false);
  const negeri = isNegeriStatus(item.status);
  const visiblePrograms = expanded
    ? item.programs
    : item.programs.slice(0, MAX_VISIBLE_CHIPS);
  const hiddenCount = Math.max(0, item.programs.length - MAX_VISIBLE_CHIPS);
  const codeLabel = item.category === "perguruan-tinggi" ? "Kode PT" : "NPSN";

  return (
    <article className="inst-card-anim bg-white border-2 border-[#141413] rounded-2xl shadow-[4px_4px_0px_#141413] p-5 sm:p-6 flex flex-col justify-between gap-4 transition-transform duration-150 hover:-translate-y-0.5">
      <div className="space-y-3.5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`px-2.5 py-1 rounded-lg border-2 border-[#141413] text-xs font-bold ${
                negeri
                  ? "bg-[#B8F348] text-[#141413]"
                  : "bg-[#F0ECE1] text-[#141413]"
              }`}
            >
              {item.bentuk} &middot; {item.status}
            </span>
            <span className="px-2.5 py-1 rounded-lg border border-[#141413]/30 bg-[#FAF7F2] font-mono text-xs font-semibold text-[#52514E]">
              {codeLabel}: {item.code}
            </span>
          </div>

          <span
            className={`px-2.5 py-1 rounded-lg border border-[#141413] text-xs font-bold ${
              item.estimatedDistanceKm <= 15
                ? "bg-[#1AD598]/25 text-[#141413]"
                : "bg-white text-[#52514E]"
            }`}
          >
            ~{item.estimatedDistanceKm} km dari {originLabel}
          </span>
        </div>

        <div className="space-y-1">
          <h3 className="text-lg sm:text-xl font-display font-bold text-[#141413] leading-snug">
            {item.name}
          </h3>
          <p className="text-sm text-[#52514E] leading-relaxed">
            <span className="font-semibold text-[#141413]">{item.kabupaten}</span>
            {" - "}
            {item.address}
          </p>
        </div>

        <div className="space-y-2 pt-1">
          <p className="text-xs font-bold uppercase tracking-wide text-[#52514E]">
            {item.category === "perguruan-tinggi"
              ? `Program Studi (${item.programs.length})`
              : item.category === "smk"
              ? `Program Keahlian (${item.programs.length})`
              : "Fokus Jalur Studi"}
          </p>
          <div className="flex flex-wrap gap-1.5">
            {visiblePrograms.map((programName) => (
              <span
                key={programName}
                className="px-2.5 py-1 rounded-lg bg-[#FAF7F2] border border-[#141413]/25 text-xs sm:text-sm font-medium text-[#141413]"
              >
                {programName}
              </span>
            ))}
            {hiddenCount > 0 && (
              <button
                type="button"
                onClick={() => setExpanded((prev) => !prev)}
                className="px-2.5 py-1 rounded-lg bg-[#FFBE2E] border-2 border-[#141413] text-xs font-bold text-[#141413] hover:bg-[#ffd262] transition-colors cursor-pointer"
              >
                {expanded ? "Ringkas" : `+${hiddenCount} lainnya`}
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="pt-3 border-t border-[#141413]/15 flex items-center justify-between gap-3">
        <span className="text-xs font-medium text-[#52514E]">
          {item.category === "sma"
            ? "Rujukan jalur persiapan akademik"
            : "Tersedia untuk bidang ini"}
        </span>
        <a
          href={item.mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-[#B8F348] border-2 border-[#141413] shadow-[2px_2px_0px_#141413] text-xs sm:text-sm font-display font-bold text-[#141413] transition-colors shrink-0"
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            className="w-4 h-4"
          >
            <path d="M12 21s-6-5.33-6-10a6 6 0 1 1 12 0c0 4.67-6 10-6 10Z" />
            <circle cx="12" cy="11" r="2.2" />
          </svg>
          <span>Rute Maps</span>
        </a>
      </div>
    </article>
  );
}

export default function InstitutionDirectorySection({
  fieldId,
  fieldName,
  kabupatenOrigin,
  locationOrigin,
  isDetectingLocation = false,
  isGeocodingLocation = false,
  locationNote = null,
  onChangeKabupatenOrigin,
  onSubmitManualAddress,
  onDetectLocation,
}: InstitutionDirectorySectionProps) {
  const [activeCategory, setActiveCategory] =
    useState<BaliEntityCategory>("perguruan-tinggi");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const effectiveOrigin: UserLocationOrigin = useMemo(
    () =>
      locationOrigin ?? {
        kabupaten: kabupatenOrigin,
        source: "manual",
      },
    [kabupatenOrigin, locationOrigin]
  );

  const originLabel = useMemo(
    () => formatOriginLabel(effectiveOrigin),
    [effectiveOrigin]
  );

  const groupedEntities = useMemo(
    () => getBaliEntitiesForField(fieldId, effectiveOrigin),
    [fieldId, effectiveOrigin]
  );

  // Reset pagination saat filter atau bidang berubah
  useEffect(() => {
    setCurrentPage(1);
  }, [activeCategory, statusFilter, searchQuery, fieldId]);

  const activeList = useMemo(() => {
    const raw =
      activeCategory === "perguruan-tinggi"
        ? groupedEntities.perguruanTinggi
        : activeCategory === "smk"
        ? groupedEntities.smk
        : groupedEntities.sma;

    const queryLower = searchQuery.trim().toLowerCase();

    return raw.filter((item) => {
      if (statusFilter === "negeri" && !isNegeriStatus(item.status)) {
        return false;
      }
      if (statusFilter === "swasta" && isNegeriStatus(item.status)) {
        return false;
      }
      if (!queryLower) return true;

      return (
        item.name.toLowerCase().includes(queryLower) ||
        item.kabupaten.toLowerCase().includes(queryLower) ||
        item.address.toLowerCase().includes(queryLower) ||
        item.bentuk.toLowerCase().includes(queryLower) ||
        item.programs.some((p) => p.toLowerCase().includes(queryLower))
      );
    });
  }, [activeCategory, groupedEntities, searchQuery, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(activeList.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const paginatedItems = useMemo(() => {
    const start = (safePage - 1) * PAGE_SIZE;
    return activeList.slice(start, start + PAGE_SIZE);
  }, [activeList, safePage]);

  const { gridRef: cardsGridRef, transitionToPage } = useCardDeckTransition(
    ".inst-card-anim",
    safePage,
    `${fieldId}-${activeCategory}-${statusFilter}-${searchQuery}`
  );

  const countsByTab: Record<BaliEntityCategory, number> = {
    "perguruan-tinggi": groupedEntities.perguruanTinggi.length,
    smk: groupedEntities.smk.length,
    sma: groupedEntities.sma.length,
  };

  const activeTabMeta =
    CATEGORY_TABS.find((t) => t.id === activeCategory) ?? CATEGORY_TABS[0];

  const handleResetFilters = () => {
    setStatusFilter("all");
    setSearchQuery("");
    setCurrentPage(1);
  };

  return (
    <section
      aria-labelledby="heading-direktori-institusi"
      className="chapter-reveal space-y-6"
    >
      {/* Section Header */}
      <div className="space-y-2">
        <span className="inline-block px-3 py-1 rounded-lg bg-[#FFBE2E] border-2 border-[#141413] text-xs sm:text-sm font-bold text-[#141413]">
          Direktori Institusi se-Bali
        </span>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <h2
              id="heading-direktori-institusi"
              className="text-2xl sm:text-[1.75rem] font-display font-extrabold text-[#141413] leading-tight"
            >
              Kampus &amp; Sekolah Relevan di Bali
            </h2>
            <p className="text-base text-[#52514E] leading-relaxed max-w-[65ch] mt-1">
              {activeCategory === "sma"
                ? `Daftar SMA se-Bali sebagai jalur persiapan akademik menuju D4 atau S1 bidang ${fieldName}.`
                : `Menampilkan ${activeList.length} institusi untuk bidang ${fieldName}, diurutkan otomatis dari lokasi terdekat.`}
            </p>
          </div>
        </div>
      </div>

      {/* Category Switch Tabs */}
      <div
        role="tablist"
        aria-label="Kategori institusi pendidikan di Bali"
        className="flex flex-wrap gap-2.5"
      >
        {CATEGORY_TABS.map((tab) => {
          const isSelected = activeCategory === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={isSelected}
              onClick={() => setActiveCategory(tab.id)}
              className={`px-4 py-2.5 rounded-xl border-2 border-[#141413] font-display font-bold text-sm sm:text-base transition-all cursor-pointer flex items-center gap-2 ${
                isSelected
                  ? "bg-[#141413] text-[#B8F348] shadow-[3px_3px_0px_#3B66FF]"
                  : "bg-white text-[#141413] hover:bg-[#F0ECE1] shadow-[3px_3px_0px_#141413]"
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`px-2 py-0.5 rounded-md text-xs font-mono font-bold ${
                  isSelected
                    ? "bg-[#B8F348] text-[#141413]"
                    : "bg-[#F0ECE1] text-[#141413]"
                }`}
              >
                {countsByTab[tab.id]}
              </span>
            </button>
          );
        })}
      </div>

      {/* Calm Single Control Bar */}
      <div className="bg-white border-2 border-[#141413] rounded-2xl shadow-[4px_4px_0px_#141413] p-4 sm:p-5 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5 items-end">
          {/* Lokasi Asal (Manual + GPS/IP) */}
          <div className="md:col-span-5">
            {onDetectLocation ? (
              <LocationOriginControl
                id="select-kabupaten-asal"
                label="Hitung Jarak dari Alamat / Lokasi Anda"
                origin={effectiveOrigin}
                isDetecting={isDetectingLocation}
                isGeocoding={isGeocodingLocation}
                locationNote={locationNote}
                onChangeManualKabupaten={onChangeKabupatenOrigin}
                onSubmitManualAddress={onSubmitManualAddress}
                onDetectLocation={onDetectLocation}
                compact
              />
            ) : (
              <div className="space-y-1.5">
                <label
                  htmlFor="select-kabupaten-asal"
                  className="block text-xs sm:text-sm font-bold text-[#141413]"
                >
                  Hitung Jarak dari Kabupaten / Kota
                </label>
                <select
                  id="select-kabupaten-asal"
                  value={kabupatenOrigin}
                  onChange={(e) => onChangeKabupatenOrigin(e.target.value)}
                  className="w-full min-h-[44px] px-3.5 py-2 rounded-xl border-2 border-[#141413] bg-[#FAF7F2] text-sm sm:text-base font-semibold text-[#141413] focus:outline-none focus:ring-2 focus:ring-[#3B66FF]"
                >
                  {Object.keys(BALI_KABUPATEN_COORDS).map((kab) => (
                    <option key={kab} value={kab}>
                      {kab}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Search Input */}
          <div className="md:col-span-4 space-y-1.5">
            <label
              htmlFor="search-institusi-bali"
              className="block text-xs sm:text-sm font-bold text-[#141413]"
            >
              Cari Nama Kampus, Sekolah, atau Prodi
            </label>
            <input
              id="search-institusi-bali"
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Contoh: Udayana, Denpasar, Rekayasa Perangkat..."
              className="w-full min-h-[44px] px-3.5 py-2 rounded-xl border-2 border-[#141413] bg-white text-sm sm:text-base text-[#141413] placeholder:text-[#52514E]/70 focus:outline-none focus:ring-2 focus:ring-[#3B66FF]"
            />
          </div>

          {/* Status Toggle */}
          <div className="md:col-span-3 space-y-1.5">
            <span className="block text-xs sm:text-sm font-bold text-[#141413]">
              Status Lembaga
            </span>
            <div className="grid grid-cols-3 gap-1.5 bg-[#FAF7F2] p-1 rounded-xl border-2 border-[#141413] min-h-[44px]">
              {(
                [
                  { id: "all", label: "Semua" },
                  { id: "negeri", label: "Negeri" },
                  { id: "swasta", label: "Swasta" },
                ] as { id: StatusFilter; label: string }[]
              ).map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setStatusFilter(opt.id)}
                  className={`rounded-lg text-xs sm:text-sm font-bold transition-colors cursor-pointer ${
                    statusFilter === opt.id
                      ? "bg-[#141413] text-white"
                      : "text-[#52514E] hover:text-[#141413]"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-[#52514E] border-t border-[#141413]/10 pt-3">
          {activeTabMeta.hint}
        </p>
      </div>

      {/* Results Grid or Clean Empty State */}
      {paginatedItems.length === 0 ? (
        <div className="bg-white border-2 border-dashed border-[#141413]/50 rounded-2xl p-8 text-center space-y-3">
          <h3 className="text-lg sm:text-xl font-display font-bold text-[#141413]">
            Belum ada institusi yang sesuai filter
          </h3>
          <p className="text-base text-[#52514E] max-w-md mx-auto">
            Coba ubah kata kunci pencarian atau pilih status lembaga Semua untuk melihat seluruh daftar pada kategori ini.
          </p>
          <button
            type="button"
            onClick={handleResetFilters}
            className="neo-btn px-5 py-2.5 rounded-xl bg-[#B8F348] text-sm sm:text-base font-display font-bold text-[#141413] cursor-pointer"
          >
            Reset Filter Pencarian
          </button>
        </div>
      ) : (
        <div className="relative overflow-x-clip py-2 px-1 -mx-1">
          <div
            aria-hidden="true"
            className="pointer-events-none hidden sm:block absolute inset-x-3 top-4 -bottom-1 rounded-3xl border-2 border-[#141413]/20 bg-[#F0ECE1]/70 translate-x-1.5 translate-y-1.5"
          />
          <div
            ref={cardsGridRef}
            className="relative grid grid-cols-1 md:grid-cols-2 gap-5"
          >
            {paginatedItems.map((item) => (
              <InstitutionCard
                key={item.id}
                item={item}
                originLabel={originLabel}
              />
            ))}
          </div>
        </div>
      )}

      {/* Clean Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
          <p className="text-sm font-semibold text-[#52514E]">
            Menampilkan {(safePage - 1) * PAGE_SIZE + 1} -{" "}
            {Math.min(safePage * PAGE_SIZE, activeList.length)} dari{" "}
            {activeList.length} institusi
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
  );
}
