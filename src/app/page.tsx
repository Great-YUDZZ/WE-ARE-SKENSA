"use client";

import React, { useState } from "react";
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
  const [selectedFieldForTest, setSelectedFieldForTest] = useState<string | undefined>(undefined);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleOpenLogin = () => {
    setAuthMode("login");
    setIsLoginModalOpen(true);
  };

  const handleOpenRegister = () => {
    setAuthMode("register");
    setIsLoginModalOpen(true);
  };

  const handleOpenTest = (fieldId?: string) => {
    setSelectedFieldForTest(fieldId);
    setAuthMode("register");
    setIsLoginModalOpen(true);
  };

  const handleProceedToTest = (isAnonymous: boolean, selectedInterests?: string[]) => {
    setIsLoginModalOpen(false);
    const interestsCount = selectedInterests?.length || 0;
    if (isAnonymous) {
      setToastMessage(
        interestsCount > 0
          ? `Mode Tamu Anonim Aktif (${interestsCount} minat dipilih). Membuka Kuesioner Eksplorasi...`
          : "Mode Tamu Anonim Aktif. Membuka Kuesioner Eksplorasi..."
      );
    } else {
      setToastMessage("Berhasil Masuk. Mengalihkan ke Dasbor Rekomendasi Terpadu...");
    }

    const params = new URLSearchParams();
    if (selectedFieldForTest) {
      params.set("field", selectedFieldForTest);
    }
    if (selectedInterests && selectedInterests.length > 0) {
      params.set("interests", selectedInterests.join(","));
    }
    const queryString = params.toString();

    setTimeout(() => {
      router.push(queryString ? `/tes-keminatan?${queryString}` : "/tes-keminatan");
    }, 500);
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#080A10] text-[#F4F3F8] relative selection:bg-white/20 selection:text-white nocturne-ambient">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-24 right-4 sm:right-8 z-50 bg-[#0D101A] text-white px-5 py-3 rounded-full shadow-2xl border border-white/20 flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-200">
          <div className="w-2 h-2 rounded-full bg-[#4ED69E] animate-pulse" />
          <span className="text-xs sm:text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Scattered Ambient Nocturne Stars */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <span className="absolute top-[18%] left-[12%] text-white/30 text-[10px] select-none animate-pulse">
          ✦
        </span>
        <span className="absolute top-[28%] right-[14%] text-white/25 text-[11px] select-none">
          ✦
        </span>
        <span className="absolute top-[45%] left-[8%] text-white/15 text-[8px] select-none">
          ✦
        </span>
        <span className="absolute top-[52%] right-[22%] text-white/20 text-[9px] select-none animate-pulse">
          ✦
        </span>
        <span className="absolute top-[14%] right-[32%] text-white/20 text-[7px] select-none">
          ✦
        </span>
      </div>

      {/* Top Navigation */}
      <Navbar
        onOpenLogin={handleOpenLogin}
        onOpenRegister={handleOpenRegister}
        onOpenTest={() => handleOpenTest()}
      />

      {/* Main Content Body */}
      <main className="flex-1 flex flex-col relative z-10">
        {/* SECTION 1: FULL-SCREEN HERO SECTION (Nocturne Aesthetic) */}
        <section className="w-full min-h-[calc(100vh-4rem)] flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
          <div className="w-full max-w-5xl mx-auto flex flex-col items-center text-center">
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full bg-white/[0.05] border border-white/10 text-xs sm:text-sm font-mono tracking-widest text-[#A3ADC4] mb-8 sm:mb-10 shadow-xs">
              <span className="text-[#D2D8F0] text-xs">✦</span>
              <span>NAVIGASI PENDIDIKAN TINGGI & VOKASI SE-BALI</span>
            </div>

            {/* Nocturne Headline - Scaled up to fill the screen */}
            <h1 className="font-display font-medium text-5xl sm:text-7xl lg:text-[84px] text-[#F4F3F8] leading-[1.08] tracking-tight max-w-5xl">
              Masa depan cerah berawal dari{" "}
              <span className="italic font-normal text-[#D2D8F0]">
                arah yang tepat.
              </span>
            </h1>

            {/* Sub-headline */}
            <p className="mt-7 sm:mt-8 text-lg sm:text-xl lg:text-2xl text-[#8E9AB5] max-w-3xl leading-relaxed">
              Eksplorasi minat, potensi diri, dan preferensi lokasi lewat kuesioner terarah 5 menit yang dianalisis secara objektif dengan data resmi perguruan tinggi dan SMK di Bali.
            </p>

            {/* Micro-Trust Checklist */}
            <div className="mt-8 sm:mt-9 flex flex-wrap items-center justify-center gap-y-3 gap-x-8 text-sm sm:text-base font-medium text-[#8E9AB5]">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-white/[0.08] text-[#4ED69E] flex items-center justify-center text-xs font-bold">
                  ✓
                </span>
                <span>100% Gratis & Kuesioner Adaptif</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-white/[0.08] text-[#5B8DEF] flex items-center justify-center text-xs font-bold">
                  ✓
                </span>
                <span>Data Resmi PDDIKTI & BAN-PT</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-white/[0.08] text-[#F7C95C] flex items-center justify-center text-xs font-bold">
                  ✓
                </span>
                <span>Transparan Tanpa Sponsor Kampus</span>
              </div>
            </div>

            {/* Nocturne Action Buttons */}
            <div className="mt-10 sm:mt-12 flex flex-col sm:flex-row items-center gap-4 sm:gap-5 w-full sm:w-auto">
              {/* Primary Pill Button */}
              <button
                onClick={() => handleOpenTest()}
                type="button"
                className="w-full sm:w-auto h-14 sm:h-15 px-10 rounded-full bg-[#F4F3F8] hover:bg-white text-[#080A10] font-sans font-semibold text-base sm:text-lg transition-all duration-200 active:scale-98 shadow-glowPill flex items-center justify-center gap-2.5 group cursor-pointer"
              >
                <span>Mulai Tes Sekarang</span>
                <span className="group-hover:translate-x-1 transition-transform font-mono text-base">&rarr;</span>
              </button>

              {/* Secondary Pill Button */}
              <a
                href="#peta-kampus"
                className="w-full sm:w-auto h-14 sm:h-15 px-10 rounded-full bg-white/[0.06] hover:bg-white/[0.1] border border-white/15 text-[#F4F3F8] font-sans font-medium text-base sm:text-lg transition-all duration-200 active:scale-98 flex items-center justify-center gap-2.5 cursor-pointer"
              >
                <span className="text-xs text-[#D2D8F0]">▶</span>
                <span>Lihat Peta Lokasi Bali</span>
              </a>
            </div>

            {/* Floating Bottom HUD Dock */}
            <div className="mt-14 sm:mt-16 w-full max-w-3xl px-6 sm:px-8 py-4 rounded-full bg-[#0D101A]/90 border border-white/10 backdrop-blur-md shadow-2xl flex items-center justify-between gap-4 text-xs sm:text-sm">
              <div className="flex items-center gap-3.5">
                <div className="w-9 h-9 rounded-full bg-white/[0.08] flex items-center justify-center text-[#D2D8F0] shrink-0">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div className="text-left">
                  <span className="text-[11px] font-mono text-[#5E687E] block uppercase tracking-wider">
                    RADAR PENDIDIKAN TINGGI & VOKASI
                  </span>
                  <span className="font-display font-medium text-sm sm:text-base text-[#F4F3F8]">
                    15 Kampus & SMK se-Bali Terverifikasi
                  </span>
                </div>
              </div>

              {/* Soundwave indicator & signature */}
              <div className="hidden sm:flex items-center gap-3.5">
                <div className="flex items-center gap-1 text-white/40">
                  <span className="w-0.5 h-3.5 bg-white/40 rounded-full animate-pulse" />
                  <span className="w-0.5 h-5 bg-white/60 rounded-full animate-pulse" />
                  <span className="w-0.5 h-3 bg-white/30 rounded-full animate-pulse" />
                  <span className="w-0.5 h-6 bg-white/70 rounded-full animate-pulse" />
                  <span className="w-0.5 h-3.5 bg-white/40 rounded-full animate-pulse" />
                </div>
                <span className="italic text-[#8E9AB5] text-sm font-serif">
                  Langkah terarah menuju masa depan.
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 1B: FULL-SCREEN INTERACTIVE BALI MAP SECTION */}
        <section
          id="peta-kampus"
          className="w-full min-h-screen flex flex-col justify-center py-20 sm:py-28 px-4 sm:px-6 lg:px-8 border-t border-white/[0.06] scroll-mt-16"
        >
          <div className="max-w-7xl w-full mx-auto space-y-8">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-mono font-medium tracking-widest uppercase bg-white/[0.05] text-[#A3ADC4] border border-white/10 mb-4">
                ✦ RADAR GEOSPASIAL PENDIDIKAN BALI
              </div>
              <h2 className="font-display font-medium text-3xl sm:text-5xl text-[#F4F3F8] tracking-tight">
                Peta Interaktif Kampus & SMK Rujukan se-Bali
              </h2>
              <p className="mt-3 text-sm sm:text-lg text-[#8E9AB5] leading-relaxed">
                Jelajahi sebaran 15 perguruan tinggi dan SMK unggulan di 9 kabupaten/kota Bali beserta rincian akreditasi, mata kuliah, dan prospek karirnya.
              </p>
            </div>
            <BaliInteractiveMap onOpenTest={handleOpenTest} />
          </div>
        </section>

        {/* SECTION 2: 4 Steps */}
        <HowItWorksSection />

        {/* SECTION 3: Priority Simulator */}
        <PrioritySimulatorSection onOpenTest={() => handleOpenTest()} />

        {/* SECTION 4: Closing CTA Band */}
        <ClosingCtaBand
          onOpenTest={() => handleOpenTest()}
          onOpenLogin={handleOpenLogin}
        />
      </main>

      {/* Nocturne Minimalist Footer */}
      <footer className="w-full bg-[#080A10] border-t border-white/[0.06] py-8 px-4 sm:px-6 lg:px-8 relative z-10 transition-colors">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <div>
            <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
              <span className="w-4 h-4 rounded-full bg-white/10 flex items-center justify-center text-[10px] text-white">
                ✦
              </span>
              <span className="font-display font-medium text-sm text-[#F4F3F8]">
                KertaMarga Bali
              </span>
            </div>
            <p className="text-xs text-[#8E9AB5]">
              Inovasi Navigasi Karier & Penjurusan AI untuk Bali DigiFest 2026 (Kategori SMK)
            </p>
          </div>
          <div className="text-[11px] font-mono text-[#5E687E] flex flex-col sm:flex-row gap-2 sm:gap-4 items-center">
            <span>Rujukan: PDDIKTI, BAN-PT, BPS Bali</span>
            <span className="hidden sm:inline">&bull;</span>
            <span>Aksesibilitas WCAG AAA / AA</span>
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
