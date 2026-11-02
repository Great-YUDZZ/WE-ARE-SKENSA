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
    <header className="w-full bg-[#080A10]/80 backdrop-blur-xl border-b border-white/[0.06] sticky top-0 z-30 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 sm:h-20 flex items-center justify-between">
        {/* Brand Group (Nocturne style: Moon Crescent Motif + Refined Typography) */}
        <Link
          href="/"
          className="flex items-center gap-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40 rounded-lg p-1 transition-all shrink-0"
        >
          <div className="w-8 h-8 rounded-full bg-white/[0.06] border border-white/15 flex items-center justify-center text-white group-hover:scale-105 transition-transform">
            <svg
              className="w-4 h-4 text-white/90"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
              />
            </svg>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-display font-medium text-lg sm:text-xl text-[#F4F3F8] tracking-tight">
              KertaMarga
            </span>
            <span className="text-[10px] font-mono tracking-widest text-[#8E9AB5] uppercase px-2 py-0.5 rounded-full bg-white/[0.05] border border-white/10 hidden sm:inline">
              BALI PILOT
            </span>
          </div>
        </Link>

        {/* Center Navigation Links */}
        <nav className="hidden md:flex items-center gap-7 text-xs font-medium text-[#8E9AB5]">
          <a
            href="#peta-kampus"
            className="hover:text-[#F4F3F8] transition-colors"
          >
            Peta Lokasi Bali
          </a>
          <a
            href="#cara-kerja"
            className="hover:text-[#F4F3F8] transition-colors"
          >
            Cara Kerja
          </a>
          <a
            href="#simulator"
            className="hover:text-[#F4F3F8] transition-colors"
          >
            Simulasi Bobot
          </a>
          <Link
            href="/ai-navigator"
            className="hover:text-[#F4F3F8] text-[#D2D8F0] transition-colors flex items-center gap-1.5"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#4ED69E] animate-pulse" />
            <span>AI Navigator</span>
          </Link>
        </nav>

        {/* Right Action Group */}
        <div className="flex items-center gap-3 sm:gap-4">
          <button
            onClick={onOpenLogin}
            type="button"
            className="text-xs font-medium text-[#8E9AB5] hover:text-[#F4F3F8] px-3 py-1.5 transition-colors cursor-pointer"
          >
            Masuk Akun
          </button>

          {/* Primary Pill Button (Try it free style) */}
          <button
            onClick={onOpenRegister || onOpenTest}
            type="button"
            className="h-9 sm:h-10 px-5 rounded-full bg-[#F4F3F8] hover:bg-white text-[#080A10] font-sans font-semibold text-xs sm:text-sm transition-all duration-150 active:scale-97 cursor-pointer flex items-center justify-center gap-1.5 shadow-sm"
          >
            <span>Mulai Tes</span>
            <span className="font-mono text-xs">&rarr;</span>
          </button>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            type="button"
            className="md:hidden p-2 rounded-lg text-[#8E9AB5] hover:text-[#F4F3F8] hover:bg-white/5 transition-colors"
            aria-label="Toggle navigation menu"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0D101A] border-b border-white/10 px-4 pt-3 pb-6 space-y-3">
          <a
            href="#peta-kampus"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm text-[#8E9AB5] hover:text-[#F4F3F8]"
          >
            Peta Lokasi Bali
          </a>
          <a
            href="#cara-kerja"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm text-[#8E9AB5] hover:text-[#F4F3F8]"
          >
            Cara Kerja
          </a>
          <a
            href="#simulator"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm text-[#8E9AB5] hover:text-[#F4F3F8]"
          >
            Simulasi Bobot
          </a>
          <Link
            href="/ai-navigator"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm text-[#D2D8F0]"
          >
            AI Navigator &rarr;
          </Link>
          <div className="pt-2 border-t border-white/10 flex flex-col gap-2">
            <button
              onClick={() => {
                onOpenLogin();
                setMobileMenuOpen(false);
              }}
              type="button"
              className="w-full py-2.5 rounded-full border border-white/15 text-white text-xs font-medium"
            >
              Masuk Akun
            </button>
            <button
              onClick={() => {
                (onOpenRegister || onOpenTest)();
                setMobileMenuOpen(false);
              }}
              type="button"
              className="w-full py-2.5 rounded-full bg-[#F4F3F8] text-[#080A10] text-xs font-semibold"
            >
              Mulai Tes Gratis
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
