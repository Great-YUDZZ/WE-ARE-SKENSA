"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface InteractiveCompassWidgetProps {
  onOpenTest: () => void;
}

interface DemoTrack {
  id: string;
  label: string;
  category: string;
  quote: string;
  signals: string[];
  topInstitution: {
    name: string;
    program: string;
    score: number;
    location: string;
    accreditation: string;
    source: string;
  };
}

const DEMO_TRACKS: DemoTrack[] = [
  {
    id: "software",
    label: "Rekayasa Web & UMKM",
    category: "Teknologi Informasi & Vokasi",
    quote: "Senang membuat aplikasi kasir stok toko kerajinan saat PKL di Gianyar...",
    signals: ["POS System", "Logika Database", "Dampak UMKM"],
    topInstitution: {
      name: "Politeknik Negeri Bali (PNB)",
      program: "D4 Teknologi Rekayasa Perangkat Lunak",
      score: 87.4,
      location: "Bukit Jimbaran, Badung (~18.2 km)",
      accreditation: "Baik Sekali (BAN-PT / PDDIKTI)",
      source: "pnb.ac.id | Cek: 2026-11-02",
    },
  },
  {
    id: "network",
    label: "Jaringan & Infrastruktur",
    category: "Teknik Jaringan & Hardware",
    quote: "Tertarik konfigurasi router mikrotik dan instalasi kabel fiber optik sekolah...",
    signals: ["Routing WiFi", "Linux Server", "Keamanan Jaringan"],
    topInstitution: {
      name: "SMK Negeri 1 Denpasar / PNB",
      program: "Teknik Jaringan Komputer & Telekomunikasi",
      score: 83.9,
      location: "Denpasar Utara (~3.2 km)",
      accreditation: "Unggul (A - BAN-PDM)",
      source: "smkn1denpasar.sch.id | Terverifikasi",
    },
  },
  {
    id: "business",
    label: "Bisnis Digital Pariwisata",
    category: "Terapan Ekonomi & Wisata",
    quote: "Ingin mengelola sistem promosi digital dan reservasi homestay desa wisata...",
    signals: ["E-Commerce Wisata", "Analisis Pasar", "Operasional Desa"],
    topInstitution: {
      name: "Universitas Udayana (Unud)",
      program: "S1 Bisnis Digital & Sistem Informasi",
      score: 81.2,
      location: "Jimbaran / Sudirman (~17.5 km)",
      accreditation: "Unggul (LAM INFOKOM)",
      source: "udayana.ac.id | Terverifikasi",
    },
  },
];

export default function InteractiveCompassWidget({
  onOpenTest,
}: InteractiveCompassWidgetProps) {
  const [activeTab, setActiveTab] = useState<string>("software");
  const [weightDistance, setWeightDistance] = useState<number>(25);

  const selectedTrack = DEMO_TRACKS.find((t) => t.id === activeTab) || DEMO_TRACKS[0];

  // Dynamic score based on distance weight slider
  const dynamicScore = (
    selectedTrack.topInstitution.score +
    (weightDistance > 30 ? (selectedTrack.id === "network" ? 2.5 : -1.2) : 0)
  ).toFixed(1);

  return (
    <div className="w-full max-w-lg lg:max-w-none bg-surface border-2 border-kborder-strong rounded-2xl p-5 sm:p-6 shadow-[0_12px_32px_rgba(20,24,29,0.08)] relative overflow-hidden flex flex-col justify-between">
      {/* Balinese brick-pattern border accent on top */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-terracotta via-amber-600 to-terracotta" />

      {/* Widget Header with Live Engine Telemetry */}
      <div className="flex items-center justify-between pb-4 border-b border-kborder">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald" />
          </span>
          <span className="text-[11px] font-mono font-bold text-basalt tracking-wider uppercase">
            SIMULATOR ALGORITMA REKOMENDASI
          </span>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-light text-emerald font-bold border border-emerald/30">
          LIVE DEMO
        </span>
      </div>

      {/* Interactive Tabs */}
      <div className="mt-4">
        <label className="text-[11px] font-mono font-semibold text-basalt-muted block mb-2">
          PILIH CONTOH MINAT SISWA UNTUK DIUJI:
        </label>
        <div className="grid grid-cols-3 gap-1.5 p-1 bg-surface-subtle rounded-lg border border-kborder">
          {DEMO_TRACKS.map((track) => (
            <button
              key={track.id}
              onClick={() => setActiveTab(track.id)}
              type="button"
              className={`py-2 px-1 text-[11px] font-sans font-bold rounded-md transition-all cursor-pointer text-center truncate ${
                activeTab === track.id
                  ? "bg-surface text-basalt shadow-sm border border-kborder font-semibold"
                  : "text-basalt-muted hover:text-basalt"
              }`}
            >
              {track.label}
            </button>
          ))}
        </div>
      </div>

      {/* Simulated Pipeline Steps */}
      <div className="mt-4 space-y-3">
        {/* Step 1: Extracted Signal Quote */}
        <div className="p-3 bg-canvas rounded-lg border border-kborder text-left">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-mono font-bold text-terracotta uppercase">
              1. EKSTRAKSI SINYAL ESAI GEMINI 2.5 FLASH
            </span>
            <span className="text-[10px] font-mono text-basalt-muted">Zero PII</span>
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedTrack.id + "-quote"}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.15 }}
            >
              <p className="text-xs italic text-basalt leading-relaxed">
                &ldquo;{selectedTrack.quote}&rdquo;
              </p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {selectedTrack.signals.map((sig, i) => (
                  <span
                    key={i}
                    className="text-[10px] font-mono px-2 py-0.5 rounded bg-surface border border-kborder text-basalt font-medium"
                  >
                    #{sig}
                  </span>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Step 2: Live Verified Ranking Result Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedTrack.id + "-result"}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="p-3.5 bg-surface border-2 border-terracotta/80 rounded-xl text-left shadow-sm"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-mono font-bold text-emerald uppercase bg-emerald-light px-2 py-0.5 rounded">
                2. REKOMENDASI INSTITUSI TERVERIFIKASI
              </span>
              <span className="text-xs font-mono font-bold text-terracotta">
                Skor: {dynamicScore}
              </span>
            </div>

            <h4 className="font-serif font-bold text-sm text-basalt mt-1.5">
              {selectedTrack.topInstitution.name}
            </h4>
            <p className="text-xs text-basalt-muted font-medium mt-0.5">
              {selectedTrack.topInstitution.program}
            </p>

            <div className="mt-2.5 pt-2 border-t border-kborder/80 flex items-center justify-between text-[11px] text-basalt-muted">
              <span>{selectedTrack.topInstitution.location}</span>
              <span className="font-mono text-[10px] text-emerald font-bold">
                {selectedTrack.topInstitution.accreditation}
              </span>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Step 3: Interactive Distance Priority Simulation Slider */}
        <div className="p-2.5 bg-surface-subtle rounded-lg border border-kborder flex items-center justify-between gap-3">
          <div className="text-left">
            <span className="text-[10px] font-mono font-bold text-basalt block">
              BOBOT JARAK KABUPATEN: {weightDistance}%
            </span>
            <span className="text-[10px] text-basalt-muted leading-tight block">
              Uji bagaimana slider mengubah prioritas kampus
            </span>
          </div>
          <input
            type="range"
            min="10"
            max="50"
            value={weightDistance}
            onChange={(e) => setWeightDistance(Number(e.target.value))}
            className="w-28 accent-terracotta cursor-pointer"
          />
        </div>
      </div>

      {/* Bottom CTA to open full test modal */}
      <button
        onClick={onOpenTest}
        type="button"
        className="w-full mt-4 h-11 bg-basalt hover:bg-basalt-subtle text-white font-sans font-bold text-xs rounded-lg shadow-sm transition-all duration-150 active:scale-98 cursor-pointer flex items-center justify-center gap-2"
      >
        <span>Coba Kuesioner dengan Profilmu Sendiri</span>
        <span className="font-mono text-terracotta font-bold text-sm">&rarr;</span>
      </button>
    </div>
  );
}
