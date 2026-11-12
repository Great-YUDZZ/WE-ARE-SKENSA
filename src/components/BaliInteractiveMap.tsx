"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { BaliEntityCategory } from "@/data/bali-institutions";
import {
  buildGoogleMapsDirectionsUrl,
  formatOriginLabel,
} from "@/data/catalog";
import {
  UnifiedKatalogInstitution,
  getUnifiedKatalogInstitutions,
} from "@/data/katalog-adapter";
import { useBaliLocation } from "@/lib/useBaliLocation";

interface BaliInteractiveMapProps {
  onOpenTest?: (fieldId?: string) => void;
}

type RadarCategoryFilter = "all" | BaliEntityCategory;

const MAX_QUICK_RESULTS = 4;

export default function BaliInteractiveMap({
  onOpenTest: _onOpenTest,
}: BaliInteractiveMapProps) {
  const { origin } = useBaliLocation();
  const originLabel = useMemo(() => formatOriginLabel(origin), [origin]);

  const allInstitutions = useMemo(
    () => getUnifiedKatalogInstitutions(origin),
    [origin]
  );

  const counts = useMemo(() => {
    let pt = 0;
    let smk = 0;
    let sma = 0;
    for (const item of allInstitutions) {
      if (item.category === "perguruan-tinggi") pt += 1;
      else if (item.category === "smk") smk += 1;
      else if (item.category === "sma") sma += 1;
    }
    return {
      all: allInstitutions.length,
      pt,
      smk,
      sma,
    };
  }, [allInstitutions]);

  const [categoryFilter, setCategoryFilter] =
    useState<RadarCategoryFilter>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeInstitutionId, setActiveInstitutionId] = useState<string>(
    "smk-50103118-smkn-1-denpasar"
  );

  const filteredInstitutions = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    return allInstitutions
      .filter((item) => {
        if (categoryFilter !== "all" && item.category !== categoryFilter) {
          return false;
        }
        if (!q) return true;
        return (
          item.name.toLowerCase().includes(q) ||
          item.kabupaten.toLowerCase().includes(q) ||
          item.address.toLowerCase().includes(q) ||
          item.code.toLowerCase().includes(q) ||
          item.programs.some((prog) => prog.toLowerCase().includes(q))
        );
      })
      .sort(
        (a, b) =>
          a.estimatedDistanceKm - b.estimatedDistanceKm ||
          a.name.localeCompare(b.name, "id")
      );
  }, [allInstitutions, categoryFilter, searchQuery]);

  const quickList = useMemo(
    () => filteredInstitutions.slice(0, MAX_QUICK_RESULTS),
    [filteredInstitutions]
  );

  const activeInstitution: UnifiedKatalogInstitution = useMemo(() => {
    const byFilteredId = filteredInstitutions.find(
      (item) => item.id === activeInstitutionId
    );
    if (byFilteredId) return byFilteredId;
    if (filteredInstitutions.length > 0) return filteredInstitutions[0];
    const byId = allInstitutions.find((item) => item.id === activeInstitutionId);
    return byId ?? allInstitutions[0];
  }, [activeInstitutionId, allInstitutions, filteredInstitutions]);

  const googleMapsEmbedQuery = [
    activeInstitution.name,
    activeInstitution.address,
    activeInstitution.kabupaten,
    "Bali",
  ]
    .filter(Boolean)
    .join(", ");

  const googleMapsEmbedUrl = `https://www.google.com/maps?q=${encodeURIComponent(
    googleMapsEmbedQuery
  )}&output=embed`;

  const actionRouteUrl = buildGoogleMapsDirectionsUrl(origin, activeInstitution);
  const hasHomeAddress = origin.source === "address" || origin.source === "gps";
  const codeLabel =
    activeInstitution.category === "perguruan-tinggi" ? "Kode PT" : "NPSN";

  const handleResetSearch = () => {
    setSearchQuery("");
    setCategoryFilter("all");
  };

  return (
    <div className="w-full neo-card-lg rounded-3xl overflow-hidden bg-white text-[#141413]">
      {/* Tactile Console Window Header */}
      <div className="bg-[#141413] text-white px-4 sm:px-6 py-3.5 border-b-2 border-[#141413] flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <div className="flex gap-1.5" aria-hidden="true">
            <span className="w-3 h-3 rounded-full bg-[#FF5E4D] inline-block" />
            <span className="w-3 h-3 rounded-full bg-[#FFBE2E] inline-block" />
            <span className="w-3 h-3 rounded-full bg-[#B8F348] inline-block" />
          </div>
          <span className="text-xs font-mono font-bold text-white ml-1">
            RADAR GOOGLE MAPS &bull; {allInstitutions.length} LEMBAGA PENDIDIKAN BALI
          </span>
        </div>
        <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-md bg-[#B8F348] text-[#141413]">
          {hasHomeAddress ? "ALAMAT RUMAH AKTIF" : "9 KABUPATEN/KOTA BALI"}
        </span>
      </div>

      {/* Main Content Grid (8 kolom Peta Proporsional + 4 kolom Panel Ringkas) */}
      <div className="p-4 sm:p-5 lg:p-6 grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch bg-[#FAF7F2]">
        {/* Kolom Kiri: Peta Google Maps Proporsional Sejajar Sampai Bawah (8 kolom) */}
        <div className="lg:col-span-8 flex flex-col">
          <div className="relative w-full h-[320px] sm:h-[430px] lg:h-full lg:min-h-[510px] lg:flex-1 rounded-2xl overflow-hidden border-2 border-[#141413] shadow-[4px_4px_0px_#141413] bg-[#F0ECE1]">
            <iframe
              title={`Peta Lokasi Google Maps ${activeInstitution.name}`}
              key={activeInstitution.id}
              src={googleMapsEmbedUrl}
              className="w-full h-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
        </div>

        {/* Kolom Kanan: Pencarian Ringkas + Kartu Detail Lembaga (4 kolom) */}
        <div className="lg:col-span-4 flex flex-col gap-3.5 min-w-0">
          {/* Pencarian & Daftar Pilihan Cepat */}
          <div className="bg-white border-2 border-[#141413] rounded-2xl p-3.5 shadow-[3px_3px_0px_#141413] space-y-2.5">
            <div className="space-y-2">
              <label
                htmlFor="radar-search-institution"
                className="block text-xs sm:text-sm font-bold text-[#141413]"
              >
                Cari Sekolah / Kampus di Bali
              </label>
              <input
                id="radar-search-institution"
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Ketik nama (cth: Santo Yoseph, Unud, SMKN 1)..."
                className="w-full min-h-[42px] px-3 py-1.5 rounded-xl border-2 border-[#141413] bg-[#FAF7F2] text-xs sm:text-sm text-[#141413] placeholder:text-[#52514E]/75 focus:outline-none focus:ring-2 focus:ring-[#3B66FF]"
              />
              <select
                id="radar-category-filter"
                aria-label="Filter kategori lembaga di Radar Bali"
                value={categoryFilter}
                onChange={(e) =>
                  setCategoryFilter(e.target.value as RadarCategoryFilter)
                }
                className="w-full min-h-[42px] px-3 py-1.5 rounded-xl border-2 border-[#141413] bg-[#FAF7F2] text-xs sm:text-sm font-semibold text-[#141413] focus:outline-none focus:ring-2 focus:ring-[#3B66FF] cursor-pointer"
              >
                <option value="all">Semua Lembaga ({counts.all})</option>
                <option value="perguruan-tinggi">
                  Perguruan Tinggi ({counts.pt})
                </option>
                <option value="smk">SMK Kejuruan ({counts.smk})</option>
                <option value="sma">SMA ({counts.sma})</option>
              </select>
            </div>

            {/* Daftar Pilihan Cepat (Compact Scrollable) */}
            {quickList.length === 0 ? (
              <div className="p-3 rounded-xl bg-[#FAF7F2] border border-[#141413]/30 text-center space-y-2">
                <p className="text-xs font-medium text-[#52514E]">
                  Tidak ada sekolah atau kampus yang cocok.
                </p>
                <button
                  type="button"
                  onClick={handleResetSearch}
                  className="px-3 py-1.5 rounded-lg bg-[#B8F348] border border-[#141413] text-xs font-bold text-[#141413] cursor-pointer"
                >
                  Reset Pencarian
                </button>
              </div>
            ) : (
              <div className="space-y-1.5">
                <div
                  className="space-y-1.5 max-h-[144px] overflow-y-auto pr-0.5"
                  role="listbox"
                  aria-label="Pilih titik lembaga di peta"
                >
                  {quickList.map((item) => {
                    const isSelected = item.id === activeInstitution.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        role="option"
                        aria-selected={isSelected}
                        onClick={() => setActiveInstitutionId(item.id)}
                        className={`w-full px-2.5 py-2 rounded-xl border-2 text-left transition-all cursor-pointer flex items-center justify-between gap-2 ${
                          isSelected
                            ? "bg-[#B8F348] border-[#141413] shadow-[2px_2px_0px_#141413]"
                            : "bg-[#FAF7F2] border-[#141413]/25 hover:border-[#141413] hover:bg-white"
                        }`}
                      >
                        <div className="min-w-0">
                          <p className="text-xs font-display font-bold text-[#141413] truncate">
                            {item.name}
                          </p>
                          <p className="text-xs text-[#52514E] truncate">
                            {item.bentuk} &middot; {item.kabupaten}
                          </p>
                        </div>
                        <span className="text-xs font-mono font-bold px-1.5 py-0.5 rounded-md bg-white border border-[#141413]/40 text-[#141413] shrink-0">
                          ~{item.estimatedDistanceKm} km
                        </span>
                      </button>
                    );
                  })}
                </div>
                {filteredInstitutions.length > MAX_QUICK_RESULTS && (
                  <p className="text-xs text-[#52514E]">
                    Menampilkan {MAX_QUICK_RESULTS} teratas dari{" "}
                    {filteredInstitutions.length} hasil.
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Kartu Detail Lembaga Terpilih */}
          <div className="bg-white border-2 border-[#141413] rounded-2xl p-3.5 sm:p-4 shadow-[3px_3px_0px_#141413] flex-1 flex flex-col justify-between gap-3">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeInstitution.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.15 }}
                className="space-y-2"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-xs font-bold px-2 py-0.5 rounded-lg bg-[#FAF7F2] border border-[#141413] text-[#141413]">
                    {activeInstitution.bentuk} &middot; {activeInstitution.status}
                  </span>
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-lg bg-[#1AD598]/25 border border-[#141413] text-[#141413]">
                    ~{activeInstitution.estimatedDistanceKm} km
                  </span>
                </div>

                <div>
                  <h3 className="font-display font-black text-base sm:text-lg text-[#141413] leading-snug">
                    {activeInstitution.name}
                  </h3>
                  <p className="text-xs font-mono text-[#52514E] mt-0.5">
                    {codeLabel}: {activeInstitution.code} &middot; Acuan: {originLabel}
                  </p>
                  <p className="text-xs text-[#52514E] mt-1 leading-relaxed line-clamp-2">
                    {activeInstitution.kabupaten} - {activeInstitution.address}
                  </p>
                </div>

                {activeInstitution.programs.length > 0 && (
                  <div className="flex flex-wrap gap-1 pt-0.5">
                    {activeInstitution.programs.slice(0, 2).map((prog) => (
                      <span
                        key={prog}
                        className="px-2 py-0.5 rounded-md bg-[#FAF7F2] border border-[#141413]/25 text-xs font-medium text-[#141413]"
                      >
                        {prog}
                      </span>
                    ))}
                    {activeInstitution.programs.length > 2 && (
                      <span className="px-1.5 py-0.5 text-xs font-bold text-[#3B66FF]">
                        +{activeInstitution.programs.length - 2} lainnya
                      </span>
                    )}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Hanya 2 Tombol Aksi Inti */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2.5 border-t border-[#141413]/15">
              <a
                href={actionRouteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="neo-btn min-h-[42px] px-3 py-2 rounded-xl bg-white hover:bg-[#FAF7F2] text-xs font-display font-bold text-[#141413] flex items-center justify-center text-center"
              >
                {hasHomeAddress ? "Rute dari Alamat" : "Buka Peta"}
              </a>
              <Link
                href="/katalog"
                className="neo-btn min-h-[42px] px-3 py-2 rounded-xl bg-[#B8F348] hover:bg-[#c8f76b] text-xs font-display font-bold text-[#141413] flex items-center justify-center text-center"
              >
                Lihat di Katalog
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
