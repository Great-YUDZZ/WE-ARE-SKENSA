"use client";

import React, { useState } from "react";
import Link from "next/link";

interface NavbarProps {
  onOpenLogin: () => void;
  onOpenTest: () => void;
  onOpenRegister?: () => void;
}

export default function Navbar({
  onOpenLogin,
  onOpenTest,
  onOpenRegister,
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="w-full sticky top-0 z-40 px-3 sm:px-6 lg:px-8 pt-3 sm:pt-4 pointer-events-none">
      <div className="max-w-7xl mx-auto pointer-events-auto">
        <div className="bg-white border-2 border-[#141413] rounded-2xl shadow-[0_5px_0_#141413] px-4 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between transition-all">
          {/* Brand Logo + Sticker Tag */}
          <Link
            href="/"
            className="flex items-center gap-3 group focus:outline-none rounded-xl p-1 transition-all shrink-0"
          >
            <div className="w-9 h-9 rounded-xl bg-[#B8F348] border-2 border-[#141413] shadow-[2px_2px_0px_#141413] flex items-center justify-center text-[#141413] group-hover:-rotate-6 transition-transform font-display font-black text-base">
              KM
            </div>
            <div className="flex items-center gap-2">
              <span className="font-display font-extrabold text-lg sm:text-xl text-[#141413] tracking-tight">
                KertaMarga
              </span>
              <span className="text-[10px] font-mono font-bold tracking-wider text-[#141413] uppercase px-2 py-0.5 rounded-md bg-[#FFBE2E] border-2 border-[#141413] hidden sm:inline">
                BALI GEN-Z
              </span>
            </div>
          </Link>

          {/* Center Navigation Links */}
          <nav className="hidden md:flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#141413]">
            <Link
              href="/eksplorasi"
              className="px-3 py-1.5 rounded-lg bg-[#B8F348]/20 hover:bg-[#B8F348] text-[#141413] border border-[#141413] transition-colors"
            >
              Kuesioner Minat
            </Link>
            <Link
              href="/peta-bidang/informatika"
              className="px-3 py-1.5 rounded-lg hover:bg-[#F0ECE1] transition-colors"
            >
              Peta Bidang
            </Link>
            <Link
              href="/katalog"
              className="px-3 py-1.5 rounded-lg hover:bg-[#F0ECE1] transition-colors"
            >
              Katalog Kampus
            </Link>
            <Link
              href="/#peta-kampus"
              className="px-3 py-1.5 rounded-lg hover:bg-[#F0ECE1] transition-colors"
            >
              Radar Peta Bali
            </Link>
            <Link
              href="/hasil-analisis"
              className="px-3 py-1.5 rounded-lg hover:bg-[#F0ECE1] transition-colors"
            >
              Modul & Sertifikasi
            </Link>
            <Link
              href="/ai-navigator"
              className="ml-1 px-3 py-1.5 rounded-lg bg-[#3B66FF]/10 border border-[#3B66FF] text-[#3B66FF] hover:bg-[#3B66FF] hover:text-white transition-colors flex items-center gap-1.5 font-mono text-xs"
            >
              <span className="w-2 h-2 rounded-full bg-[#1AD598] border border-[#141413]" />
              <span>AI Navigator</span>
            </Link>
          </nav>

          {/* Right Action Group */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            <button
              onClick={onOpenLogin}
              type="button"
              className="hidden sm:inline-flex text-xs sm:text-sm font-bold text-[#141413] hover:bg-[#F0ECE1] px-3.5 py-2 rounded-xl border-2 border-transparent hover:border-[#141413] transition-all cursor-pointer"
            >
              Masuk
            </button>

            {/* Primary Tactile Keycap Button */}
            <Link
              href="/eksplorasi"
              className="group inline-flex items-center gap-2.5 pl-4 pr-1.5 py-1.5 rounded-xl bg-[#FF5E4D] hover:bg-[#ff4936] text-white border-2 border-[#141413] shadow-[0_4px_0_#141413] hover:translate-y-[1px] hover:shadow-[0_3px_0_#141413] active:translate-y-[4px] active:shadow-none font-display font-extrabold text-xs sm:text-sm transition-all duration-150 cursor-pointer"
            >
              <span>Mulai Eksplorasi</span>
              <span className="w-7 h-7 rounded-lg bg-[#B8F348] text-[#141413] border-2 border-[#141413] flex items-center justify-center font-mono text-xs font-bold group-hover:translate-x-0.5 transition-transform">
                &rarr;
              </span>
            </Link>

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              type="button"
              className="md:hidden p-2 rounded-xl bg-[#F0ECE1] border-2 border-[#141413] text-[#141413] transition-colors"
              aria-label="Buka menu navigasi"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-2 bg-white border-2 border-[#141413] rounded-2xl shadow-[4px_4px_0px_#141413] p-4 space-y-2.5">
            <Link
              href="/eksplorasi"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-xl font-bold text-sm text-[#141413] bg-[#B8F348]/20 border border-[#141413]"
            >
              Kuesioner Minat 5 Menit
            </Link>
            <Link
              href="/peta-bidang/informatika"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-xl font-bold text-sm text-[#141413] hover:bg-[#F0ECE1]"
            >
              Peta Bidang &amp; Karier
            </Link>
            <Link
              href="/katalog"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-xl font-bold text-sm text-[#141413] hover:bg-[#F0ECE1]"
            >
              Katalog Kampus &amp; SMK
            </Link>
            <Link
              href="/#peta-kampus"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-xl font-bold text-sm text-[#141413] hover:bg-[#F0ECE1]"
            >
              Radar Peta Bali
            </Link>
            <Link
              href="/hasil-analisis"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-xl font-bold text-sm text-[#141413] hover:bg-[#F0ECE1]"
            >
              Modul &amp; Sertifikasi
            </Link>
            <Link
              href="/ai-navigator"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-xl font-mono font-bold text-sm text-[#3B66FF] bg-[#3B66FF]/10 border border-[#3B66FF]"
            >
              Buka AI Navigator &rarr;
            </Link>
            <div className="pt-2 border-t-2 border-[#141413]/10 flex flex-col gap-2">
              <button
                onClick={() => {
                  onOpenLogin();
                  setMobileMenuOpen(false);
                }}
                type="button"
                className="w-full py-2.5 rounded-xl border-2 border-[#141413] bg-[#F0ECE1] text-[#141413] text-xs font-bold"
              >
                Masuk Akun
              </button>
              <Link
                href="/eksplorasi"
                onClick={() => setMobileMenuOpen(false)}
                className="neo-btn w-full py-2.5 rounded-xl bg-[#FF5E4D] text-white text-xs font-bold text-center"
              >
                Mulai Eksplorasi Sekarang
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
