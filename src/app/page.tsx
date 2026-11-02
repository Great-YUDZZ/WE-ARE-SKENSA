"use client";

import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import BaliInteractiveMap from "@/components/BaliInteractiveMap";
import HowItWorksSection from "@/components/HowItWorksSection";
import PrioritySimulatorSection from "@/components/PrioritySimulatorSection";
import ClosingCtaBand from "@/components/ClosingCtaBand";
import LoginModal from "@/components/LoginModal";
import JepunMascot from "@/components/JepunMascot";

export default function Home() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleOpenLogin = () => {
    setAuthMode("login");
    setIsLoginModalOpen(true);
  };

  const handleOpenRegister = () => {
    setAuthMode("register");
    setIsLoginModalOpen(true);
  };

  const handleOpenTest = (_fieldId?: string) => {
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
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-kmNeutral-latar dark:bg-kmNeutral-darkLatar text-kmNeutral-tinta dark:text-kmNeutral-darkTeks relative transition-colors selection:bg-[#FFC93C] selection:text-[#1B1B2F]">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-24 right-4 sm:right-8 z-50 bg-[#1B1B2F] text-white px-5 py-3 rounded-lg shadow-2xl border-2 border-[#D7263D] flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-200">
          <div className="w-2.5 h-2.5 rounded-full bg-[#2E9E6B] animate-pulse" />
          <span className="text-xs sm:text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Top Navigation (Youform Style: Solid, No Glassmorphism, Login text link & Buat Akun yellow button) */}
      <Navbar
        onOpenLogin={handleOpenLogin}
        onOpenRegister={handleOpenRegister}
        onOpenTest={() => handleOpenTest()}
      />

      {/* Main Content Body */}
      <main className="flex-1 flex flex-col relative z-10">
        {/* HERO SECTION (Youform Style: Centered Headline, Micro Trust Checklist, Mascot, and Embedded Browser Frame) */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-20 pb-16">
          <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
            {/* Context Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono font-bold bg-[#2E9E6B]/15 text-[#1F7A52] dark:text-[#4CC992] border border-[#2E9E6B]/30 mb-6 shadow-xs">
              <span className="h-2 w-2 rounded-full bg-[#2E9E6B] animate-pulse" />
              <span>NAVIGASI PENDIDIKAN TINGGI & VOKASI SE-BALI</span>
            </div>

            {/* Youform-style Big Serif Headline with Italic Contrast */}
            <h1 className="font-serif font-bold text-4xl sm:text-6xl lg:text-[64px] text-kmNeutral-tinta dark:text-kmNeutral-darkTeks leading-[1.12] tracking-tight">
              Masa depan cerah berawal dari{" "}
              <span className="italic font-normal text-[#D7263D] dark:text-[#FF5A6B] underline decoration-[#FFC93C] decoration-wavy decoration-2">
                arah yang tepat.
              </span>
            </h1>

            {/* Sub-headline */}
            <p className="mt-6 text-base sm:text-lg text-kmNeutral-sekunder dark:text-kmNeutral-darkSekunder max-w-2xl leading-relaxed">
              Eksplorasi minat, potensi diri, dan preferensi lokasi lewat kuesioner terarah 5 menit yang dianalisis secara objektif dengan data resmi perguruan tinggi dan SMK di Bali.
            </p>

            {/* Micro-Trust Checklist */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-y-2 gap-x-6 text-xs sm:text-sm font-medium text-kmNeutral-sekunder dark:text-kmNeutral-darkSekunder">
              <div className="flex items-center gap-1.5">
                <span className="w-4 h-4 rounded-full bg-[#2E9E6B]/20 text-[#1F7A52] dark:text-[#4CC992] flex items-center justify-center text-[10px] font-bold">
                  ✓
                </span>
                <span>100% Gratis & Kuesioner Adaptif</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-4 h-4 rounded-full bg-[#2D6CDF]/20 text-[#2D6CDF] dark:text-[#6C9BFF] flex items-center justify-center text-[10px] font-bold">
                  ✓
                </span>
                <span>Data Resmi PDDIKTI & BAN-PT</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-4 h-4 rounded-full bg-[#FFC93C]/30 text-[#1B1B2F] dark:text-[#FFD25E] flex items-center justify-center text-[10px] font-bold">
                  ✓
                </span>
                <span>Transparan Tanpa Sponsor Kampus</span>
              </div>
            </div>

            {/* Tactile Action Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
              {/* Tombol Utama: Merah (#D7263D) teks putih */}
              <button
                onClick={() => handleOpenTest()}
                type="button"
                className="w-full sm:w-auto h-13 px-8 rounded-xl bg-[#D7263D] hover:bg-[#B91C30] text-white font-sans font-bold text-sm sm:text-base shadow-tactileRed active:translate-y-1 active:shadow-none transition-all duration-150 cursor-pointer flex items-center justify-center gap-2 group"
              >
                <span>Mulai Tes Sekarang</span>
                <span className="group-hover:translate-x-1 transition-transform font-mono">&rarr;</span>
              </button>

              {/* Tombol Sekunder: Netral */}
              <a
                href="#peta-kampus"
                className="w-full sm:w-auto h-13 px-8 rounded-xl border-2 border-kmNeutral-garis dark:border-kmNeutral-darkPermukaan bg-kmNeutral-surface dark:bg-kmNeutral-darkPermukaan hover:bg-kmNeutral-latar dark:hover:bg-[#252538] text-kmNeutral-tinta dark:text-kmNeutral-darkTeks font-sans font-bold text-sm sm:text-base transition-colors duration-150 cursor-pointer flex items-center justify-center"
              >
                Lihat Peta Kampus Bali
              </a>
            </div>

            {/* Bunga Jepun Mascot Prompt pointing down to preview */}
            <div className="mt-8">
              <JepunMascot />
            </div>
          </div>

          {/* Embedded Interactive Map Preview Frame in Dark Panel (#1B1B2F) */}
          <div id="peta-kampus" className="mt-10 max-w-6xl mx-auto scroll-mt-24">
            <BaliInteractiveMap onOpenTest={handleOpenTest} />
          </div>
        </section>

        {/* SECTION 2: 4 Steps (Sequential Red, Yellow, Blue, Green Step Badges) */}
        <HowItWorksSection />

        {/* SECTION 3: Priority Simulator (Kecocokan Biru, Jarak Hijau, Biaya Merah) */}
        <PrioritySimulatorSection onOpenTest={() => handleOpenTest()} />

        {/* SECTION 4: Closing CTA Band (Full Yellow with Ink Text and Ink Button) */}
        <ClosingCtaBand
          onOpenTest={() => handleOpenTest()}
          onOpenLogin={handleOpenLogin}
        />
      </main>

      {/* Minimalist Footer */}
      <footer className="w-full bg-kmNeutral-surface dark:bg-kmNeutral-darkPermukaan border-t border-kmNeutral-garis dark:border-[#2E2E42] py-8 px-4 sm:px-6 lg:px-8 relative z-10 transition-colors">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <div>
            <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
              <span className="w-5 h-5 rounded bg-[#FFC93C] text-[#1B1B2F] font-mono font-bold text-[10px] flex items-center justify-center">
                KM
              </span>
              <span className="font-serif font-bold text-sm text-kmNeutral-tinta dark:text-kmNeutral-darkTeks">
                KertaMarga Bali
              </span>
            </div>
            <p className="text-xs text-kmNeutral-sekunder dark:text-kmNeutral-darkSekunder">
              Inovasi Navigasi Karier & Penjurusan AI untuk Bali DigiFest 2026 (Kategori SMK)
            </p>
          </div>
          <div className="text-[11px] font-mono text-kmNeutral-sekunder dark:text-kmNeutral-darkSekunder flex flex-col sm:flex-row gap-2 sm:gap-4 items-center">
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
