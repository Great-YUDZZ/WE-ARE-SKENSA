"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/useAuth";
import KertaMargaLogo from "@/components/KertaMargaLogo";

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
    <header className="w-full sticky top-0 z-40 px-3 sm:px-5 lg:px-5 2xl:px-8 pt-3 sm:pt-4 pointer-events-none">
      <div className="max-w-7xl mx-auto pointer-events-auto">
        {/* Unified Single Navbar Card */}
        <div className="bg-white border-2 border-[#141413] rounded-2xl shadow-[0_5px_0_#141413] px-3.5 sm:px-4 2xl:px-6 py-2 sm:py-2.5 flex items-center justify-between gap-2 xl:gap-2.5 2xl:gap-4 transition-all">
          {/* Brand Logo + Sticker Tag */}
          <Link
            href="/"
            className="flex items-center gap-2 2xl:gap-2.5 group focus:outline-none rounded-xl p-0.5 2xl:p-1 transition-all shrink-0"
          >
            <KertaMargaLogo
              variant="compact"
              className="w-9 h-9 2xl:w-10 2xl:h-10 shrink-0 drop-shadow-[2px_2px_0px_#141413] group-hover:rotate-12 transition-transform duration-300"
            />
            <span className="font-display font-extrabold text-base xl:text-lg 2xl:text-xl text-[#141413] tracking-tight">
              KertaMarga
            </span>
          </Link>

          {/* Center Navigation Links */}
          <nav className="hidden lg:flex items-center gap-0.5 xl:gap-1 2xl:gap-1.5 text-xs 2xl:text-sm font-bold text-[#141413]">
            <Link
              href="/peta-bidang"
              className="px-2 2xl:px-3 py-1.5 rounded-lg hover:bg-[#F0ECE1] transition-colors whitespace-nowrap"
            >
              Peta Bidang
            </Link>
            <Link
              href="/katalog"
              className="px-2 2xl:px-3 py-1.5 rounded-lg hover:bg-[#F0ECE1] transition-colors whitespace-nowrap"
            >
              <span className="hidden xl:inline">Katalog Kampus</span>
              <span className="xl:hidden inline">Katalog</span>
            </Link>
            <Link
              href="/#peta-kampus"
              className="px-2 2xl:px-3 py-1.5 rounded-lg hover:bg-[#F0ECE1] transition-colors whitespace-nowrap"
            >
              <span className="hidden xl:inline">Radar Bali</span>
              <span className="xl:hidden inline">Radar</span>
            </Link>
            <Link
              href="/hasil-analisis"
              className="px-2 2xl:px-3 py-1.5 rounded-lg hover:bg-[#F0ECE1] transition-colors whitespace-nowrap"
            >
              <span className="hidden xl:inline">Modul &amp; Sertifikasi</span>
              <span className="xl:hidden inline">Modul</span>
            </Link>
            <Link
              href="/profil"
              className="px-2 2xl:px-3 py-1.5 rounded-lg hover:bg-[#F0ECE1] transition-colors whitespace-nowrap"
            >
              <span className="hidden xl:inline">Profil &amp; Catatan</span>
              <span className="xl:hidden inline">Profil</span>
            </Link>
            <Link
              href="/ai-navigator"
              className="ml-0.5 2xl:ml-1 mr-0.5 2xl:mr-1 px-2.5 2xl:px-3 py-1.5 rounded-lg bg-[#3B66FF]/10 border border-[#3B66FF] text-[#3B66FF] hover:bg-[#3B66FF] hover:text-white transition-colors flex items-center gap-1.5 font-mono text-xs whitespace-nowrap shrink-0 shadow-xs"
            >
              <span className="w-2 h-2 rounded-full bg-[#1AD598] border border-[#141413]" />
              <span>AI Navigator</span>
            </Link>
          </nav>

          {/* Visual Divider between navigation and auth actions */}
          <div className="hidden lg:block h-5 2xl:h-6 w-[2px] bg-[#141413]/15 mx-0.5 2xl:mx-1.5 shrink-0" />

          {/* Right Action Group - Integrated inside navbar with balanced padding */}
          <div className="flex items-center gap-1.5 sm:gap-2 2xl:gap-3 shrink-0">
            {user ? (
              <div className="flex items-center gap-1.5 xl:gap-2">
                <Link
                  href="/profil"
                  title="Buka Profil & Catatan Pembelajaran"
                  className="group flex items-center gap-1.5 xl:gap-2 px-2.5 xl:px-3 h-9 sm:h-10 rounded-xl border-2 border-[#141413] bg-[#F0ECE1] hover:bg-[#B8F348] shadow-[0_2px_0_#141413] hover:translate-y-[1px] hover:shadow-none transition-all cursor-pointer"
                >
                  <span className="w-5 h-5 xl:w-6 xl:h-6 rounded-lg bg-[#B8F348] group-hover:bg-white border border-[#141413] flex items-center justify-center font-display font-extrabold text-[10px] xl:text-xs text-[#141413]">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                  <div className="text-left leading-none">
                    <span className="block font-display font-extrabold text-[11px] xl:text-xs text-[#141413] max-w-[90px] xl:max-w-[120px] truncate">
                      {user.name}
                    </span>
                    <span className="text-[9px] xl:text-[10px] font-mono font-bold text-[#52514E] group-hover:text-[#141413] uppercase">
                      {user.role === "guru" ? "Guru BK" : "Siswa"} &bull; Profil
                    </span>
                  </div>
                </Link>
                <button
                  type="button"
                  onClick={logout}
                  className="h-9 sm:h-10 text-xs font-bold text-[#141413] hover:bg-[#FFE5E0] hover:text-[#7A1A12] px-2.5 xl:px-3.5 rounded-xl border-2 border-[#141413] bg-white transition-all cursor-pointer whitespace-nowrap"
                  title="Keluar dari akun"
                >
                  Keluar
                </button>
              </div>
            ) : (
              <>
                <Link
                  href="/login"
                  className="hidden sm:inline-flex items-center justify-center h-9 sm:h-10 text-xs 2xl:text-sm font-display font-bold text-[#141413] bg-[#FAF7F2] hover:bg-[#F0ECE1] px-3 sm:px-4 rounded-xl border-2 border-[#141413] shadow-[0_3px_0_#141413] hover:translate-y-[1px] hover:shadow-[0_2px_0_#141413] active:translate-y-[3px] active:shadow-none transition-all cursor-pointer whitespace-nowrap"
                >
                  Masuk
                </Link>
                {/* Primary Tactile Keycap Button - Inside the card with symmetric right padding */}
                <Link
                  href="/eksplorasi"
                  className="group inline-flex items-center justify-center h-9 sm:h-10 gap-1.5 2xl:gap-2 pl-3 2xl:pl-4 pr-1.5 rounded-xl bg-[#FF5E4D] hover:bg-[#ff4936] text-white border-2 border-[#141413] shadow-[0_3px_0_#141413] hover:translate-y-[1px] hover:shadow-[0_2px_0_#141413] active:translate-y-[3px] active:shadow-none font-display font-extrabold text-xs 2xl:text-sm transition-all duration-150 cursor-pointer whitespace-nowrap shrink-0"
                >
                  <span>Mulai Eksplorasi</span>
                  <span className="w-5 h-5 2xl:w-6 2xl:h-6 rounded-lg bg-[#B8F348] text-[#141413] border border-[#141413] flex items-center justify-center font-mono text-[10px] 2xl:text-xs font-bold group-hover:translate-x-0.5 transition-transform">
                    &rarr;
                  </span>
                </Link>
              </>
            )}

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
              href="/peta-bidang"
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
              href="/profil"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-xl font-bold text-sm text-[#141413] hover:bg-[#F0ECE1]"
            >
              Profil &amp; Catatan Belajar
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
                  <Link
                    href="/profil"
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-2.5 rounded-xl border-2 border-[#141413] bg-[#F0ECE1] hover:bg-[#B8F348]/40 flex items-center justify-between transition-colors"
                  >
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
                    <span className="text-[11px] font-mono font-bold text-[#3B66FF]">
                      Profil &rarr;
                    </span>
                  </Link>
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
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-2.5 rounded-xl border-2 border-[#141413] bg-[#FAF7F2] hover:bg-[#F0ECE1] text-[#141413] text-xs font-display font-bold text-center"
                >
                  Masuk Akun
                </Link>
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
