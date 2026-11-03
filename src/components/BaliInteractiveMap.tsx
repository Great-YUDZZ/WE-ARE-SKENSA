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
    name: "SMK Negeri 1 Denpasar (SKENSA)",
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
    <div className="w-full neo-card-lg rounded-3xl overflow-hidden bg-white text-[#141413]">
      {/* Tactile Console Window Header */}
      <div className="bg-[#141413] text-white px-4 sm:px-6 py-3.5 border-b-2 border-[#141413] flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <div className="flex gap-1.5">
            <span className="w-3 h-3 rounded-full bg-[#FF5E4D] inline-block" />
            <span className="w-3 h-3 rounded-full bg-[#FFBE2E] inline-block" />
            <span className="w-3 h-3 rounded-full bg-[#B8F348] inline-block" />
          </div>
          <span className="text-xs font-mono font-bold text-white ml-2">
            RADAR LOKASI GOOGLE MAPS &bull; 15 SEKOLAH & KAMPUS BALI
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-md bg-[#B8F348] text-[#141413]">
            9 KABUPATEN/KOTA AKTIF
          </span>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="p-4 sm:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch bg-[#FAF7F2]">
        {/* Left Side: Sticker Filter + Google Maps Iframe (7 cols) */}
        <div className="lg:col-span-7 flex flex-col justify-between">
          <div>
            {/* Filter Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div>
                <h3 className="font-display font-extrabold text-lg sm:text-xl text-[#141413]">
                  Klik Pin Sekolah / Kampus di Bawah
                </h3>
                <p className="text-xs text-[#52514E] font-medium">
                  Peta Google Maps otomatis terbang ke titik kampus yang kamu pilih.
                </p>
              </div>

              {/* 4 Group Color Sticker Filter */}
              <div className="flex flex-wrap items-center gap-1.5 text-xs font-mono font-bold">
                <button
                  type="button"
                  onClick={() => setFilterGroup("all")}
                  className={`px-3 py-1 rounded-lg border-2 border-[#141413] transition-all cursor-pointer ${
                    filterGroup === "all"
                      ? "bg-[#141413] text-[#B8F348] shadow-[2px_2px_0px_#3B66FF]"
                      : "bg-white text-[#141413] hover:bg-[#F0ECE1]"
                  }`}
                >
                  Semua (15)
                </button>
                <button
                  type="button"
                  onClick={() => setFilterGroup("teknologi")}
                  className={`px-2.5 py-1 rounded-lg border-2 border-[#141413] transition-all cursor-pointer ${
                    filterGroup === "teknologi"
                      ? "bg-[#3B66FF] text-white shadow-[2px_2px_0px_#141413]"
                      : "bg-white text-[#141413] hover:bg-[#3B66FF]/15"
                  }`}
                >
                  Teknologi
                </button>
                <button
                  type="button"
                  onClick={() => setFilterGroup("usaha")}
                  className={`px-2.5 py-1 rounded-lg border-2 border-[#141413] transition-all cursor-pointer ${
                    filterGroup === "usaha"
                      ? "bg-[#FFBE2E] text-[#141413] shadow-[2px_2px_0px_#141413]"
                      : "bg-white text-[#141413] hover:bg-[#FFBE2E]/25"
                  }`}
                >
                  Bisnis
                </button>
                <button
                  type="button"
                  onClick={() => setFilterGroup("manusia")}
                  className={`px-2.5 py-1 rounded-lg border-2 border-[#141413] transition-all cursor-pointer ${
                    filterGroup === "manusia"
                      ? "bg-[#FF5E4D] text-white shadow-[2px_2px_0px_#141413]"
                      : "bg-white text-[#141413] hover:bg-[#FF5E4D]/15"
                  }`}
                >
                  Manusia & Seni
                </button>
                <button
                  type="button"
                  onClick={() => setFilterGroup("alam")}
                  className={`px-2.5 py-1 rounded-lg border-2 border-[#141413] transition-all cursor-pointer ${
                    filterGroup === "alam"
                      ? "bg-[#1AD598] text-[#141413] shadow-[2px_2px_0px_#141413]"
                      : "bg-white text-[#141413] hover:bg-[#1AD598]/20"
                  }`}
                >
                  Alam
                </button>
              </div>
            </div>

            {/* Horizontal Trading-Card Campus Selector */}
            <div className="flex gap-2 overflow-x-auto pb-3 mb-3">
              {filteredCampuses.map((campus) => {
                const isSelected = campus.id === activeCampus.id;
                const groupConf = GROUP_CONFIG[campus.group];
                return (
                  <button
                    key={campus.id}
                    type="button"
                    onClick={() => setActiveCampusId(campus.id)}
                    className={`shrink-0 text-xs px-3.5 py-2 rounded-xl border-2 border-[#141413] transition-all cursor-pointer flex items-center gap-2 ${
                      isSelected
                        ? "bg-[#B8F348] text-[#141413] font-extrabold shadow-[3px_3px_0px_#141413] -translate-y-0.5"
                        : "bg-white text-[#141413] font-bold hover:bg-[#F0ECE1]"
                    }`}
                  >
                    <span
                      className="w-3 h-3 rounded-full border border-[#141413] shrink-0"
                      style={{ backgroundColor: groupConf.colorHex }}
                    />
                    <span className="truncate max-w-[165px]">{campus.name}</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#F0ECE1] border border-[#141413]/30 text-[#141413]">
                      {campus.kabupaten}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Google Maps Embed Frame */}
            <div className="relative w-full aspect-[16/11] min-h-[340px] sm:min-h-[410px] rounded-2xl overflow-hidden border-2 border-[#141413] shadow-[4px_4px_0px_#141413] bg-[#F0ECE1]">
              <iframe
                title={`Peta Lokasi Google Maps ${activeCampus.name}`}
                key={activeCampus.id}
                src={googleMapsEmbedUrl}
                className="w-full h-full min-h-[340px] sm:min-h-[410px] border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>
          </div>

          {/* Bottom Location Bar & Direct Route Button */}
          <div className="mt-4 p-3.5 rounded-2xl bg-white border-2 border-[#141413] shadow-[3px_3px_0px_#141413] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
            <div>
              <div className="font-display font-extrabold text-sm text-[#141413] flex items-center gap-2">
                <span
                  className="w-3 h-3 rounded-full border border-[#141413] shrink-0"
                  style={{ backgroundColor: activeGroup.colorHex }}
                />
                <span>{activeCampus.name}</span>
              </div>
              <p className="text-xs text-[#52514E] mt-0.5">
                {activeCampus.query}
              </p>
            </div>

            <a
              href={googleMapsExternalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="neo-btn shrink-0 px-4 py-2 rounded-xl bg-[#FFBE2E] text-[#141413] font-display font-bold text-xs flex items-center gap-1.5"
            >
              <span>Buka Rute Google Maps</span>
              <span className="font-mono font-bold">&nearr;</span>
            </a>
          </div>
        </div>

        {/* Right Side: Trading Card Detail for Selected Campus & Major (5 cols) */}
        <div className="lg:col-span-5 neo-card rounded-2xl p-5 sm:p-6 bg-white flex flex-col justify-between">
          <div>
            {/* Top Sticker Badges */}
            <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
              <span
                className="text-xs font-mono font-bold px-3 py-1 rounded-xl border-2 border-[#141413] uppercase shadow-[2px_2px_0px_#141413]"
                style={{
                  backgroundColor: activeGroup.colorHex,
                  color:
                    activeCampus.group === "usaha" || activeCampus.group === "alam"
                      ? "#141413"
                      : "#FFFFFF",
                }}
              >
                {activeGroup.label}
              </span>
              <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-[#F0ECE1] border border-[#141413] text-[#141413]">
                {activeCampus.kabupaten}
              </span>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeCampus.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.16 }}
              >
                {/* Highlighted Campus Card */}
                <div className="mb-4 p-4 rounded-2xl bg-[#B8F348] border-2 border-[#141413] shadow-[3px_3px_0px_#141413]">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-mono font-bold text-[#141413] uppercase">
                      TITIK AKTIF DI PETA:
                    </span>
                    <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-white text-[#141413] border border-[#141413]">
                      Akreditasi: {activeCampus.accreditation}
                    </span>
                  </div>
                  <h4 className="font-display font-black text-lg sm:text-xl text-[#141413] leading-snug">
                    {activeCampus.name}
                  </h4>
                  <p className="text-xs sm:text-sm font-bold text-[#141413]/85 mt-0.5">
                    Program: {activeCampus.prodi}
                  </p>
                </div>

                {/* Connected Major Field Explanation */}
                <h3 className="font-display font-extrabold text-lg text-[#141413] mb-1">
                  Bidang: {activeField.name}
                </h3>
                <p className="text-xs font-bold text-[#3B66FF] mb-2">
                  {activeField.vibeTagline}
                </p>
                <p className="text-xs sm:text-sm text-[#52514E] leading-relaxed mb-4">
                  {activeField.description}
                </p>

                {/* Other Campuses in the Same Field */}
                <div className="space-y-2 mb-4">
                  <span className="text-[11px] font-mono font-bold text-[#141413] block uppercase">
                    PILIHAN KAMPUS / SMK LAIN DI BIDANG INI:
                  </span>
                  {activeField.institutions.map((inst, i) => (
                    <div
                      key={i}
                      className="p-3 rounded-xl bg-[#FAF7F2] border-2 border-[#141413] flex items-center justify-between text-xs"
                    >
                      <div>
                        <p className="font-display font-extrabold text-[#141413]">
                          {inst.name}
                        </p>
                        <p className="text-[11px] text-[#52514E] font-medium">
                          {inst.location} &bull; {inst.level}
                        </p>
                      </div>
                      <span className="text-[11px] font-mono font-bold text-[#141413] bg-[#FFBE2E] px-2.5 py-0.5 rounded-md border border-[#141413]">
                        {inst.accreditation}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Primary Action Button */}
          <button
            onClick={() => onOpenTest(activeField.id)}
            type="button"
            className="neo-btn w-full mt-2 h-12 bg-[#FF5E4D] hover:bg-[#ff4936] text-white font-display font-extrabold text-xs sm:text-sm rounded-xl cursor-pointer flex items-center justify-center gap-2"
          >
            <span>Cek Kecocokanmu di Bidang Ini</span>
            <span className="font-mono text-sm">&rarr;</span>
          </button>
        </div>
      </div>
    </div>
  );
}
