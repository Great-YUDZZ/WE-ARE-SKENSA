"use client";

import React, { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import LoginModal from "@/components/LoginModal";
import { INSTITUTIONS_CATALOG, BALI_KABUPATEN_COORDS, InstitutionProgram } from "@/data/catalog";

export default function KatalogInstitusiPage() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");

  const [selectedLevel, setSelectedLevel] = useState<string>("all");
  const [selectedKabupaten, setSelectedKabupaten] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const filteredInstitutions = INSTITUTIONS_CATALOG.filter((inst) => {
    if (selectedLevel !== "all" && inst.level !== selectedLevel) return false;
    if (selectedKabupaten !== "all" && inst.kabupaten !== selectedKabupaten) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = inst.institutionName.toLowerCase().includes(q);
      const matchProg = inst.programName.toLowerCase().includes(q);
      const matchDistrict = inst.district.toLowerCase().includes(q);
      if (!matchName && !matchProg && !matchDistrict) return false;
    }
    return true;
  });

  return (
    <div className="min-h-screen flex flex-col justify-between neopop-canvas-subtle text-[#141413] relative selection:bg-[#B8F348] selection:text-[#141413]">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed top-24 right-4 sm:right-8 z-50 neo-card px-5 py-3 rounded-2xl bg-[#141413] text-white flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-200 max-w-md">
          <div className="w-3 h-3 rounded-full bg-[#B8F348] shrink-0" />
          <span className="text-xs sm:text-sm font-display font-bold">{toastMessage}</span>
        </div>
      )}

      {/* Navbar */}
      <Navbar
        onOpenLogin={() => {
          setAuthMode("login");
          setIsLoginModalOpen(true);
        }}
        onOpenRegister={() => {
          setAuthMode("register");
          setIsLoginModalOpen(true);
        }}
        onOpenTest={() => {}}
      />

      <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 w-full space-y-8">
        {/* Header Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#52514E]">
          <Link href="/" className="hover:text-[#141413] underline">Beranda</Link>
          <span>/</span>
          <span className="px-2.5 py-0.5 rounded bg-[#FFBE2E] border border-[#141413] text-[#141413]">
            Katalog Institusi Terverifikasi
          </span>
        </div>

        {/* Hero Section */}
        <div className="neo-card-lg rounded-3xl p-6 sm:p-8 bg-white space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="px-3.5 py-1 rounded-xl bg-[#141413] text-[#B8F348] font-mono font-bold text-xs border-2 border-[#141413]">
              LEMBAR AUDIT SUMBER DATA RESMI &bull; PILOT BALI 2026
            </span>
            <span className="text-xs font-mono font-bold text-[#52514E]">
              15 Institusi &bull; 9 Kabupaten/Kota
            </span>
          </div>

          <h1 className="font-display font-black text-3xl sm:text-5xl text-[#141413] leading-tight">
            Katalog Institusi &amp; Audit Sumber Data
          </h1>

          <p className="text-sm sm:text-base text-[#52514E] leading-relaxed max-w-3xl">
            Sesuai prinsip transparansi KertaMarga, setiap klaim akreditasi, nama program studi, dan fasilitas ditautkan langsung ke sumber resmi (PDDIKTI, BAN-PT, BAN-SM, atau portal dinas terkait). Data yang belum terverifikasi secara primer ditandai secara jujur dan tidak dikarang oleh sistem.
          </p>

          <div className="pt-2 flex flex-wrap gap-2 text-xs font-mono font-bold">
            <span className="px-3 py-1 rounded-lg bg-[#FAF7F2] border border-[#141413]">
              Tanggal Pemeriksaan Terakhir: 2 November 2026
            </span>
            <span className="px-3 py-1 rounded-lg bg-[#FAF7F2] border border-[#141413] text-[#0F6E4E]">
              Status: 100% Terverifikasi
            </span>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="neo-card rounded-2xl p-5 bg-white space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
            {/* Search Input */}
            <div className="sm:col-span-5">
              <label className="block text-xs font-mono font-bold text-[#141413] uppercase mb-1.5">
                CARI SEKOLAH / KAMPUS / JURUSAN:
              </label>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Ketik nama prodi, kampus, atau kecamatan..."
                className="w-full h-10 px-3.5 rounded-xl bg-[#FAF7F2] border-2 border-[#141413] text-xs sm:text-sm text-[#141413] focus:outline-none"
              />
            </div>

            {/* Level Filter */}
            <div className="sm:col-span-3">
              <label className="block text-xs font-mono font-bold text-[#141413] uppercase mb-1.5">
                JENJANG PENDIDIKAN:
              </label>
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="w-full h-10 px-3 rounded-xl bg-[#FAF7F2] border-2 border-[#141413] font-display font-bold text-xs text-[#141413] cursor-pointer"
              >
                <option value="all">Semua Jenjang</option>
                <option value="SMK">Vokasi SMK</option>
                <option value="D4">Politeknik / D4</option>
                <option value="S1">Sarjana S1</option>
              </select>
            </div>

            {/* Kabupaten Filter */}
            <div className="sm:col-span-4">
              <label className="block text-xs font-mono font-bold text-[#141413] uppercase mb-1.5">
                KABUPATEN / KOTA DI BALI:
              </label>
              <select
                value={selectedKabupaten}
                onChange={(e) => setSelectedKabupaten(e.target.value)}
                className="w-full h-10 px-3 rounded-xl bg-[#FAF7F2] border-2 border-[#141413] font-display font-bold text-xs text-[#141413] cursor-pointer"
              >
                <option value="all">Semua Kabupaten/Kota (9 Wilayah)</option>
                {Object.keys(BALI_KABUPATEN_COORDS).map((kab) => (
                  <option key={kab} value={kab}>
                    {kab}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-[#141413]/10 text-xs font-mono font-bold">
            <span className="text-[#52514E]">
              Menampilkan {filteredInstitutions.length} dari {INSTITUTIONS_CATALOG.length} institusi pilot
            </span>
            {(selectedLevel !== "all" || selectedKabupaten !== "all" || searchQuery) && (
              <button
                type="button"
                onClick={() => {
                  setSelectedLevel("all");
                  setSelectedKabupaten("all");
                  setSearchQuery("");
                }}
                className="text-[#FF5E4D] underline hover:text-[#141413] cursor-pointer"
              >
                Reset Semua Filter
              </button>
            )}
          </div>
        </div>

        {/* Catalog Grid */}
        {filteredInstitutions.length === 0 ? (
          /* Empty State */
          <div className="neo-card rounded-3xl p-12 bg-white text-center space-y-4">
            <span className="w-12 h-12 rounded-2xl bg-[#FFBE2E] border-2 border-[#141413] flex items-center justify-center font-display font-black text-xl mx-auto">
              ?
            </span>
            <h3 className="font-display font-black text-xl text-[#141413]">
              Tidak Ada Institusi yang Cocok dengan Filter Ini
            </h3>
            <p className="text-xs sm:text-sm text-[#52514E] max-w-md mx-auto">
              Coba ganti filter kabupaten atau ubah jenjang pendidikan untuk melihat daftar institusi pilot lainnya.
            </p>
            <button
              type="button"
              onClick={() => {
                setSelectedLevel("all");
                setSelectedKabupaten("all");
                setSearchQuery("");
              }}
              className="px-4 py-2 rounded-xl bg-[#141413] text-white font-mono font-bold text-xs cursor-pointer"
            >
              Reset Filter
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredInstitutions.map((inst) => (
              <div
                key={inst.institutionId}
                className="neo-card rounded-2xl p-5 bg-white flex flex-col justify-between space-y-4 hover:shadow-[5px_5px_0px_#141413] transition-all"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-lg bg-[#141413] text-[#B8F348] font-mono font-bold text-[11px]">
                      {inst.level}
                    </span>
                    <span className="text-[11px] font-mono font-bold text-[#52514E]">
                      {inst.kabupaten}
                    </span>
                  </div>

                  <h3 className="font-display font-black text-lg text-[#141413] leading-snug">
                    {inst.institutionName}
                  </h3>

                  <p className="text-xs font-bold text-[#3B66FF]">
                    {inst.programName}
                  </p>

                  <div className="pt-2 border-t border-[#141413]/10 space-y-1.5 text-xs text-[#52514E]">
                    <p>
                      <strong>Akreditasi:</strong>{" "}
                      <span className="px-2 py-0.2 rounded bg-[#FAF7F2] border border-[#141413] font-mono text-[11px] text-[#141413] font-bold">
                        {inst.accreditation}
                      </span>
                    </p>
                    <p>
                      <strong>Biaya:</strong> {inst.tuitionFeeText}
                    </p>
                    <p>
                      <strong>Fasilitas:</strong> {inst.facilitiesText}
                    </p>
                  </div>
                </div>

                {/* Audit Source Footer */}
                <div className="pt-3 border-t border-[#141413]/10 flex items-center justify-between text-[11px] font-mono text-[#52514E]">
                  <div>
                    <span className="block text-[10px] text-[#52514E]/80">SUMBER DATA:</span>
                    <span className="font-bold text-[#141413]">{inst.source.publisher}</span>
                  </div>

                  <a
                    href={inst.source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-2.5 py-1 rounded-lg bg-[#FAF7F2] hover:bg-[#FFBE2E] border border-[#141413] font-bold text-[#141413] transition-colors"
                  >
                    Buka Sumber &nearr;
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="w-full bg-[#141413] text-white border-t-2 border-[#141413] py-8 px-4 sm:px-6 lg:px-8 mt-16">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left text-xs font-mono text-[#F0ECE1]/80">
          <div>
            <span className="font-display font-black text-white text-sm block">KertaMarga Bali</span>
            <span>Platform Eksplorasi Pendidikan Berbasis Data Resmi PDDIKTI &amp; BAN-PT</span>
          </div>
          <div className="flex gap-4">
            <Link href="/" className="hover:underline">Beranda</Link>
            <Link href="/eksplorasi" className="hover:underline">Eksplorasi Minat</Link>
            <Link href="/peta-bidang/informatika" className="hover:underline">Peta Bidang</Link>
          </div>
        </div>
      </footer>

      {/* Login Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onProceedToTest={() => setIsLoginModalOpen(false)}
        initialMode={authMode}
      />
    </div>
  );
}
