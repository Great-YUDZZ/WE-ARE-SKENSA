"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import BaliInteractiveMap from "@/components/BaliInteractiveMap";
import HowItWorksSection from "@/components/HowItWorksSection";
import PrioritySimulatorSection from "@/components/PrioritySimulatorSection";
import ClosingCtaBand from "@/components/ClosingCtaBand";
import LoginModal from "@/components/LoginModal";

export default function Home() {
  const router = useRouter();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 3800);
  };

  const handleOpenLogin = () => {
    setAuthMode("login");
    setIsLoginModalOpen(true);
  };

  const handleOpenRegister = () => {
    setAuthMode("register");
    setIsLoginModalOpen(true);
  };

  const handleOpenTest = (_fieldId?: string) => {
    router.push("/eksplorasi");
  };

  const handleProceedToTest = (isAnonymous: boolean, selectedInterests?: string[]) => {
    setIsLoginModalOpen(false);
    const interestsCount = selectedInterests?.length || 0;
    if (isAnonymous) {
      triggerToast(
        interestsCount > 0
          ? `Mode Tamu Anonim Aktif (${interestsCount} stiker minat dipilih). Membuka Studio Eksplorasi...`
          : "Mode Tamu Anonim Aktif. Membuka Studio Eksplorasi..."
      );
    } else {
      triggerToast("Berhasil Masuk! Menyiapkan Dasbor Rekomendasi Jurusanmu...");
    }
    setTimeout(() => {
      router.push("/eksplorasi");
    }, 800);
  };

  return (
    <div className="min-h-screen flex flex-col justify-between neopop-canvas-subtle text-[#141413] relative selection:bg-[#B8F348] selection:text-[#141413]">
      {/* Floating Tactile Toast Notification */}
      {toastMessage && (
        <div className="fixed top-24 right-4 sm:right-8 z-50 neo-card px-5 py-3 rounded-2xl bg-[#141413] text-white flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-200 max-w-md">
          <div className="w-3 h-3 rounded-full bg-[#B8F348] shrink-0" />
          <span className="text-xs sm:text-sm font-display font-bold">
            {toastMessage}
          </span>
        </div>
      )}

      {/* Top Floating Tactile Navbar */}
      <Navbar
        onOpenLogin={handleOpenLogin}
        onOpenRegister={handleOpenRegister}
        onOpenTest={() => handleOpenTest()}
      />

      {/* Main Content Body */}
      <main className="flex-1 flex flex-col relative z-10">
        {/* SECTION 1: HERO SECTION (Clean Centered Landing Page Layout) */}
        <section className="max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-12 sm:pt-20 pb-16 sm:pb-24 text-center">
          <div className="flex flex-col items-center space-y-6 sm:space-y-8 max-w-4xl mx-auto">
            {/* Sticker Pill Tag */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border-2 border-[#141413] shadow-[2px_2px_0px_#141413]">
              <span className="w-2.5 h-2.5 rounded-full bg-[#1AD598] border border-[#141413]" />
              <span className="text-xs font-mono font-bold tracking-wider text-[#141413] uppercase">
                KOMPAS JURUSAN &amp; KAMPUS PELAJAR BALI
              </span>
            </div>

            {/* Display Headline with Inline Pill Badges */}
            <h1 className="font-display font-black text-4xl sm:text-6xl lg:text-[64px] text-[#141413] leading-[1.1] tracking-tight">
              Bingung Lulus Mau ke Mana? Temukan{" "}
              <span className="inline-block px-3.5 sm:px-4 py-0.5 rounded-2xl bg-[#B8F348] border-2 border-[#141413] shadow-[3px_3px_0px_#141413] -rotate-1 align-baseline">
                Jurusan
              </span>{" "}
              &amp;{" "}
              <span className="inline-block px-3.5 sm:px-4 py-0.5 rounded-2xl bg-[#FFBE2E] border-2 border-[#141413] shadow-[3px_3px_0px_#141413] rotate-1 align-baseline">
                Kampus Bali
              </span>{" "}
              yang Satu Frekuensi.
            </h1>

            {/* Sub-Headline */}
            <p className="text-base sm:text-xl text-[#52514E] font-medium max-w-2xl leading-relaxed mx-auto">
              Gak perlu pusing nebak-nebak prodi atau takut salah pilih. Atur prioritas minat, jarak tempuh, dan biaya, lalu temukan rekomendasi terbaik dari 15 SMK dan kampus se-Bali berbasis data resmi.
            </p>

            {/* Tactile Keycap Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
              {/* Primary Keycap Button with Inner Icon Box */}
              <Link
                href="/eksplorasi"
                className="group relative w-full sm:w-auto inline-flex items-center justify-between sm:justify-center gap-4 pl-6 pr-2.5 py-2.5 rounded-2xl bg-[#FF5E4D] hover:bg-[#ff4b38] text-white border-2 border-[#141413] shadow-[0_6px_0_#141413] hover:translate-y-[2px] hover:shadow-[0_4px_0_#141413] active:translate-y-[6px] active:shadow-none transition-all duration-150 cursor-pointer"
              >
                <div className="text-left">
                  <span className="block text-[10px] font-mono font-bold uppercase tracking-wider text-[#FAF7F2]/90">
                    GRATIS &amp; TANPA LOGIN
                  </span>
                  <span className="block font-display font-black text-base sm:text-lg leading-tight">
                    Mulai Tes 5 Menit
                  </span>
                </div>
                <span className="w-11 h-11 rounded-xl bg-[#B8F348] text-[#141413] border-2 border-[#141413] flex items-center justify-center shrink-0 group-hover:translate-x-0.5 group-hover:-rotate-6 transition-transform">
                  <svg
                    className="w-5 h-5 stroke-[2.75]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                    />
                  </svg>
                </span>
              </Link>

              {/* Secondary Keycap Button with Left Map Badge */}
              <a
                href="#peta-kampus"
                className="group relative w-full sm:w-auto inline-flex items-center justify-between sm:justify-center gap-3.5 pl-2.5 pr-6 py-2.5 rounded-2xl bg-white hover:bg-[#F0ECE1] text-[#141413] border-2 border-[#141413] shadow-[0_6px_0_#141413] hover:translate-y-[2px] hover:shadow-[0_4px_0_#141413] active:translate-y-[6px] active:shadow-none transition-all duration-150 cursor-pointer"
              >
                <span className="w-11 h-11 rounded-xl bg-[#3B66FF] text-white border-2 border-[#141413] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <svg
                    className="w-5 h-5 stroke-[2.25]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
                    />
                  </svg>
                </span>
                <div className="text-left">
                  <span className="block text-[10px] font-mono font-bold uppercase tracking-wider text-[#52514E]">
                    GOOGLE MAPS BALI
                  </span>
                  <span className="block font-display font-black text-base sm:text-lg leading-tight text-[#141413]">
                    Eksplor 15 Kampus
                  </span>
                </div>
              </a>
            </div>

            {/* Micro-Trust Checklist */}
            <div className="pt-4 flex flex-wrap items-center justify-center gap-y-2.5 gap-x-6 text-xs sm:text-sm font-bold text-[#52514E]">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-[#B8F348] border-2 border-[#141413] text-[#141413] flex items-center justify-center text-xs font-black">
                  ✓
                </span>
                <span>100% Gratis &amp; Tanpa Syarat</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-[#3B66FF] border-2 border-[#141413] text-white flex items-center justify-center text-xs font-black">
                  ✓
                </span>
                <span>Data Resmi BAN-PT &amp; PDDIKTI</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-[#FFBE2E] border-2 border-[#141413] text-[#141413] flex items-center justify-center text-xs font-black">
                  ✓
                </span>
                <span>15 Kampus &amp; SMK di 9 Kabupaten/Kota</span>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 2: ASYMMETRIC BENTO STUDIO (4 Steps) */}
        <HowItWorksSection />

        {/* SECTION 3: TACTILE STUDIO EQUALIZER (Priority Simulator + 4 Boundary States) */}
        <PrioritySimulatorSection onOpenTest={handleOpenTest} />

        {/* SECTION 4: GOOGLE MAPS BALI CONSOLE FRAME */}
        <section
          id="peta-kampus"
          className="py-16 sm:py-24 border-t-2 border-[#141413] bg-white scroll-mt-20"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mb-10 sm:mb-12">
              <h2 className="font-display font-black text-3xl sm:text-5xl text-[#141413] tracking-tight leading-[1.1]">
                Radar{" "}
                <span className="inline-block px-3 py-0.5 rounded-xl bg-[#1AD598] border-2 border-[#141413] shadow-[3px_3px_0px_#141413] -rotate-1">
                  Google Maps
                </span>{" "}
                Kampus &amp; SMK se-Bali
              </h2>
              <p className="mt-3 text-sm sm:text-base text-[#52514E] font-medium leading-relaxed">
                Langsung cek lokasi asli 15 perguruan tinggi dan SMK unggulan di 9 kabupaten/kota Bali, lengkap dengan status akreditasi dan jurusannya.
              </p>
            </div>

            <BaliInteractiveMap onOpenTest={handleOpenTest} />
          </div>
        </section>

        {/* SECTION 5: CLOSING CTA BAND */}
        <ClosingCtaBand
          onOpenTest={() => handleOpenTest()}
          onOpenLogin={handleOpenLogin}
        />
      </main>

      {/* Tactile Neo-Pop Footer */}
      <footer className="w-full bg-[#141413] text-white border-t-2 border-[#141413] py-10 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <div>
            <div className="flex items-center justify-center md:justify-start gap-2.5 mb-1.5">
              <span className="w-6 h-6 rounded-lg bg-[#B8F348] text-[#141413] font-display font-black text-xs flex items-center justify-center">
                KM
              </span>
              <span className="font-display font-extrabold text-base text-white">
                KertaMarga Bali
              </span>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#FFBE2E] text-[#141413]">
                DIGIFEST 2026
              </span>
            </div>
            <p className="text-xs text-[#F0ECE1]/80">
              Studio Eksplorasi Jurusan &amp; Penjurusan AI untuk Pelajar SMP, SMA, dan SMK di Bali
            </p>
          </div>
          <div className="text-xs font-mono text-[#F0ECE1]/70 flex flex-col sm:flex-row gap-2 sm:gap-4 items-center">
            <span>Data Resmi: PDDIKTI, BAN-PT, BPS Bali</span>
            <span className="hidden sm:inline">&bull;</span>
            <span className="text-[#B8F348]">Desain Ramah Pelajar &amp; Bebas Iklan</span>
          </div>
        </div>
      </footer>

      {/* Login & Preferences Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onProceedToTest={handleProceedToTest}
        initialMode={authMode}
      />
    </div>
  );
}
