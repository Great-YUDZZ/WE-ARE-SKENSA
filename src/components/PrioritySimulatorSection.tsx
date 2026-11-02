"use client";

import React, { useState } from "react";

interface PrioritySimulatorSectionProps {
  onOpenTest: () => void;
}

interface SimulatedCampus {
  id: string;
  name: string;
  prodi: string;
  kabupaten: string;
  matchScore: number;
  distanceScore: number;
  costScore: number;
  groupTag: string;
}

const SAMPLE_CAMPUSES: SimulatedCampus[] = [
  {
    id: "pnb-trpl",
    name: "Politeknik Negeri Bali (PNB)",
    prodi: "D4 Teknologi Rekayasa Perangkat Lunak",
    kabupaten: "Badung (Bukit Jimbaran)",
    matchScore: 94,
    distanceScore: 78,
    costScore: 90,
    groupTag: "Teknologi dan Rancang",
  },
  {
    id: "unud-keperawatan",
    name: "Universitas Udayana (Unud)",
    prodi: "S1 Ilmu Keperawatan",
    kabupaten: "Denpasar Barat",
    matchScore: 82,
    distanceScore: 92,
    costScore: 70,
    groupTag: "Manusia dan Budaya",
  },
  {
    id: "undiksha-pendidikan",
    name: "Universitas Pendidikan Ganesha (Undiksha)",
    prodi: "S1 Bimbingan Konseling & Teknologi Pendidikan",
    kabupaten: "Buleleng (Singaraja)",
    matchScore: 88,
    distanceScore: 60,
    costScore: 95,
    groupTag: "Manusia dan Budaya",
  },
  {
    id: "poltekpar-perhotelan",
    name: "Politeknik Pariwisata Bali (Poltekpar)",
    prodi: "D4 Pengelolaan Perhotelan & Ekowisata",
    kabupaten: "Badung (Nusa Dua)",
    matchScore: 85,
    distanceScore: 80,
    costScore: 82,
    groupTag: "Usaha dan Layanan",
  },
];

export default function PrioritySimulatorSection({ onOpenTest }: PrioritySimulatorSectionProps) {
  // Sliders: Kecocokan (Biru), Jarak (Hijau), Biaya (Merah)
  const [matchWeight, setMatchWeight] = useState<number>(70);
  const [distanceWeight, setDistanceWeight] = useState<number>(50);
  const [costWeight, setCostWeight] = useState<number>(60);

  // Calculate composite score dynamically
  const rankedCampuses = [...SAMPLE_CAMPUSES]
    .map((c) => {
      const totalWeight = matchWeight + distanceWeight + costWeight || 1;
      const composite = Math.round(
        (c.matchScore * matchWeight + c.distanceScore * distanceWeight + c.costScore * costWeight) / totalWeight
      );
      return { ...c, compositeScore: composite };
    })
    .sort((a, b) => b.compositeScore - a.compositeScore);

  return (
    <section id="simulator" className="py-20 sm:py-28 border-t border-white/[0.06] bg-[#080A10] text-[#F4F3F8] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-14 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-mono font-medium tracking-widest uppercase bg-white/[0.05] text-[#A3ADC4] border border-white/10 mb-4">
            ✦ SIMULASI PRIORITAS KEPUTUSAN
          </div>
          <h2 className="font-display font-medium text-3xl sm:text-4xl text-[#F4F3F8] tracking-tight">
            Seimbangkan Faktor Minat, Jarak, dan Biaya
          </h2>
          <p className="mt-3 text-sm sm:text-base text-[#8E9AB5] leading-relaxed">
            Setiap keluarga memiliki pertimbangan yang berbeda. Geser slider prioritas di bawah untuk melihat bagaimana algoritma KertaMarga menyeimbangkan ketiga faktor secara transparan.
          </p>
        </div>

        {/* 2-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Sliders */}
          <div className="lg:col-span-5 p-6 rounded-2xl bg-[#0D101A] border border-white/[0.08] space-y-6">
            <div className="border-b border-white/[0.08] pb-3">
              <h3 className="font-display font-medium text-lg text-[#F4F3F8]">
                Parameter Bobot Siswa
              </h3>
              <p className="text-xs text-[#8E9AB5]">
                Geser nilai sesuai preferensi kesiapan Anda.
              </p>
            </div>

            {/* Slider 1: Kecocokan Minat -> BIRU LUMINOUS (#5B8DEF) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-[#5B8DEF] flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#5B8DEF]" />
                  Kecocokan Minat & Bakat
                </span>
                <span className="font-mono text-[#5B8DEF] bg-[#5B8DEF]/10 border border-[#5B8DEF]/20 px-2 py-0.5 rounded-full">
                  {matchWeight}%
                </span>
              </div>
              <input
                type="range"
                min="10"
                max="100"
                step="5"
                value={matchWeight}
                onChange={(e) => setMatchWeight(Number(e.target.value))}
                className="w-full h-1.5 rounded-lg appearance-none cursor-pointer bg-white/[0.08] accent-[#5B8DEF]"
              />
              <p className="text-[11px] text-[#8E9AB5]">
                Mengutamakan prodi yang selaras dengan tes potensi dan bakat alami.
              </p>
            </div>

            {/* Slider 2: Jarak Tempuh -> HIJAU MINT (#4ED69E) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-[#4ED69E] flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#4ED69E]" />
                  Jarak Tempuh & Lokasi Bali
                </span>
                <span className="font-mono text-[#4ED69E] bg-[#4ED69E]/10 border border-[#4ED69E]/20 px-2 py-0.5 rounded-full">
                  {distanceWeight}%
                </span>
              </div>
              <input
                type="range"
                min="10"
                max="100"
                step="5"
                value={distanceWeight}
                onChange={(e) => setDistanceWeight(Number(e.target.value))}
                className="w-full h-1.5 rounded-lg appearance-none cursor-pointer bg-white/[0.08] accent-[#4ED69E]"
              />
              <p className="text-[11px] text-[#8E9AB5]">
                Mempertimbangkan kemudahan akses jalan, jarak kabupaten, dan moda transportasi.
              </p>
            </div>

            {/* Slider 3: Biaya -> ROSE/RED (#F26676) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-[#F26676] flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#F26676]" />
                  Efisiensi Biaya & Beasiswa
                </span>
                <span className="font-mono text-[#F26676] bg-[#F26676]/10 border border-[#F26676]/20 px-2 py-0.5 rounded-full">
                  {costWeight}%
                </span>
              </div>
              <input
                type="range"
                min="10"
                max="100"
                step="5"
                value={costWeight}
                onChange={(e) => setCostWeight(Number(e.target.value))}
                className="w-full h-1.5 rounded-lg appearance-none cursor-pointer bg-white/[0.08] accent-[#F26676]"
              />
              <p className="text-[11px] text-[#8E9AB5]">
                Mengutamakan kampus negeri/vokasi dengan UKT terjangkau dan ketersediaan beasiswa KIP.
              </p>
            </div>

            {/* Reset */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => {
                  setMatchWeight(70);
                  setDistanceWeight(50);
                  setCostWeight(60);
                }}
                className="text-xs font-mono text-[#5E687E] hover:text-[#F4F3F8] underline cursor-pointer"
              >
                Kembalikan ke Bobot Standar
              </button>
            </div>
          </div>

          {/* Right Column: Live Ranked Results */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between pb-1">
              <span className="text-xs font-mono font-medium text-[#8E9AB5] uppercase tracking-wider">
                HASIL PERINGKAT DINAMIS (LIVE RECALCULATION):
              </span>
              <span className="text-[11px] font-mono text-[#4ED69E] font-medium">
                Otomatis Dihitung Ulang
              </span>
            </div>

            {rankedCampuses.map((campus, idx) => (
              <div
                key={campus.id}
                className="p-5 rounded-2xl bg-[#0D101A] border border-white/[0.08] hover:border-white/20 transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                  <div>
                    <div className="flex items-center gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-white/[0.08] text-white text-[10px] font-mono font-medium flex items-center justify-center">
                        {idx + 1}
                      </span>
                      <h4 className="font-display font-medium text-base text-[#F4F3F8]">
                        {campus.prodi}
                      </h4>
                    </div>
                    <p className="text-xs text-[#8E9AB5] mt-1 ml-7.5">
                      {campus.name} &bull; {campus.kabupaten}
                    </p>
                  </div>

                  {/* Composite Score */}
                  <div className="flex sm:flex-col items-center sm:items-end justify-between ml-7.5 sm:ml-0">
                    <span className="text-[10px] font-mono text-[#5E687E] uppercase">
                      SKOR KOMPOSIT
                    </span>
                    <span className="font-mono font-bold text-lg text-[#F4F3F8]">
                      {campus.compositeScore}
                      <span className="text-xs text-[#5E687E] font-normal">/100</span>
                    </span>
                  </div>
                </div>

                {/* Score Breakdown Bars */}
                <div className="ml-0 sm:ml-7.5 pt-3 border-t border-white/[0.06] grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  {/* Biru: Kecocokan */}
                  <div>
                    <div className="flex justify-between text-[11px] mb-1 font-mono">
                      <span className="text-[#5B8DEF]">Kecocokan</span>
                      <span className="text-[#5B8DEF] font-bold">{campus.matchScore}%</span>
                    </div>
                    <div className="w-full h-1 rounded-full bg-white/[0.06] overflow-hidden">
                      <div
                        className="h-full rounded-full bg-[#5B8DEF] transition-all duration-300"
                        style={{ width: `${campus.matchScore}%` }}
                      />
                    </div>
                  </div>

                  {/* Hijau: Jarak */}
                  <div>
                    <div className="flex justify-between text-[11px] mb-1 font-mono">
                      <span className="text-[#4ED69E]">Jarak Tempuh</span>
                      <span className="text-[#4ED69E] font-bold">{campus.distanceScore}%</span>
                    </div>
                    <div className="w-full h-1 rounded-full bg-white/[0.06] overflow-hidden">
                      <div
                        className="h-full rounded-full bg-[#4ED69E] transition-all duration-300"
                        style={{ width: `${campus.distanceScore}%` }}
                      />
                    </div>
                  </div>

                  {/* Rose: Biaya */}
                  <div>
                    <div className="flex justify-between text-[11px] mb-1 font-mono">
                      <span className="text-[#F26676]">Efisiensi Biaya</span>
                      <span className="text-[#F26676] font-bold">{campus.costScore}%</span>
                    </div>
                    <div className="w-full h-1 rounded-full bg-white/[0.06] overflow-hidden">
                      <div
                        className="h-full rounded-full bg-[#F26676] transition-all duration-300"
                        style={{ width: `${campus.costScore}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* CTA */}
            <div className="pt-2 flex justify-end">
              <button
                onClick={onOpenTest}
                type="button"
                className="h-10 px-6 rounded-full bg-white/[0.08] hover:bg-white/[0.15] border border-white/15 text-[#F4F3F8] font-sans font-medium text-xs transition-all cursor-pointer flex items-center gap-2"
              >
                <span>Terapkan Bobot Ini Pada Tes</span>
                <span className="font-mono text-xs">&rarr;</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
