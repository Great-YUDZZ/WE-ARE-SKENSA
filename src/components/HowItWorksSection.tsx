"use client";

import React, { useState } from "react";

const MINI_HOBBIES = [
  "Ngulik Web & AI",
  "Desain UI/UX",
  "Kuliner & Hotel",
  "Musik & Budaya Bali",
  "Eco-Subak & Laut",
];

export default function HowItWorksSection() {
  const [selectedHobbies, setSelectedHobbies] = useState<string[]>([
    "Ngulik Web & AI",
    "Desain UI/UX",
  ]);
  const [miniSlider, setMiniSlider] = useState<number>(80);

  const toggleHobby = (hobby: string) => {
    if (selectedHobbies.includes(hobby)) {
      if (selectedHobbies.length > 1) {
        setSelectedHobbies(selectedHobbies.filter((h) => h !== hobby));
      }
    } else {
      setSelectedHobbies([...selectedHobbies, hobby]);
    }
  };

  return (
    <section
      id="cara-kerja"
      className="py-16 sm:py-24 border-t-2 border-[#141413] bg-[#F0ECE1] text-[#141413] relative"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Left-Aligned Section Header with Inline Sticker */}
        <div className="max-w-3xl mb-10 sm:mb-14">
          <h2 className="font-display font-black text-3xl sm:text-5xl text-[#141413] tracking-tight leading-[1.1]">
            Gak Pakai Ribet, Gini Cara{" "}
            <span className="inline-block px-3 py-0.5 rounded-xl bg-[#B8F348] border-2 border-[#141413] shadow-[3px_3px_0px_#141413] -rotate-1">
              4 Langkah
            </span>{" "}
            Nemuin Arahmu
          </h2>
          <p className="mt-4 text-sm sm:text-base text-[#52514E] font-medium leading-relaxed">
            Bukan tes psikologi kaku yang bikin ngantuk. KertaMarga dirancang biar kamu bisa eksplorasi minat sambil langsung lihat realita jurusan dan kampus di Bali.
          </p>
        </div>

        {/* Asymmetric 12-Column Bento Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* BENTO CELL 01: Col-Span-7 (Warm White Card + Interactive Hobby Chips) */}
          <div className="lg:col-span-7 neo-card rounded-3xl p-6 sm:p-8 flex flex-col justify-between bg-white">
            <div>
              <div className="flex items-center justify-between gap-2 mb-4">
                <span className="px-3 py-1 rounded-xl bg-[#FF5E4D] text-white font-mono font-bold text-xs border-2 border-[#141413] shadow-[2px_2px_0px_#141413]">
                  STEP 01 &bull; KENALI FREKUENSI
                </span>
                <span className="text-xs font-mono font-bold text-[#52514E]">
                  ~3 Menit Santai
                </span>
              </div>

              <h3 className="font-display font-extrabold text-2xl sm:text-3xl text-[#141413] leading-tight">
                Pilih Aktivitas yang Bikin Kamu Lupa Waktu
              </h3>
              <p className="mt-2 text-sm text-[#52514E] leading-relaxed">
                Gak perlu bingung soal nama prodi dulu. Cukup klik aktivitas keseharian dan hobi yang paling seru menurutmu di bawah ini:
              </p>
            </div>

            {/* Interactive Mini Sticker Playground */}
            <div className="mt-6 p-4 rounded-2xl bg-[#FAF7F2] border-2 border-[#141413]">
              <span className="text-[11px] font-mono font-bold text-[#52514E] uppercase block mb-2.5">
                COBA KLIK STIKER MINAT INI:
              </span>
              <div className="flex flex-wrap gap-2">
                {MINI_HOBBIES.map((hobby) => {
                  const active = selectedHobbies.includes(hobby);
                  return (
                    <button
                      key={hobby}
                      type="button"
                      onClick={() => toggleHobby(hobby)}
                      className={`px-3 py-1.5 rounded-xl font-display font-bold text-xs border-2 border-[#141413] transition-all cursor-pointer ${
                        active
                          ? "bg-[#FFBE2E] text-[#141413] shadow-[2px_2px_0px_#141413] -translate-y-0.5"
                          : "bg-white text-[#52514E] hover:bg-[#F0ECE1]"
                      }`}
                    >
                      {active ? `[x] ${hobby}` : `[ ] ${hobby}`}
                    </button>
                  );
                })}
              </div>
              <p className="mt-3 text-xs font-mono font-bold text-[#141413]">
                Status: {selectedHobbies.length} aktivitas dipilih sebagai sinyal bakat awal.
              </p>
            </div>
          </div>

          {/* BENTO CELL 02: Col-Span-5 (Sunburst Mango Card + Mini Fader Preview) */}
          <div className="lg:col-span-5 neo-card rounded-3xl p-6 sm:p-8 flex flex-col justify-between bg-[#FFBE2E]">
            <div>
              <div className="flex items-center justify-between gap-2 mb-4">
                <span className="px-3 py-1 rounded-xl bg-[#141413] text-[#FFBE2E] font-mono font-bold text-xs border-2 border-[#141413]">
                  STEP 02 &bull; ATUR PRIORITAS
                </span>
                <span className="text-xs font-mono font-bold text-[#141413]">
                  Kendali Penuh
                </span>
              </div>

              <h3 className="font-display font-extrabold text-2xl text-[#141413] leading-tight">
                Sesuaikan Jarak Rumah & Budget Keluarga
              </h3>
              <p className="mt-2 text-sm text-[#141413]/85 font-medium leading-relaxed">
                Mau kuliah dekat rumah di kabupatenmu atau siap merantau ke Denpasar/Jimbaran? Geser fader sesuai kondisimu.
              </p>
            </div>

            {/* Interactive Mini Fader Box */}
            <div className="mt-6 p-4 rounded-2xl bg-white border-2 border-[#141413] shadow-[3px_3px_0px_#141413]">
              <div className="flex items-center justify-between text-xs font-mono font-bold text-[#141413] mb-2">
                <span>PRIORITAS PASSION VS JARAK</span>
                <span className="px-2 py-0.5 rounded bg-[#B8F348] border border-[#141413]">
                  {miniSlider}% Passion
                </span>
              </div>
              <input
                type="range"
                min="20"
                max="100"
                step="5"
                value={miniSlider}
                onChange={(e) => setMiniSlider(Number(e.target.value))}
                className="w-full neo-fader"
                aria-label="Simulasi mini prioritas passion"
              />
              <div className="mt-2 flex justify-between text-[11px] font-mono text-[#52514E]">
                <span>Dekat Rumah ({100 - miniSlider}%)</span>
                <span>Fokus Bakat ({miniSlider}%)</span>
              </div>
            </div>
          </div>

          {/* BENTO CELL 03: Col-Span-5 (Electric Cobalt Card + Data Verification Badge) */}
          <div className="lg:col-span-5 neo-card rounded-3xl p-6 sm:p-8 flex flex-col justify-between bg-[#3B66FF] text-white">
            <div>
              <div className="flex items-center justify-between gap-2 mb-4">
                <span className="px-3 py-1 rounded-xl bg-white text-[#141413] font-mono font-bold text-xs border-2 border-[#141413] shadow-[2px_2px_0px_#141413]">
                  STEP 03 &bull; DATA OBJEKTIF
                </span>
                <span className="text-xs font-mono font-bold text-[#B8F348]">
                  Anti-Sponsor
                </span>
              </div>

              <h3 className="font-display font-extrabold text-2xl text-white leading-tight">
                Komputasi AI + Data Resmi PDDIKTI & BAN-PT
              </h3>
              <p className="mt-2 text-sm text-white/90 leading-relaxed">
                Hasil rekomendasimu murni dihitung dari kecocokan profil dan data akreditasi resmi kampus/SMK se-Bali, tanpa iklan titipan.
              </p>
            </div>

            <div className="mt-6 p-4 rounded-2xl bg-[#141413] text-white border-2 border-[#141413] space-y-2 font-mono text-xs">
              <div className="flex items-center justify-between">
                <span className="text-[#B8F348]">SUMBER DATA:</span>
                <span>PDDIKTI & BAN-PT 2026</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#1AD598]">CAKUPAN WILAYAH:</span>
                <span>9 Kabupaten/Kota Bali</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#FFBE2E]">PRIVASI SISWA:</span>
                <span>Bisa Mode Tamu Anonim</span>
              </div>
            </div>
          </div>

          {/* BENTO CELL 04: Col-Span-7 (Acid Matcha Lime Card + Actionable Output Ticket) */}
          <div className="lg:col-span-7 neo-card rounded-3xl p-6 sm:p-8 flex flex-col justify-between bg-[#B8F348] text-[#141413]">
            <div>
              <div className="flex items-center justify-between gap-2 mb-4">
                <span className="px-3 py-1 rounded-xl bg-[#141413] text-white font-mono font-bold text-xs border-2 border-[#141413]">
                  STEP 04 &bull; TIKET MASA DEPAN
                </span>
                <span className="text-xs font-mono font-bold text-[#141413]">
                  Siap Diskusi Ortu & BK
                </span>
              </div>

              <h3 className="font-display font-extrabold text-2xl sm:text-3xl text-[#141413] leading-tight">
                Kantongi Daftar Kampus, Rute Peta & Prospek Karier di Bali
              </h3>
              <p className="mt-2 text-sm text-[#141413]/85 font-medium leading-relaxed">
                Kamu langsung dapat ringkasan Top 3 jurusan lengkap dengan lokasi Google Maps, kisaran UKT/beasiswa, dan bahan ngobrol bareng orang tua atau Guru BK.
              </p>
            </div>

            {/* Ticket Output Preview */}
            <div className="mt-6 p-4 rounded-2xl bg-white border-2 border-[#141413] shadow-[4px_4px_0px_#141413] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-[#3B66FF] text-white font-mono font-bold text-[10px]">
                    TOP MATCH #1
                  </span>
                  <span className="font-mono text-xs font-bold text-[#52514E]">
                    Akreditasi Unggul / Baik Sekali
                  </span>
                </div>
                <p className="font-display font-extrabold text-base text-[#141413] mt-1">
                  Politeknik Negeri Bali &bull; Universitas Udayana &bull; ISI Denpasar
                </p>
              </div>
              <a
                href="#simulator"
                className="neo-btn shrink-0 px-4 py-2.5 rounded-xl bg-[#FF5E4D] text-white font-display font-bold text-xs"
              >
                Coba Equalizer &darr;
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
