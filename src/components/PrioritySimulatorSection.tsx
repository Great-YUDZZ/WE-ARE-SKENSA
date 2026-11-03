"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FieldGroup, GROUP_CONFIG } from "@/data/fields";

interface PrioritySimulatorSectionProps {
  onOpenTest: (fieldId?: string) => void;
}

interface SimulatedCampus {
  id: string;
  fieldId: string;
  name: string;
  prodi: string;
  kabupaten: string;
  matchScore: number;
  distanceScore: number;
  costScore: number;
  group: FieldGroup;
  careerProspect: string;
}

const SAMPLE_CAMPUSES: SimulatedCampus[] = [
  {
    id: "pnb-trpl",
    fieldId: "informatika",
    name: "Politeknik Negeri Bali (PNB)",
    prodi: "D4 Teknologi Rekayasa Perangkat Lunak",
    kabupaten: "Badung (Bukit Jimbaran)",
    matchScore: 95,
    distanceScore: 80,
    costScore: 92,
    group: "teknologi",
    careerProspect: "Software Engineer, Fullstack Dev, AI Engineer",
  },
  {
    id: "isi-dkv",
    fieldId: "dkv",
    name: "Institut Seni Indonesia (ISI) Denpasar",
    prodi: "S1 Desain Komunikasi Visual & Animasi",
    kabupaten: "Denpasar Timur",
    matchScore: 93,
    distanceScore: 88,
    costScore: 89,
    group: "teknologi",
    careerProspect: "UI/UX Designer, Art Director, Creative Creator",
  },
  {
    id: "poltekpar-perhotelan",
    fieldId: "pariwisata",
    name: "Politeknik Pariwisata Bali (Poltekpar)",
    prodi: "D4 Pengelolaan Perhotelan & Ekowisata",
    kabupaten: "Badung (Nusa Dua)",
    matchScore: 89,
    distanceScore: 82,
    costScore: 86,
    group: "usaha",
    careerProspect: "Resort Manager, Event Director, Hospitalitypreneur",
  },
  {
    id: "unud-keperawatan",
    fieldId: "kesehatan",
    name: "Universitas Udayana (Unud)",
    prodi: "S1 Ilmu Keperawatan & Kesehatan",
    kabupaten: "Denpasar Barat",
    matchScore: 86,
    distanceScore: 92,
    costScore: 78,
    group: "manusia",
    careerProspect: "Clinical Nurse, Medical Tourism Specialist",
  },
  {
    id: "undiksha-pendidikan",
    fieldId: "pendidikan",
    name: "Universitas Pendidikan Ganesha (Undiksha)",
    prodi: "S1 Bimbingan Konseling & EdTech",
    kabupaten: "Buleleng (Singaraja)",
    matchScore: 88,
    distanceScore: 68,
    costScore: 95,
    group: "manusia",
    careerProspect: "Konselor Remaja, Edu-Creator, Kurator Kurikulum",
  },
  {
    id: "pnb-tabanan",
    fieldId: "pertanian",
    name: "PNB Kampus Tabanan / Unud",
    prodi: "D4 Agroteknologi Organik & Subak Modern",
    kabupaten: "Tabanan & Jimbaran",
    matchScore: 84,
    distanceScore: 76,
    costScore: 91,
    group: "alam",
    careerProspect: "Agri-Tech Founder, Konsultan Eco-Supply Hotel",
  },
];

const FILTER_VIBES: { id: FieldGroup; label: string; color: string; text: string }[] = [
  { id: "teknologi", label: "Coding, Game & Visual", color: "#3B66FF", text: "#FFFFFF" },
  { id: "usaha", label: "Bisnis & Hospitality", color: "#FFBE2E", text: "#141413" },
  { id: "manusia", label: "Medis, Psikologi & Seni", color: "#FF5E4D", text: "#FFFFFF" },
  { id: "alam", label: "Alam, Laut & Eco-Subak", color: "#1AD598", text: "#141413" },
];

export default function PrioritySimulatorSection({
  onOpenTest,
}: PrioritySimulatorSectionProps) {
  const [selectedGroups, setSelectedGroups] = useState<FieldGroup[]>([
    "teknologi",
    "usaha",
    "manusia",
    "alam",
  ]);
  const [matchWeight, setMatchWeight] = useState<number>(80);
  const [distanceWeight, setDistanceWeight] = useState<number>(50);
  const [costWeight, setCostWeight] = useState<number>(65);
  const [isRecalculating, setIsRecalculating] = useState<boolean>(false);
  const [localToast, setLocalToast] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setLocalToast(msg);
    setTimeout(() => {
      setLocalToast(null);
    }, 3200);
  };

  const toggleGroup = (group: FieldGroup) => {
    if (selectedGroups.includes(group)) {
      setSelectedGroups(selectedGroups.filter((g) => g !== group));
    } else {
      setSelectedGroups([...selectedGroups, group]);
    }
  };

  const handleRandomPreset = () => {
    setIsRecalculating(true);
    setTimeout(() => {
      const presets = [
        { m: 95, d: 35, c: 60, g: ["teknologi", "usaha"] as FieldGroup[], name: "Preset Passion Hunter" },
        { m: 65, d: 95, c: 85, g: ["teknologi", "manusia", "alam"] as FieldGroup[], name: "Preset Dekat Rumah & Hemat" },
        { m: 85, d: 60, c: 95, g: ["usaha", "alam", "teknologi"] as FieldGroup[], name: "Preset Pemburu Beasiswa" },
      ];
      const pick = presets[Math.floor(Math.random() * presets.length)];
      setMatchWeight(pick.m);
      setDistanceWeight(pick.d);
      setCostWeight(pick.c);
      setSelectedGroups(pick.g);
      setIsRecalculating(false);
      triggerToast(`${pick.name} diterapkan ke Equalizer!`);
    }, 320);
  };

  const totalWeight = matchWeight + distanceWeight + costWeight;
  const hasInvalidWeights = totalWeight <= 0;

  const rankedCampuses = [...SAMPLE_CAMPUSES]
    .filter((c) => selectedGroups.includes(c.group))
    .map((c) => {
      const safeTotal = totalWeight || 1;
      const composite = Math.round(
        (c.matchScore * matchWeight +
          c.distanceScore * distanceWeight +
          c.costScore * costWeight) /
          safeTotal
      );
      return { ...c, compositeScore: composite };
    })
    .sort((a, b) => b.compositeScore - a.compositeScore);

  return (
    <section
      id="simulator"
      className="py-16 sm:py-24 border-t-2 border-[#141413] neopop-canvas-subtle text-[#141413] relative"
    >
      {/* Boundary State 4: Local Feedback Toast */}
      <AnimatePresence>
        {localToast && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.95 }}
            className="fixed bottom-6 right-4 sm:right-8 z-50 neo-card px-4 py-3 rounded-2xl bg-[#B8F348] text-[#141413] flex items-center gap-2.5"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-[#141413]" />
            <span className="font-display font-bold text-xs sm:text-sm">
              {localToast}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Row */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10 sm:mb-12">
          <div className="max-w-2xl">
            <h2 className="font-display font-black text-3xl sm:text-5xl text-[#141413] tracking-tight leading-[1.1]">
              Mainkan{" "}
              <span className="inline-block px-3 py-0.5 rounded-xl bg-[#FFBE2E] border-2 border-[#141413] shadow-[3px_3px_0px_#141413] rotate-1">
                Equalizer Prioritas
              </span>{" "}
              Versimu
            </h2>
            <p className="mt-3 text-sm sm:text-base text-[#52514E] font-medium leading-relaxed">
              Tiap anak punya kondisi beda: ada yang ngejar passion murni, ada yang pengen dekat rumah, atau cari UKT paling ramah. Geser fader di bawah dan lihat urutan kampusnya berubah real-time!
            </p>
          </div>

          <button
            type="button"
            onClick={handleRandomPreset}
            className="neo-btn self-start lg:self-auto px-4 py-2.5 rounded-xl bg-white hover:bg-[#F0ECE1] text-[#141413] font-mono font-bold text-xs cursor-pointer flex items-center gap-2"
          >
            <span>Acak Preset Vibe</span>
            <span>&rarr;</span>
          </button>
        </div>

        {/* Interactive Sticker Filter Bar */}
        <div className="mb-8 p-4 rounded-2xl bg-white border-2 border-[#141413] shadow-[4px_4px_0px_#141413]">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
            <span className="text-xs font-mono font-bold text-[#141413] uppercase">
              FILTER KLASTER MINAT (KLIK UNTUK AKTIFKAN / MATIKAN):
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() =>
                  setSelectedGroups(["teknologi", "usaha", "manusia", "alam"])
                }
                className="text-[11px] font-mono font-bold text-[#3B66FF] hover:underline cursor-pointer"
              >
                Pilih Semua
              </button>
              <span className="text-[#52514E]">&bull;</span>
              <button
                type="button"
                onClick={() => setSelectedGroups([])}
                className="text-[11px] font-mono font-bold text-[#FF5E4D] hover:underline cursor-pointer"
              >
                Reset Kosong
              </button>
            </div>
          </div>

          <div className="flex flex-wrap gap-2.5">
            {FILTER_VIBES.map((vibe) => {
              const active = selectedGroups.includes(vibe.id);
              return (
                <button
                  key={vibe.id}
                  type="button"
                  onClick={() => toggleGroup(vibe.id)}
                  className={`px-3.5 py-2 rounded-xl font-display font-bold text-xs sm:text-sm border-2 border-[#141413] transition-all cursor-pointer flex items-center gap-2 ${
                    active
                      ? "shadow-[3px_3px_0px_#141413] -translate-y-0.5"
                      : "bg-[#F0ECE1] text-[#52514E] opacity-65 hover:opacity-100"
                  }`}
                  style={
                    active
                      ? { backgroundColor: vibe.color, color: vibe.text }
                      : undefined
                  }
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full border border-[#141413]"
                    style={{ backgroundColor: active ? "#FFFFFF" : vibe.color }}
                  />
                  <span>{vibe.label}</span>
                  <span className="font-mono text-[10px]">
                    {active ? "[ON]" : "[OFF]"}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2-Column Hardware Console + Live Ranking Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Hardware Equalizer Faders (5 cols) */}
          <div className="lg:col-span-5 neo-card-lg rounded-3xl p-6 sm:p-7 bg-white space-y-6">
            <div className="flex items-center justify-between pb-4 border-b-2 border-[#141413]">
              <div>
                <span className="text-[10px] font-mono font-bold text-[#52514E] uppercase block">
                  KONSOL SIMULASI BOBOT
                </span>
                <h3 className="font-display font-extrabold text-xl text-[#141413]">
                  3 Fader Penentu Keputusan
                </h3>
              </div>
              <span className="px-2.5 py-1 rounded-lg bg-[#141413] text-[#B8F348] font-mono font-bold text-xs">
                REAL-TIME
              </span>
            </div>

            {/* Fader 1: Passion & Bakat (Cobalt #3B66FF) */}
            <div className="p-4 rounded-2xl bg-[#FAF7F2] border-2 border-[#141413] space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="font-display font-bold text-sm text-[#141413] flex items-center gap-2">
                  <span className="w-3 h-3 rounded-sm bg-[#3B66FF] border border-[#141413]" />
                  Kecocokan Passion & Bakat
                </span>
                <span className="font-mono font-bold text-xs px-2.5 py-0.5 rounded-md bg-[#3B66FF] text-white border border-[#141413]">
                  {matchWeight}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={matchWeight}
                onChange={(e) => setMatchWeight(Number(e.target.value))}
                className="w-full neo-fader"
              />
              <p className="text-xs text-[#52514E]">
                Seberapa ngotot kamu pengen jurusan yang bener-bener sesuai hobi dan bakatmu.
              </p>
            </div>

            {/* Fader 2: Jarak Lokasi Bali (Mint #1AD598) */}
            <div className="p-4 rounded-2xl bg-[#FAF7F2] border-2 border-[#141413] space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="font-display font-bold text-sm text-[#141413] flex items-center gap-2">
                  <span className="w-3 h-3 rounded-sm bg-[#1AD598] border border-[#141413]" />
                  Jarak Tempuh & Akses Bali
                </span>
                <span className="font-mono font-bold text-xs px-2.5 py-0.5 rounded-md bg-[#1AD598] text-[#141413] border border-[#141413]">
                  {distanceWeight}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={distanceWeight}
                onChange={(e) => setDistanceWeight(Number(e.target.value))}
                className="w-full neo-fader"
              />
              <p className="text-xs text-[#52514E]">
                Pentingnya jarak dari rumah, akses transportasi, atau nggak perlu ngekos jauh.
              </p>
            </div>

            {/* Fader 3: Efisiensi Biaya & Beasiswa (Coral #FF5E4D) */}
            <div className="p-4 rounded-2xl bg-[#FAF7F2] border-2 border-[#141413] space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="font-display font-bold text-sm text-[#141413] flex items-center gap-2">
                  <span className="w-3 h-3 rounded-sm bg-[#FF5E4D] border border-[#141413]" />
                  Ramah Biaya & Peluang KIP
                </span>
                <span className="font-mono font-bold text-xs px-2.5 py-0.5 rounded-md bg-[#FF5E4D] text-white border border-[#141413]">
                  {costWeight}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={costWeight}
                onChange={(e) => setCostWeight(Number(e.target.value))}
                className="w-full neo-fader"
              />
              <p className="text-xs text-[#52514E]">
                Prioritas kampus negeri/vokasi dengan UKT bersahabat dan kuota beasiswa luas.
              </p>
            </div>

            {/* Reset Controls */}
            <div className="flex items-center justify-between pt-1">
              <button
                type="button"
                onClick={() => {
                  setMatchWeight(80);
                  setDistanceWeight(50);
                  setCostWeight(65);
                  setSelectedGroups(["teknologi", "usaha", "manusia", "alam"]);
                  triggerToast("Fader dikembalikan ke setelan seimbang.");
                }}
                className="text-xs font-mono font-bold text-[#52514E] hover:text-[#141413] underline cursor-pointer"
              >
                Reset ke Default
              </button>
              <span className="text-[11px] font-mono text-[#52514E]">
                Total Sinyal: {totalWeight} pts
              </span>
            </div>
          </div>

          {/* Right Column: Dynamic Ranked Output with 4 Boundary States (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-mono font-bold text-[#141413] uppercase tracking-wider">
                TOP REKOMENDASI DARI SIMULASI EQUALIZER:
              </span>
              <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-md bg-[#B8F348] border border-[#141413] text-[#141413]">
                {rankedCampuses.length} Prodi Cocok
              </span>
            </div>

            {/* BOUNDARY STATE 1: Loading Skeleton */}
            {isRecalculating ? (
              <div className="space-y-4">
                {[1, 2, 3].map((item) => (
                  <div
                    key={item}
                    className="neo-card rounded-2xl p-5 bg-white animate-pulse space-y-3"
                  >
                    <div className="flex justify-between">
                      <div className="h-5 w-48 bg-[#F0ECE1] rounded-md border border-[#141413]/20" />
                      <div className="h-6 w-16 bg-[#B8F348]/50 rounded-md border border-[#141413]/20" />
                    </div>
                    <div className="h-4 w-64 bg-[#F0ECE1] rounded-md" />
                    <div className="grid grid-cols-3 gap-3 pt-2">
                      <div className="h-3 bg-[#F0ECE1] rounded" />
                      <div className="h-3 bg-[#F0ECE1] rounded" />
                      <div className="h-3 bg-[#F0ECE1] rounded" />
                    </div>
                  </div>
                ))}
              </div>
            ) : hasInvalidWeights ? (
              /* BOUNDARY STATE 3: Error / Zero Weight Validation Boundary */
              <div className="neo-card rounded-3xl p-8 bg-[#FF5E4D]/10 text-center space-y-4">
                <div className="inline-block px-3 py-1 rounded-xl bg-[#FF5E4D] text-white font-mono font-bold text-xs border-2 border-[#141413]">
                  SINYAL BOBOT 0%
                </div>
                <h4 className="font-display font-extrabold text-xl text-[#141413]">
                  Ketiga Fader Masih di Angka Nol
                </h4>
                <p className="text-xs sm:text-sm text-[#52514E] max-w-md mx-auto">
                  Geser minimal satu fader di sebelah kiri (Passion, Jarak, atau Biaya) di atas 0% supaya Equalizer bisa menghitung skor komposit kampus untukmu.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setMatchWeight(80);
                    setDistanceWeight(50);
                    setCostWeight(65);
                  }}
                  className="neo-btn px-5 py-2.5 rounded-xl bg-[#141413] text-white font-display font-bold text-xs cursor-pointer"
                >
                  Nyalakan Fader Otomatis
                </button>
              </div>
            ) : rankedCampuses.length === 0 ? (
              /* BOUNDARY STATE 2: Empty State */
              <div className="neo-card rounded-3xl p-8 bg-white text-center space-y-4">
                <div className="inline-block px-3 py-1 rounded-xl bg-[#FFBE2E] text-[#141413] font-mono font-bold text-xs border-2 border-[#141413]">
                  BELUM ADA KLASTER MINAT DIPILIH
                </div>
                <h4 className="font-display font-extrabold text-2xl text-[#141413]">
                  Stiker Klaster Minatmu Masih Kosong Nih
                </h4>
                <p className="text-xs sm:text-sm text-[#52514E] max-w-md mx-auto">
                  Klik salah satu stiker klaster di atas (seperti Coding & Visual atau Bisnis & Hospitality), atau biarkan kami pilihkan kombinasi acak buat kamu!
                </p>
                <button
                  type="button"
                  onClick={handleRandomPreset}
                  className="neo-btn px-5 py-3 rounded-xl bg-[#B8F348] text-[#141413] font-display font-extrabold text-xs sm:text-sm cursor-pointer"
                >
                  Pilih Vibe Acak Buat Aku &rarr;
                </button>
              </div>
            ) : (
              /* Active Ranked Cards */
              <div className="space-y-4">
                {rankedCampuses.slice(0, 4).map((campus, idx) => {
                  const groupConf = GROUP_CONFIG[campus.group];
                  const isFirst = idx === 0;
                  return (
                    <motion.div
                      layout
                      key={campus.id}
                      className={`neo-card rounded-2xl p-5 transition-all ${
                        isFirst ? "bg-white ring-2 ring-[#141413]" : "bg-white"
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <span
                              className={`px-2.5 py-0.5 rounded-lg font-mono font-bold text-xs border-2 border-[#141413] ${
                                isFirst
                                  ? "bg-[#B8F348] text-[#141413]"
                                  : "bg-[#F0ECE1] text-[#141413]"
                              }`}
                            >
                              RANK #{idx + 1}
                            </span>
                            <span
                              className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md border border-[#141413]"
                              style={{
                                backgroundColor: groupConf.colorHex,
                                color:
                                  campus.group === "usaha" || campus.group === "alam"
                                    ? "#141413"
                                    : "#FFFFFF",
                              }}
                            >
                              {groupConf.shortLabel}
                            </span>
                            <span className="text-xs font-mono text-[#52514E]">
                              {campus.kabupaten}
                            </span>
                          </div>

                          <h4 className="font-display font-extrabold text-lg sm:text-xl text-[#141413] mt-2">
                            {campus.prodi}
                          </h4>
                          <p className="text-xs sm:text-sm font-bold text-[#52514E]">
                            {campus.name}
                          </p>
                        </div>

                        {/* Composite Score Ticket Box */}
                        <div className="self-start sm:self-center shrink-0 px-3.5 py-2 rounded-xl bg-[#FAF7F2] border-2 border-[#141413] text-left sm:text-right">
                          <span className="text-[10px] font-mono font-bold text-[#52514E] uppercase block">
                            SKOR COCOK
                          </span>
                          <span className="font-mono font-extrabold text-xl text-[#141413]">
                            {campus.compositeScore}
                            <span className="text-xs text-[#52514E]">/100</span>
                          </span>
                        </div>
                      </div>

                      {/* 3 Colored Progress Bars */}
                      <div className="pt-3 border-t-2 border-[#141413]/10 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                        <div>
                          <div className="flex justify-between font-mono font-bold text-[11px] mb-1">
                            <span className="text-[#3B66FF]">Passion</span>
                            <span>{campus.matchScore}%</span>
                          </div>
                          <div className="w-full h-2.5 rounded-full bg-[#F0ECE1] border border-[#141413] overflow-hidden">
                            <div
                              className="h-full bg-[#3B66FF]"
                              style={{ width: `${campus.matchScore}%` }}
                            />
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between font-mono font-bold text-[11px] mb-1">
                            <span className="text-[#0F6E4E]">Akses Lokasi</span>
                            <span>{campus.distanceScore}%</span>
                          </div>
                          <div className="w-full h-2.5 rounded-full bg-[#F0ECE1] border border-[#141413] overflow-hidden">
                            <div
                              className="h-full bg-[#1AD598]"
                              style={{ width: `${campus.distanceScore}%` }}
                            />
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between font-mono font-bold text-[11px] mb-1">
                            <span className="text-[#FF5E4D]">Ramah Biaya</span>
                            <span>{campus.costScore}%</span>
                          </div>
                          <div className="w-full h-2.5 rounded-full bg-[#F0ECE1] border border-[#141413] overflow-hidden">
                            <div
                              className="h-full bg-[#FF5E4D]"
                              style={{ width: `${campus.costScore}%` }}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Career Prospect & Quick Action Footer */}
                      <div className="mt-3 pt-2.5 border-t border-[#141413]/10 flex flex-wrap items-center justify-between gap-2 text-xs">
                        <span className="font-mono text-[11px] text-[#52514E]">
                          Prospek: <strong className="text-[#141413]">{campus.careerProspect}</strong>
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              triggerToast(
                                `${campus.prodi} (${campus.name}) disimpan ke daftar favoritmu!`
                              )
                            }
                            className="px-2.5 py-1 rounded-lg bg-[#F0ECE1] hover:bg-[#FFBE2E] border border-[#141413] font-mono font-bold text-[11px] text-[#141413] transition-colors cursor-pointer"
                          >
                            + Simpan
                          </button>
                          <button
                            type="button"
                            onClick={() => onOpenTest(campus.fieldId)}
                            className="px-2.5 py-1 rounded-lg bg-[#141413] text-[#B8F348] font-mono font-bold text-[11px] cursor-pointer"
                          >
                            Tes Detail &rarr;
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
