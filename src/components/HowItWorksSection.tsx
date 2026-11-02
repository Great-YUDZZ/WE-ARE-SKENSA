"use client";

import React from "react";

interface StepItem {
  number: string;
  badgeBg: string;
  badgeText: string;
  title: string;
  description: string;
  detail: string;
}

const STEPS: StepItem[] = [
  {
    number: "01",
    badgeBg: "bg-[#F26676]/15 border border-[#F26676]/40",
    badgeText: "text-[#F26676]",
    title: "Eksplorasi Minat & Potensi",
    description: "Jawab kuesioner situasional terarah selama 5 menit untuk memetakan bakat alami, kecenderungan kerja, dan aspirasi masa depan.",
    detail: "Tanpa istilah teknis rumit, ramah untuk siswa SMP, SMA, maupun SMK.",
  },
  {
    number: "02",
    badgeBg: "bg-[#F7C95C]/15 border border-[#F7C95C]/40",
    badgeText: "text-[#F7C95C]",
    title: "Tentukan Bobot Prioritas",
    description: "Atur secara transparan seberapa penting faktor kecocokan minat, jarak tempuh lokasi di Bali, dan efisiensi biaya perkuliahan.",
    detail: "Siswa memegang kendali penuh atas parameter pertimbangan keluarga.",
  },
  {
    number: "03",
    badgeBg: "bg-[#5B8DEF]/15 border border-[#5B8DEF]/40",
    badgeText: "text-[#5B8DEF]",
    title: "Komputasi AI Transparan",
    description: "Algoritma mencocokkan profil minat dengan data akreditasi resmi BAN-PT dan profil program studi PDDIKTI se-Bali.",
    detail: "Bebas dari pengaruh promosi komersial kampus tertentu.",
  },
  {
    number: "04",
    badgeBg: "bg-[#4ED69E]/15 border border-[#4ED69E]/40",
    badgeText: "text-[#4ED69E]",
    title: "Rekomendasi Kampus & Vokasi",
    description: "Dapatkan daftar prodi, kampus rujukan, akreditasi, peluang karier industri lokal maupun nasional, serta simulasi beasiswa.",
    detail: "Laporan siap dibagikan kepada orang tua atau Guru BK pembimbing.",
  },
];

export default function HowItWorksSection() {
  return (
    <section id="cara-kerja" className="py-20 sm:py-28 border-t border-white/[0.06] bg-[#0B0E17] text-[#F4F3F8] transition-colors relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-14 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-mono font-medium tracking-widest uppercase bg-white/[0.05] text-[#A3ADC4] border border-white/10 mb-4">
            ✦ ALUR NAVIGASI TERSTRUKTUR
          </div>
          <h2 className="font-display font-medium text-3xl sm:text-4xl text-[#F4F3F8] tracking-tight">
            Empat Langkah Menemukan Arah yang Tepat
          </h2>
          <p className="mt-3 text-sm sm:text-base text-[#8E9AB5] leading-relaxed">
            KertaMarga dirancang agar setiap keputusan masa depan berlandaskan data objektif, bukan sekadar ikut tren sesaat atau dugaan tanpa bukti.
          </p>
        </div>

        {/* 4 Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {STEPS.map((step) => (
            <div
              key={step.number}
              className="p-6 rounded-2xl bg-[#0D101A] border border-white/[0.08] hover:border-white/20 transition-all flex flex-col justify-between"
            >
              <div>
                {/* Step Marker Badge */}
                <div className="flex items-center justify-between mb-5">
                  <span
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-mono font-bold text-sm ${step.badgeBg} ${step.badgeText}`}
                  >
                    {step.number}
                  </span>
                  <span className="text-[11px] font-mono text-[#5E687E] uppercase">
                    Tahap {step.number}
                  </span>
                </div>

                <h3 className="font-display font-medium text-lg text-[#F4F3F8] mb-2 leading-snug">
                  {step.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#8E9AB5] leading-relaxed mb-4">
                  {step.description}
                </p>
              </div>

              <div className="pt-3 border-t border-white/[0.06] text-[11px] font-mono text-[#5E687E]">
                {step.detail}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
