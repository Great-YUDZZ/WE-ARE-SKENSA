"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FIELDS, GROUP_CONFIG, FieldGroup } from "@/data/fields";

export interface CampusItem {
  id: string;
  name: string;
  prodi: string;
  district: string;
  kabupaten: string;
  query: string;
  group: FieldGroup;
  isTopThree: boolean;
  fieldId: string;
  accreditation: string;
}

export const BALI_GOOGLE_MAP_CAMPUSES: CampusItem[] = [
  // 1. Badung - PNB Jimbaran
  {
    id: "pnb-trpl",
    name: "Politeknik Negeri Bali (PNB)",
    prodi: "D4 Teknologi Rekayasa Perangkat Lunak",
    district: "Bukit Jimbaran",
    kabupaten: "Badung",
    query: "Politeknik Negeri Bali, Bukit Jimbaran, Kuta Selatan, Badung, Bali",
    group: "teknologi",
    isTopThree: true,
    fieldId: "informatika",
    accreditation: "Baik Sekali",
  },
  // 2. Denpasar Timur - ISI Denpasar
  {
    id: "isi-dkv",
    name: "Institut Seni Indonesia (ISI) Denpasar",
    prodi: "S1 Desain Komunikasi Visual",
    district: "Denpasar Timur",
    kabupaten: "Kota Denpasar",
    query: "Institut Seni Indonesia Denpasar, Jl. Nusa Indah, Sumerta, Denpasar Timur",
    group: "teknologi",
    isTopThree: true,
    fieldId: "dkv",
    accreditation: "Unggul",
  },
  // 3. Badung - Poltekpar Nusa Dua
  {
    id: "poltekpar-perhotelan",
    name: "Politeknik Pariwisata Bali (Poltekpar)",
    prodi: "D4 Pengelolaan Perhotelan",
    district: "Nusa Dua",
    kabupaten: "Badung",
    query: "Politeknik Pariwisata Bali, Benoa, Kuta Selatan, Badung",
    group: "usaha",
    isTopThree: true,
    fieldId: "pariwisata",
    accreditation: "Unggul",
  },
  // 4. Denpasar Utara - SMKN 1 Denpasar
  {
    id: "smkn1-dps",
    name: "SMK Negeri 1 Denpasar",
    prodi: "SMK Rekayasa Perangkat Lunak & TJKT",
    district: "Denpasar Utara",
    kabupaten: "Kota Denpasar",
    query: "SMK Negeri 1 Denpasar, Jl. HOS Cokroaminoto No.84, Ubung, Denpasar Utara",
    group: "teknologi",
    isTopThree: false,
    fieldId: "informatika",
    accreditation: "A (Unggul)",
  },
  // 5. Denpasar Barat - Unud Kampus Sudirman
  {
    id: "unud-kesehatan",
    name: "Universitas Udayana (Kampus Sudirman)",
    prodi: "S1 Ilmu Keperawatan & Kedokteran",
    district: "Denpasar Barat",
    kabupaten: "Kota Denpasar",
    query: "Fakultas Kedokteran Universitas Udayana, Jl. PB Sudirman, Dangin Puri, Denpasar Barat",
    group: "manusia",
    isTopThree: false,
    fieldId: "kesehatan",
    accreditation: "Unggul",
  },
  // 6. Denpasar Selatan - Poltekkes Kemenkes
  {
    id: "poltekkes-dps",
    name: "Poltekkes Kemenkes Denpasar",
    prodi: "D4 Keperawatan & Sanitasi Lingkungan",
    district: "Denpasar Selatan",
    kabupaten: "Kota Denpasar",
    query: "Poltekkes Kemenkes Denpasar, Jl. Sanitasi No.1, Sidakarya, Denpasar Selatan",
    group: "manusia",
    isTopThree: false,
    fieldId: "kesehatan",
    accreditation: "Unggul",
  },
  // 7. Denpasar Selatan - Undiknas University
  {
    id: "undiknas-bisnis",
    name: "Universitas Pendidikan Nasional (Undiknas)",
    prodi: "S1 Bisnis Digital & Manajemen",
    district: "Denpasar Selatan",
    kabupaten: "Kota Denpasar",
    query: "Undiknas Graduate School, Jl. Bedugul No.39, Sidakarya, Denpasar Selatan",
    group: "usaha",
    isTopThree: false,
    fieldId: "bisnis",
    accreditation: "Unggul",
  },
  // 8. Gianyar - SMKN 3 Sukawati (KOKAR)
  {
    id: "smkn3-sukawati",
    name: "SMKN 3 Sukawati (KOKAR)",
    prodi: "SMK Seni Karawitan, Tari & Pedalangan",
    district: "Batubulan, Sukawati",
    kabupaten: "Gianyar",
    query: "SMK Negeri 3 Sukawati, Jl. Batubulan, Sukawati, Gianyar",
    group: "manusia",
    isTopThree: false,
    fieldId: "budaya",
    accreditation: "A (Unggul)",
  },
  // 9. Buleleng - Undiksha Singaraja
  {
    id: "undiksha-singaraja",
    name: "Universitas Pendidikan Ganesha (Undiksha)",
    prodi: "S1 Bimbingan Konseling & Kependidikan",
    district: "Singaraja Kota",
    kabupaten: "Buleleng",
    query: "Universitas Pendidikan Ganesha, Jl. Udayana No.11, Singaraja, Buleleng",
    group: "manusia",
    isTopThree: false,
    fieldId: "pendidikan",
    accreditation: "Unggul",
  },
  // 10. Tabanan - PNB Kampus Tabanan
  {
    id: "pnb-tabanan",
    name: "Politeknik Negeri Bali (Kampus Tabanan)",
    prodi: "D4 Pengelolaan Tanaman Perkebunan Subak",
    district: "Kerambitan",
    kabupaten: "Tabanan",
    query: "Politeknik Negeri Bali PSDKU Tabanan, Mandung, Kerambitan, Tabanan",
    group: "alam",
    isTopThree: false,
    fieldId: "pertanian",
    accreditation: "Baik Sekali",
  },
  // 11. Badung Utara - SMKN 1 Petang
  {
    id: "smkn1-petang",
    name: "SMK Negeri 1 Petang",
    prodi: "SMK Agribisnis Organik & Tanaman Pangan",
    district: "Petang",
    kabupaten: "Badung",
    query: "SMK Negeri 1 Petang, Jl. Raya Petang, Badung, Bali",
    group: "alam",
    isTopThree: false,
    fieldId: "pertanian",
    accreditation: "A (Unggul)",
  },
  // 12. Karangasem - SMKN 1 Abang
  {
    id: "smkn1-abang",
    name: "SMK Negeri 1 Abang",
    prodi: "SMK Kemaritiman & Pengolahan Hasil Laut",
    district: "Abang",
    kabupaten: "Karangasem",
    query: "SMK Negeri 1 Abang, Jl. Raya Culik - Amed, Karangasem, Bali",
    group: "alam",
    isTopThree: false,
    fieldId: "lingkungan",
    accreditation: "A (Unggul)",
  },
  // 13. Jembrana - SMKN 1 Negara
  {
    id: "smkn1-negara",
    name: "SMK Negeri 1 Negara",
    prodi: "SMK Teknik Komputer Jaringan & Akuntansi",
    district: "Negara Kota",
    kabupaten: "Jembrana",
    query: "SMK Negeri 1 Negara, Jl. Pahlawan No.31, Jembrana, Bali",
    group: "teknologi",
    isTopThree: false,
    fieldId: "informatika",
    accreditation: "A (Unggul)",
  },
  // 14. Bangli - SMKN 1 Bangli
  {
    id: "smkn1-bangli",
    name: "SMK Negeri 1 Bangli",
    prodi: "SMK Bisnis Manajemen & Ekowisata",
    district: "Bangli Kota",
    kabupaten: "Bangli",
    query: "SMK Negeri 1 Bangli, Jl. Brigjen Ngurah Rai No.78, Bangli",
    group: "usaha",
    isTopThree: false,
    fieldId: "bisnis",
    accreditation: "A (Unggul)",
  },
  // 15. Klungkung - SMK Kesehatan Panca Atma Jaya
  {
    id: "smk-klungkung",
    name: "SMK Kesehatan Panca Atma Jaya",
    prodi: "SMK Keperawatan & Farmasi Klinis",
    district: "Semarapura",
    kabupaten: "Klungkung",
    query: "SMK Kesehatan Panca Atma Jaya, Jl. Raya Gunaksa, Klungkung, Bali",
    group: "manusia",
    isTopThree: false,
    fieldId: "kesehatan",
    accreditation: "Baik Sekali",
  },
];

interface BaliInteractiveMapProps {
  onOpenTest: (fieldId?: string) => void;
}

export default function BaliInteractiveMap({ onOpenTest }: BaliInteractiveMapProps) {
  const [activeCampusId, setActiveCampusId] = useState<string>("smkn1-dps");
  const [filterGroup, setFilterGroup] = useState<string>("all");

  const activeCampus =
    BALI_GOOGLE_MAP_CAMPUSES.find((c) => c.id === activeCampusId) ||
    BALI_GOOGLE_MAP_CAMPUSES[0];

  const activeField =
    FIELDS.find((f) => f.id === activeCampus.fieldId) || FIELDS[0];
  const activeGroup = GROUP_CONFIG[activeCampus.group];

  const filteredCampuses =
    filterGroup === "all"
      ? BALI_GOOGLE_MAP_CAMPUSES
      : BALI_GOOGLE_MAP_CAMPUSES.filter((c) => c.group === filterGroup);

  const googleMapsEmbedUrl = `https://www.google.com/maps?q=${encodeURIComponent(
    activeCampus.query
  )}&output=embed`;

  const googleMapsExternalUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    activeCampus.query
  )}`;

  return (
    <div className="w-full rounded-2xl overflow-hidden border border-white/[0.08] shadow-2xl bg-[#0D101A] text-[#F4F3F8] transition-colors">
      {/* Clean Nocturne Chrome Header */}
      <div className="bg-[#080A10] px-4 py-3 border-b border-white/[0.06] flex items-center justify-between">
        <div className="flex items-center gap-2">
          {/* Subtle dots */}
          <div className="flex gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-white/20 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-white/20 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-white/20 inline-block" />
          </div>
          <span className="text-xs font-mono text-[#8E9AB5] ml-3 hidden sm:inline">
            Peta Lokasi Google Maps &bull; Radar Pendidikan Bali
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-white/[0.05] text-[#A3ADC4] border border-white/10">
            9 KABUPATEN/KOTA TERHUBUNG
          </span>
        </div>
      </div>

      {/* Main Container */}
      <div className="p-4 sm:p-6 lg:p-7 grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left Side: Google Maps Embed & Interactive Selector (7 cols) */}
        <div className="lg:col-span-7 flex flex-col justify-between">
          <div>
            {/* Header with Group Filter Tabs */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
              <div>
                <span className="text-xs font-mono font-medium text-[#D2D8F0] tracking-wider uppercase block">
                  PILIH LOKASI SEKOLAH / KAMPUS
                </span>
                <span className="text-[11px] text-[#8E9AB5]">
                  Peta Google Maps langsung memindahkan pin ke lokasi yang dipilih.
                </span>
              </div>

              {/* Group Quick Filter */}
              <div className="flex items-center gap-1 bg-white/[0.04] p-1 rounded-full border border-white/[0.08] overflow-x-auto text-[11px] font-mono">
                <button
                  type="button"
                  onClick={() => setFilterGroup("all")}
                  className={`px-2.5 py-0.5 rounded-full transition-colors cursor-pointer ${
                    filterGroup === "all"
                      ? "bg-white text-[#080A10] font-bold"
                      : "text-[#8E9AB5] hover:text-white"
                  }`}
                >
                  Semua
                </button>
                <button
                  type="button"
                  onClick={() => setFilterGroup("teknologi")}
                  className={`px-2.5 py-0.5 rounded-full transition-colors cursor-pointer ${
                    filterGroup === "teknologi"
                      ? "bg-[#5B8DEF] text-white font-bold"
                      : "text-[#8E9AB5] hover:text-white"
                  }`}
                >
                  Teknologi
                </button>
                <button
                  type="button"
                  onClick={() => setFilterGroup("manusia")}
                  className={`px-2.5 py-0.5 rounded-full transition-colors cursor-pointer ${
                    filterGroup === "manusia"
                      ? "bg-[#F26676] text-white font-bold"
                      : "text-[#8E9AB5] hover:text-white"
                  }`}
                >
                  Manusia
                </button>
                <button
                  type="button"
                  onClick={() => setFilterGroup("alam")}
                  className={`px-2.5 py-0.5 rounded-full transition-colors cursor-pointer ${
                    filterGroup === "alam"
                      ? "bg-[#4ED69E] text-[#080A10] font-bold"
                      : "text-[#8E9AB5] hover:text-white"
                  }`}
                >
                  Alam
                </button>
                <button
                  type="button"
                  onClick={() => setFilterGroup("usaha")}
                  className={`px-2.5 py-0.5 rounded-full transition-colors cursor-pointer ${
                    filterGroup === "usaha"
                      ? "bg-[#F7C95C] text-[#080A10] font-bold"
                      : "text-[#8E9AB5] hover:text-white"
                  }`}
                >
                  Usaha
                </button>
              </div>
            </div>

            {/* Quick Campus Chips */}
            <div className="flex gap-1.5 overflow-x-auto pb-2 mb-3 scrollbar-thin">
              {filteredCampuses.map((campus) => {
                const isSelected = campus.id === activeCampus.id;
                const groupConf = GROUP_CONFIG[campus.group];
                return (
                  <button
                    key={campus.id}
                    type="button"
                    onClick={() => setActiveCampusId(campus.id)}
                    className={`shrink-0 text-xs px-3 py-1.5 rounded-lg border transition-all cursor-pointer flex items-center gap-2 ${
                      isSelected
                        ? "bg-white text-[#080A10] border-white font-bold shadow-md"
                        : "bg-white/[0.04] text-[#F4F3F8] border-white/[0.08] hover:border-white/30"
                    }`}
                  >
                    <span
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ backgroundColor: groupConf.colorHex }}
                    />
                    <span className="truncate max-w-[150px]">{campus.name}</span>
                    <span className="text-[10px] font-mono text-[#8E9AB5]">
                      {campus.kabupaten}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Google Maps Embed Iframe (Nocturne glass frame) */}
            <div className="relative w-full aspect-[16/11] min-h-[350px] sm:min-h-[420px] rounded-xl overflow-hidden border border-white/[0.08] bg-[#080A10]">
              <iframe
                title={`Peta Lokasi Google Maps ${activeCampus.name}`}
                key={activeCampus.id}
                src={googleMapsEmbedUrl}
                className="w-full h-full min-h-[350px] sm:min-h-[420px] border-0 filter brightness-95 contrast-105"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>
          </div>

          {/* Map Info Bar & Direct Google Maps Route Button */}
          <div className="mt-3 pt-3 border-t border-white/[0.08] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
            <div>
              <div className="font-display font-medium text-[#F4F3F8] flex items-center gap-1.5">
                <span
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: activeGroup.colorHex }}
                />
                <span>{activeCampus.name}</span>
                <span className="font-mono text-[10px] text-[#8E9AB5] font-normal">
                  ({activeCampus.district}, {activeCampus.kabupaten})
                </span>
              </div>
              <p className="text-[11px] text-[#8E9AB5] mt-0.5">
                {activeCampus.query}
              </p>
            </div>

            {/* Direct Google Maps Route Link */}
            <a
              href={googleMapsExternalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 px-4 py-2 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/15 text-[#F4F3F8] font-display font-medium text-xs transition-colors flex items-center gap-1.5"
            >
              <span>Buka Rute di Google Maps</span>
              <span className="font-mono text-xs">&nearr;</span>
            </a>
          </div>
        </div>

        {/* Right Side: Field & Campus Recommendation Card (5 cols) */}
        <div className="lg:col-span-5 bg-[#080A10] rounded-xl border border-white/[0.08] p-5 flex flex-col justify-between">
          <div>
            {/* Group Tag in Group Color */}
            <div className="flex items-center justify-between mb-3">
              <span
                className="text-[10px] font-mono font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider"
                style={{
                  backgroundColor: `${activeGroup.colorHex}20`,
                  color: activeGroup.colorHex,
                  border: `1px solid ${activeGroup.colorHex}40`,
                }}
              >
                {activeGroup.label}
              </span>
              <span className="text-xs font-mono text-[#8E9AB5]">
                Data PDDIKTI Resmi
              </span>
            </div>

            {/* Field Title & Description */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeCampus.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.15 }}
              >
                <h3 className="font-display font-medium text-lg sm:text-xl text-[#F4F3F8] mb-2 leading-snug">
                  {activeField.name}
                </h3>
                <p className="text-xs text-[#8E9AB5] leading-relaxed mb-4">
                  {activeField.description}
                </p>

                {/* Selected Active Campus Box */}
                <div className="mb-4 p-3 rounded-lg bg-white/[0.03] border border-white/[0.08]">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-medium text-[#D2D8F0] uppercase tracking-wider">
                      LOKASI GOOGLE MAPS TERPILIH:
                    </span>
                    <span className="text-[10px] font-mono font-bold text-[#4ED69E] bg-[#4ED69E]/15 px-2 py-0.5 rounded-full border border-[#4ED69E]/30">
                      {activeCampus.accreditation}
                    </span>
                  </div>
                  <p className="text-sm font-display font-medium text-[#F4F3F8] mt-1.5">
                    {activeCampus.name}
                  </p>
                  <p className="text-xs text-[#8E9AB5] mt-0.5">
                    {activeCampus.prodi}
                  </p>
                  <p className="text-[11px] font-mono text-[#5E687E] mt-1">
                    {activeCampus.district}, {activeCampus.kabupaten}
                  </p>
                </div>

                {/* Verified Institutions List in Bali */}
                <div className="space-y-2 mb-4">
                  <span className="text-[10px] font-mono text-[#8E9AB5] block uppercase tracking-wider font-semibold">
                    RUJUKAN KAMPUS / SEKOLAH PILOT LAINNYA:
                  </span>
                  {activeField.institutions.map((inst, i) => (
                    <div
                      key={i}
                      className="p-2.5 rounded-lg bg-white/[0.02] border border-white/[0.05] flex items-center justify-between text-xs"
                    >
                      <div>
                        <p className="font-medium text-[#F4F3F8] font-display">{inst.name}</p>
                        <p className="text-[11px] text-[#8E9AB5]">{inst.location} &bull; {inst.level}</p>
                      </div>
                      <span className="text-[10px] font-mono font-medium text-[#4ED69E] bg-[#4ED69E]/10 px-2 py-0.5 rounded-full">
                        {inst.accreditation}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Action Button: Luminous Pill Button */}
          <button
            onClick={() => onOpenTest(activeField.id)}
            type="button"
            className="w-full mt-2 h-11 bg-white hover:bg-[#F4F3F8] text-[#080A10] font-sans font-semibold text-xs sm:text-sm rounded-full shadow-glowPill active:scale-98 transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <span>Mulai Tes untuk Bidang Ini</span>
            <span className="font-mono text-sm">&rarr;</span>
          </button>
        </div>
      </div>
    </div>
  );
}
