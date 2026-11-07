"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/useAuth";

interface NavbarProps {
  onOpenLogin?: () => void;
  onOpenTest?: () => void;
  onOpenRegister?: () => void;
}

export default function Navbar({
  onOpenLogin,
  onOpenTest,
  onOpenRegister,
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  // Modal lama dipertahankan sebagai fallback agar page lama tetap kompatibel
  void onOpenLogin;
  void onOpenRegister;
  void onOpenTest;

  return (
    <header className="w-full sticky top-0 z-40 px-3 sm:px-6 lg:px-8 pt-3 sm:pt-4 pointer-events-none">
      <div className="max-w-7xl mx-auto pointer-events-auto">
        {/* Unified Single Navbar Card */}
        <div className="bg-white border-2 border-[#141413] rounded-2xl shadow-[0_5px_0_#141413] px-4 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between gap-3 lg:gap-4 transition-all">
          {/* Brand Logo + Sticker Tag */}
          <Link
            href="/"
            className="flex items-center gap-3 group focus:outline-none rounded-xl p-1 transition-all shrink-0"
          >
            <div className="w-9 h-9 rounded-xl bg-[#B8F348] border-2 border-[#141413] shadow-[2px_2px_0px_#141413] flex items-center justify-center text-[#141413] group-hover:-rotate-6 transition-transform font-display font-black text-base">
              KM
            </div>
            <span className="font-display font-extrabold text-lg sm:text-xl text-[#141413] tracking-tight">
              KertaMarga
            </span>
          </Link>

          {/* Center Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2 text-xs xl:text-sm font-bold text-[#141413]">
            <Link
              href="/peta-bidang/informatika"
              className="px-2.5 xl:px-3 py-1.5 rounded-lg hover:bg-[#F0ECE1] transition-colors whitespace-nowrap"
            >
              Peta Bidang
            </Link>
            <Link
              href="/katalog"
              className="px-2.5 xl:px-3 py-1.5 rounded-lg hover:bg-[#F0ECE1] transition-colors whitespace-nowrap"
            >
              Katalog Kampus
            </Link>
            <Link
              href="/#peta-kampus"
              className="px-2.5 xl:px-3 py-1.5 rounded-lg hover:bg-[#F0ECE1] transition-colors whitespace-nowrap"
            >
              Radar Bali
            </Link>
            <Link
              href="/hasil-analisis"
              className="px-2.5 xl:px-3 py-1.5 rounded-lg hover:bg-[#F0ECE1] transition-colors whitespace-nowrap"
            >
              Modul &amp; Sertifikasi
            </Link>
            <Link
              href="/ai-navigator"
              className="ml-1 mr-1 px-3 py-1.5 rounded-lg bg-[#3B66FF]/10 border border-[#3B66FF] text-[#3B66FF] hover:bg-[#3B66FF] hover:text-white transition-colors flex items-center gap-1.5 font-mono text-xs whitespace-nowrap shrink-0 shadow-xs"
            >
              <span className="w-2 h-2 rounded-full bg-[#1AD598] border border-[#141413]" />
              <span>AI Navigator</span>
            </Link>
          </nav>

          {/* Visual Divider between navigation and auth actions */}
          <div className="hidden lg:block h-6 w-[2px] bg-[#141413]/15 mx-1 xl:mx-2 shrink-0" />

          {/* Right Action Group - Integrated inside navbar with balanced padding */}
          <div className="flex items-center gap-2 sm:gap-2.5 lg:gap-3 shrink-0">
            {user ? (
              <div className="hidden sm:flex items-center gap-2">
                <div className="flex items-center gap-2 px-3 h-9 sm:h-10 rounded-xl border-2 border-[#141413] bg-[#F0ECE1]">
                  <span className="w-6 h-6 rounded-lg bg-[#B8F348] border border-[#141413] flex items-center justify-center font-display font-extrabold text-xs text-[#141413]">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                  <div className="text-left leading-none">
                    <span className="block font-display font-extrabold text-xs text-[#141413] max-w-[120px] truncate">
                      {user.name}
                    </span>
                    <span className="text-[10px] font-mono text-[#52514E] uppercase">
                      {user.role === "guru" ? "Guru BK" : "Siswa"}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={logout}
                  className="h-9 sm:h-10 text-xs font-bold text-[#141413] hover:bg-[#FFE5E0] hover:text-[#7A1A12] px-3.5 rounded-xl border-2 border-[#141413] bg-white transition-all cursor-pointer"
                  title="Keluar dari akun"
                >
                  Keluar
                </button>
              </div>
            ) : (
              <>
                <Link
                  href="/login"
                  className="hidden sm:inline-flex items-center justify-center h-9 sm:h-10 text-xs sm:text-sm font-bold text-[#141413] hover:bg-[#F0ECE1] px-3 rounded-xl border-2 border-transparent hover:border-[#141413] transition-all cursor-pointer whitespace-nowrap"
                >
                  Masuk
                </Link>
                <Link
                  href="/daftar"
                  className="hidden sm:inline-flex items-center justify-center h-9 sm:h-10 text-xs sm:text-sm font-bold bg-[#FFBE2E] text-[#141413] hover:bg-[#ffcf4d] px-3.5 rounded-xl border-2 border-[#141413] shadow-[0_3px_0_#141413] hover:translate-y-[1px] hover:shadow-[0_2px_0_#141413] active:translate-y-[3px] active:shadow-none transition-all cursor-pointer whitespace-nowrap"
                >
                  Buat Akun
                </Link>
              </>
            )}

            {/* Primary Tactile Keycap Button - Inside the card with symmetric right padding */}
            <Link
              href="/eksplorasi"
              className="group inline-flex items-center justify-center h-9 sm:h-10 gap-2 pl-3.5 sm:pl-4 pr-1.5 rounded-xl bg-[#FF5E4D] hover:bg-[#ff4936] text-white border-2 border-[#141413] shadow-[0_3px_0_#141413] hover:translate-y-[1px] hover:shadow-[0_2px_0_#141413] active:translate-y-[3px] active:shadow-none font-display font-extrabold text-xs sm:text-sm transition-all duration-150 cursor-pointer whitespace-nowrap shrink-0"
            >
              <span>Mulai Eksplorasi</span>
              <span className="w-6 h-6 rounded-lg bg-[#B8F348] text-[#141413] border border-[#141413] flex items-center justify-center font-mono text-xs font-bold group-hover:translate-x-0.5 transition-transform">
                &rarr;
              </span>
            </Link>

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              type="button"
              className="lg:hidden p-2 rounded-xl bg-[#F0ECE1] border-2 border-[#141413] text-[#141413] transition-colors"
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
          <div className="lg:hidden mt-2 bg-white border-2 border-[#141413] rounded-2xl shadow-[4px_4px_0px_#141413] p-4 space-y-2.5">
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
              {user ? (
                <>
                  <div className="p-2.5 rounded-xl border-2 border-[#141413] bg-[#F0ECE1] flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className="w-8 h-8 rounded-lg bg-[#B8F348] border border-[#141413] flex items-center justify-center font-display font-extrabold text-xs text-[#141413]">
                        {user.name.charAt(0).toUpperCase()}
                      </span>
                      <div>
                        <p className="font-display font-extrabold text-xs text-[#141413]">
                          {user.name}
                        </p>
                        <p className="text-[10px] font-mono text-[#52514E]">
                          {user.role === "guru" ? "Guru BK" : "Siswa"} &bull; {user.identifier}
                        </p>
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full py-2.5 rounded-xl border-2 border-[#141413] bg-[#FFE5E0] text-[#7A1A12] text-xs font-bold text-center cursor-pointer"
                  >
                    Keluar dari Akun
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full py-2.5 rounded-xl border-2 border-[#141413] bg-[#F0ECE1] text-[#141413] text-xs font-bold text-center"
                  >
                    Masuk Akun
                  </Link>
                  <Link
                    href="/daftar"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full py-2.5 rounded-xl border-2 border-[#141413] bg-[#FFBE2E] text-[#141413] text-xs font-bold text-center"
                  >
                    Buat Akun Baru
                  </Link>
                </>
              )}
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
