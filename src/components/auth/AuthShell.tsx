"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import SubakBackground from "@/components/SubakBackground";
import JepunMascot from "@/components/JepunMascot";

// Cangkang auth Neo-Pop dengan pola split dua kolom di desktop
// Kolom kiri berisi kartu form, kolom kanan berisi konteks KertaMarga
export default function AuthShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen relative overflow-hidden bg-[#FAF7F2] text-[#141413]">
      <SubakBackground />
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <header className="flex items-center justify-between gap-3 mb-8 sm:mb-10">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-[#B8F348] border-2 border-[#141413] shadow-[2px_2px_0px_#141413] flex items-center justify-center font-display font-black text-base group-hover:-rotate-6 transition-transform">
              KM
            </div>
            <span className="font-display font-extrabold text-lg sm:text-xl tracking-tight">KertaMarga</span>
          </Link>
          <Link
            href="/"
            className="text-xs font-bold border-2 border-[#141413] bg-white rounded-xl px-3.5 py-2 hover:bg-[#F0ECE1] transition-colors"
          >
            Kembali ke Beranda
          </Link>
        </header>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: [0.2, 0, 0, 1] }}
            className="bg-[#FAF7F2] border-2 border-[#141413] rounded-3xl shadow-[8px_8px_0px_#141413] p-6 sm:p-8"
          >
            {children}
          </motion.div>

          <aside className="hidden lg:block sticky top-8">
            <div className="bg-white border-2 border-[#141413] rounded-3xl shadow-[6px_6px_0px_#141413] p-6 sm:p-7">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#B8F348] border-2 border-[#141413] text-[11px] font-mono font-bold uppercase">
                <span className="w-2 h-2 rounded-full bg-[#141413]" />
                Kompas Jurusan dan Kampus Pelajar Bali
              </span>
              <h2 className="mt-4 font-display font-black text-2xl sm:text-3xl leading-tight tracking-tight">
                Simpan Profil, Lanjut Eksplorasi Tanpa Ulang Dari Nol
              </h2>
              <p className="mt-3 text-sm text-[#52514E] font-medium leading-relaxed">
                Akun menyimpan hasil simulasi prioritas minat, jarak, dan biaya, plus pilihan stiker minat awal. Data hanya minim untuk rekomendasi, tanpa alamat presisi dan tanpa iklan.
              </p>
              <div className="mt-5 space-y-3">
                <div className="flex items-start gap-3">
                  <span className="w-7 h-7 shrink-0 rounded-lg bg-[#B8F348] border-2 border-[#141413] flex items-center justify-center text-xs font-black">01</span>
                  <div>
                    <p className="text-sm font-bold">Tes 5 menit</p>
                    <p className="text-xs text-[#52514E] font-medium">Kuesioner adaptif dengan prioritas dinamis yang bisa digeser.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="w-7 h-7 shrink-0 rounded-lg bg-[#3B66FF] border-2 border-[#141413] text-white flex items-center justify-center text-xs font-black">02</span>
                  <div>
                    <p className="text-sm font-bold">15 SMK dan kampus terverifikasi</p>
                    <p className="text-xs text-[#52514E] font-medium">Tersebar di 9 kabupaten kota di Bali.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="w-7 h-7 shrink-0 rounded-lg bg-[#FFBE2E] border-2 border-[#141413] flex items-center justify-center text-xs font-black">03</span>
                  <div>
                    <p className="text-sm font-bold">Privasi aman</p>
                    <p className="text-xs text-[#52514E] font-medium">Mode tamu anonim tetap tersedia kapan saja tanpa registrasi.</p>
                  </div>
                </div>
              </div>
              <div className="mt-8 flex justify-center">
                <JepunMascot />
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
