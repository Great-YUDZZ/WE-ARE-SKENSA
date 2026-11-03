"use client";

import React from "react";
import Link from "next/link";

interface ClosingCtaBandProps {
  onOpenTest?: () => void;
  onOpenLogin: () => void;
}

export default function ClosingCtaBand({
  onOpenTest,
  onOpenLogin,
}: ClosingCtaBandProps) {
  return (
    <section className="w-full py-16 sm:py-24 px-4 sm:px-6 lg:px-8 border-t-2 border-[#141413] bg-[#F0ECE1]">
      <div className="max-w-6xl mx-auto">
        <div className="neo-card-lg rounded-3xl bg-[#B8F348] p-8 sm:p-12 lg:p-14 text-[#141413] relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Copy */}
            <div className="lg:col-span-8 space-y-4 text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-white border-2 border-[#141413] shadow-[2px_2px_0px_#141413] text-xs font-mono font-bold text-[#141413] uppercase">
                SIAP TENTUKAN LANGKAHMU?
              </div>

              <h2 className="font-display font-black text-3xl sm:text-5xl text-[#141413] tracking-tight leading-[1.08]">
                Jangan Pilih Jurusan Cuma Karena{" "}
                <span className="inline-block px-3 py-0.5 rounded-xl bg-[#FFBE2E] border-2 border-[#141413] shadow-[3px_3px_0px_#141413] -rotate-1">
                  Ikut-Ikutan Teman.
                </span>
              </h2>

              <p className="text-sm sm:text-base text-[#141413]/85 font-semibold max-w-2xl leading-relaxed">
                Coba kuesioner interaktif 5 menit kami gratis. Bisa langsung tes pakai Mode Tamu Anonim tanpa daftar, atau simpan hasilnya buat bahan ngobrol santai bareng orang tua dan Guru BK.
              </p>
            </div>

            {/* Right Tactile Keycap Buttons */}
            <div className="lg:col-span-4 flex flex-col gap-3.5">
              <Link
                href="/eksplorasi"
                className="group w-full inline-flex items-center justify-between gap-4 pl-5 pr-2.5 py-2.5 rounded-2xl bg-[#141413] hover:bg-[#272725] text-white border-2 border-[#141413] shadow-[0_6px_0_#FF5E4D] hover:translate-y-[2px] hover:shadow-[0_4px_0_#FF5E4D] active:translate-y-[6px] active:shadow-none transition-all duration-150 cursor-pointer"
              >
                <div className="text-left">
                  <span className="block text-[10px] font-mono font-bold uppercase tracking-wider text-[#B8F348]">
                    MODE TAMU / AKUN
                  </span>
                  <span className="block font-display font-black text-base leading-tight text-white">
                    Mulai Tes Sekarang
                  </span>
                </div>
                <span className="w-10 h-10 rounded-xl bg-[#B8F348] text-[#141413] border-2 border-[#141413] flex items-center justify-center shrink-0 group-hover:translate-x-0.5 transition-transform font-mono font-bold">
                  &rarr;
                </span>
              </Link>

              <button
                onClick={onOpenLogin}
                type="button"
                className="w-full py-3.5 px-6 rounded-2xl bg-white hover:bg-[#FAF7F2] text-[#141413] border-2 border-[#141413] shadow-[0_5px_0_#141413] hover:translate-y-[2px] hover:shadow-[0_3px_0_#141413] active:translate-y-[5px] active:shadow-none font-display font-extrabold text-xs sm:text-sm flex items-center justify-center transition-all duration-150 cursor-pointer"
              >
                Masuk Akun Siswa / Guru BK
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
