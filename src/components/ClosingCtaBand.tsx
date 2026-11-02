"use client";

import React from "react";

interface ClosingCtaBandProps {
  onOpenTest: () => void;
  onOpenLogin: () => void;
}

export default function ClosingCtaBand({
  onOpenTest,
  onOpenLogin,
}: ClosingCtaBandProps) {
  return (
    <section className="w-full py-24 sm:py-32 px-4 sm:px-6 lg:px-8 border-t border-white/[0.08] relative overflow-hidden bg-[#080A10]">
      {/* Background Nocturne Aurora Glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-gradient-to-r from-[#5B8DEF]/10 via-[#D2D8F0]/15 to-[#5B8DEF]/10 blur-3xl opacity-70" />
      </div>

      <div className="max-w-4xl mx-auto text-center relative z-10 space-y-6">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.05] border border-white/10 text-xs font-mono tracking-widest text-[#A3ADC4] uppercase">
          ✦ MULAI EKSPLORASI SEKARANG
        </div>

        <h2 className="font-display font-medium text-3xl sm:text-5xl text-[#F4F3F8] tracking-tight leading-[1.15]">
          Arah masa depanmu dimulai dari{" "}
          <span className="italic font-normal text-[#D2D8F0]">
            keputusan yang tepat.
          </span>
        </h2>

        <p className="text-sm sm:text-base text-[#8E9AB5] max-w-xl mx-auto leading-relaxed">
          Ikuti kuesioner terarah 5 menit tanpa biaya registrasi. Temukan pilihan program studi dan kampus rujukan di Bali secara objektif.
        </p>

        {/* Buttons (Nocturne style) */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={onOpenTest}
            type="button"
            className="w-full sm:w-auto h-12 sm:h-13 px-8 rounded-full bg-[#F4F3F8] hover:bg-white text-[#080A10] font-sans font-semibold text-sm sm:text-base transition-all duration-200 active:scale-98 shadow-glowPill flex items-center justify-center gap-2"
          >
            <span>Mulai Tes Gratis</span>
            <span className="font-mono text-base">&rarr;</span>
          </button>

          <button
            onClick={onOpenLogin}
            type="button"
            className="w-full sm:w-auto h-12 sm:h-13 px-7 rounded-full bg-white/[0.06] hover:bg-white/[0.1] border border-white/15 text-[#F4F3F8] font-sans font-medium text-sm sm:text-base transition-all duration-200 active:scale-98 flex items-center justify-center"
          >
            Masuk Akun Pembimbing
          </button>
        </div>
      </div>
    </section>
  );
}
