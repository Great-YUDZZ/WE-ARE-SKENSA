"use client";

import React, { useState } from "react";
import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";

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

  const handleRegisterClick = () => {
    if (onOpenRegister) {
      onOpenRegister();
    } else {
      onOpenTest();
    }
    setMobileMenuOpen(false);
  };

  const handleLoginClick = () => {
    onOpenLogin();
    setMobileMenuOpen(false);
  };

  return (
    <header className="w-full bg-[#FFFDF8] dark:bg-[#14141F] border-b border-[#E6E1D6] dark:border-[#2E2E42] sticky top-0 z-30 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 sm:h-20 flex items-center justify-between">
        {/* Brand Group (Youform style: Cheerful Yellow Flower Icon + Bold Modern Typography) */}
        <Link
          href="/"
          className="flex items-center gap-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FFC93C] rounded-lg p-1 transition-all shrink-0"
        >
          {/* Flower Mascot Icon strictly constrained in size */}
          <div
            style={{ width: 38, height: 38, minWidth: 38, minHeight: 38 }}
            className="w-[38px] h-[38px] rounded-xl bg-[#FFC93C] flex items-center justify-center shrink-0 overflow-hidden shadow-xs group-hover:rotate-6 transition-transform duration-200"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              style={{ width: 24, height: 24, display: "block" }}
              className="shrink-0"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Petals */}
              <circle cx="12" cy="4.5" r="2.8" fill="#F5B82A" />
              <circle cx="12" cy="19.5" r="2.8" fill="#F5B82A" />
              <circle cx="4.5" cy="12" r="2.8" fill="#F5B82A" />
              <circle cx="19.5" cy="12" r="2.8" fill="#F5B82A" />
              <circle cx="6.5" cy="6.5" r="2.8" fill="#F5B82A" />
              <circle cx="17.5" cy="17.5" r="2.8" fill="#F5B82A" />
              <circle cx="6.5" cy="17.5" r="2.8" fill="#F5B82A" />
              <circle cx="17.5" cy="6.5" r="2.8" fill="#F5B82A" />
              {/* Center face */}
              <circle cx="12" cy="12" r="4.6" fill="#1B1B2F" />
              {/* Eyes */}
              <circle cx="10.4" cy="11.2" r="0.8" fill="#FFC93C" />
              <circle cx="13.6" cy="11.2" r="0.8" fill="#FFC93C" />
              {/* Smile */}
              <path
                d="M10.6 13.3C11 14.1 13 14.1 13.4 13.3"
                stroke="#FFC93C"
                strokeWidth="0.9"
                strokeLinecap="round"
              />
            </svg>
          </div>

          <div className="flex items-center gap-2.5">
            <span className="font-sans font-extrabold text-xl sm:text-2xl text-[#1B1B2F] dark:text-[#F4F2EA] tracking-tight">
              KertaMarga
            </span>
            <span className="text-[10px] font-mono font-bold tracking-wider text-[#1F7A52] dark:text-[#4CC992] uppercase px-2 py-0.5 rounded-full bg-[#2E9E6B]/15 border border-[#2E9E6B]/30 hidden sm:inline-block">
              BALI
            </span>
          </div>
        </Link>

        {/* Center / Navigation Links (Clean Youform Style + Shortcut Khusus AI) */}
        <nav className="hidden md:flex items-center gap-7 lg:gap-8 text-sm font-medium text-[#5A5A70] dark:text-[#A8A8BA]">
          <Link
            href="/#peta-kampus"
            className="hover:text-[#1B1B2F] dark:hover:text-[#F4F2EA] transition-colors py-1"
          >
            Peta Bali
          </Link>
          <Link
            href="/#cara-kerja"
            className="hover:text-[#1B1B2F] dark:hover:text-[#F4F2EA] transition-colors py-1"
          >
            Cara Kerja
          </Link>
          <Link
            href="/#simulator"
            className="hover:text-[#1B1B2F] dark:hover:text-[#F4F2EA] transition-colors py-1"
          >
            Simulasi Prioritas
          </Link>

          {/* Shortcut Halaman Khusus AI */}
          <Link
            href="/ai-navigator"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-[#2E9E6B]/15 text-[#1F7A52] dark:text-[#4CC992] border border-[#2E9E6B]/30 hover:bg-[#2E9E6B]/25 hover:border-[#2E9E6B]/50 transition-all shadow-xs"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#2E9E6B] animate-pulse" />
            <span>AI Navigator</span>
            <span className="text-[9px] font-mono px-1.5 py-0.5 bg-[#FFC93C] text-[#1B1B2F] rounded font-extrabold">
              AI
            </span>
          </Link>
        </nav>

        {/* Right Action Group: ThemeToggle + Login text link + Buat Akun yellow button */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Theme Toggle Button */}
          <ThemeToggle />

          {/* Login Action (Clean text link style, matching photo 2 'Log in') */}
          <button
            onClick={handleLoginClick}
            type="button"
            className="text-sm font-semibold text-[#1B1B2F] dark:text-[#F4F2EA] hover:text-[#D7263D] dark:hover:text-[#FF5A6B] px-3 py-2 transition-colors cursor-pointer rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FFC93C]"
          >
            Login
          </button>

          {/* Buat Akun Action (Warm Yellow Button matching photo 2 'Sign up free ->') */}
          <button
            onClick={handleRegisterClick}
            type="button"
            className="group h-10 px-4.5 sm:px-5 rounded-xl bg-[#FFC93C] hover:bg-[#F5BF2E] active:scale-98 text-[#1B1B2F] font-sans font-semibold text-xs sm:text-sm transition-all duration-150 cursor-pointer flex items-center justify-center gap-1.5 shadow-sm border border-[#E6B020]/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1B1B2F]"
          >
            <span>Buat akun</span>
            <span className="font-mono text-sm transition-transform duration-150 group-hover:translate-x-0.5">
              &rarr;
            </span>
          </button>

          {/* Mobile Menu Hamburger Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            type="button"
            aria-label="Buka menu navigasi"
            className="md:hidden p-2 rounded-lg text-[#1B1B2F] dark:text-[#F4F2EA] hover:bg-[#E6E1D6]/40 dark:hover:bg-[#2E2E42]/50 transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              {mobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu (Solid background, no glassmorphism) */}
      {mobileMenuOpen && (
        <div className="md:hidden w-full bg-[#FFFDF8] dark:bg-[#14141F] border-b border-[#E6E1D6] dark:border-[#2E2E42] px-4 py-4 space-y-3 shadow-lg">
          <div className="flex flex-col space-y-2 text-sm font-medium text-[#5A5A70] dark:text-[#A8A8BA]">
            <Link
              href="/#peta-kampus"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-[#E6E1D6]/40 dark:hover:bg-[#2E2E42] hover:text-[#1B1B2F] dark:hover:text-white transition-colors"
            >
              Peta Bali
            </Link>
            <Link
              href="/#cara-kerja"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-[#E6E1D6]/40 dark:hover:bg-[#2E2E42] hover:text-[#1B1B2F] dark:hover:text-white transition-colors"
            >
              Cara Kerja
            </Link>
            <Link
              href="/#simulator"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-[#E6E1D6]/40 dark:hover:bg-[#2E2E42] hover:text-[#1B1B2F] dark:hover:text-white transition-colors"
            >
              Simulasi Prioritas
            </Link>

            {/* Mobile AI Shortcut */}
            <Link
              href="/ai-navigator"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2.5 rounded-lg bg-[#2E9E6B]/15 border border-[#2E9E6B]/30 text-[#1F7A52] dark:text-[#4CC992] font-bold flex items-center justify-between"
            >
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#2E9E6B] animate-pulse" />
                <span>AI Navigator (Asisten Khusus)</span>
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 bg-[#FFC93C] text-[#1B1B2F] rounded font-extrabold">
                AI
              </span>
            </Link>
          </div>

          <div className="pt-3 border-t border-[#E6E1D6] dark:border-[#2E2E42] flex flex-col gap-2">
            <button
              onClick={handleLoginClick}
              type="button"
              className="w-full py-2.5 text-center text-sm font-semibold text-[#1B1B2F] dark:text-[#F4F2EA] rounded-lg border border-[#E6E1D6] dark:border-[#2E2E42] hover:bg-[#E6E1D6]/30 dark:hover:bg-[#2E2E42]/40 transition-colors"
            >
              Login
            </button>
            <button
              onClick={handleRegisterClick}
              type="button"
              className="w-full py-2.5 text-center text-sm font-semibold text-[#1B1B2F] bg-[#FFC93C] hover:bg-[#F5BF2E] rounded-lg shadow-sm border border-[#E6B020]/40 flex items-center justify-center gap-1.5"
            >
              <span>Buat akun</span>
              <span className="font-mono text-sm">&rarr;</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
