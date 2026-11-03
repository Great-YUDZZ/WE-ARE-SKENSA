"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import LoginModal from "@/components/LoginModal";
import { PROGRAM_FIELDS, ProgramField, InstitutionProgram, estimateDistanceKm } from "@/data/catalog";

export default function PetaBidangDetailPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const fieldId = (params?.id as string) || "informatika";
  const kabupatenParam = searchParams.get("kabupaten") || "Kota Denpasar";

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [currentLevelTab, setCurrentLevelTab] = useState<"smk" | "vokasi" | "akademik">("vokasi");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const field = PROGRAM_FIELDS.find((p) => p.id === fieldId) || PROGRAM_FIELDS[0];

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Matched institutions
  const matchedInstitutions = React.useMemo(() => {
    // Import institutional catalog from local definition or API
    const { INSTITUTIONS_CATALOG } = require("@/data/catalog");
    return (INSTITUTIONS_CATALOG as InstitutionProgram[]).filter((inst) => {
      const progLower = inst.programName.toLowerCase();
      if (field.id === "informatika" && (progLower.includes("perangkat lunak") || progLower.includes("jaringan") || progLower.includes("komputer"))) return true;
      if (field.id === "dkv" && (progLower.includes("desain komunikasi visual") || progLower.includes("multimedia"))) return true;
      if (field.id === "arsitektur" && (progLower.includes("arsitektur") || progLower.includes("pemodelan"))) return true;
      if (field.id === "kesehatan" && (progLower.includes("keperawatan") || progLower.includes("kesehatan") || progLower.includes("farmasi"))) return true;
      if (field.id === "pendidikan" && (progLower.includes("pendidikan") || progLower.includes("konseling"))) return true;
      if (field.id === "budaya" && (progLower.includes("karawitan") || progLower.includes("tari") || progLower.includes("seni"))) return true;
      if (field.id === "pertanian" && (progLower.includes("tanaman") || progLower.includes("agribisnis") || progLower.includes("subak"))) return true;
      if (field.id === "lingkungan" && (progLower.includes("maritim") || progLower.includes("kelautan") || progLower.includes("lingkungan"))) return true;
      if (field.id === "bisnis" && (progLower.includes("bisnis") || progLower.includes("manajemen") || progLower.includes("akuntansi"))) return true;
      if (field.id === "pariwisata" && (progLower.includes("perhotelan") || progLower.includes("pariwisata") || progLower.includes("wisata"))) return true;
      return false;
    }).map((inst) => ({
      ...inst,
      estimatedDistanceKm: estimateDistanceKm(kabupatenParam, inst.kabupaten),
    })).sort((a, b) => a.estimatedDistanceKm - b.estimatedDistanceKm);
  }, [field.id, kabupatenParam]);

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

      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 w-full space-y-8">
        {/* Breadcrumb Navigation */}
        <div className="flex flex-wrap items-center gap-2 text-xs font-mono font-bold text-[#52514E]">
          <Link href="/" className="hover:text-[#141413] underline">Beranda</Link>
          <span>/</span>
          <Link href="/eksplorasi" className="hover:text-[#141413] underline">Eksplorasi</Link>
          <span>/</span>
          <span className="px-2 py-0.5 rounded bg-[#B8F348] border border-[#141413] text-[#141413]">
            Peta Bidang: {field.name}
          </span>
        </div>

        {/* Quick Field Selector Strip */}
        <div className="p-3 rounded-2xl bg-white border-2 border-[#141413] shadow-[3px_3px_0px_#141413] flex items-center gap-2 overflow-x-auto">
          <span className="text-xs font-mono font-bold text-[#141413] uppercase shrink-0 px-2">
            PILIH BIDANG LAIN:
          </span>
          {PROGRAM_FIELDS.map((f) => {
            const isCurrent = f.id === field.id;
            return (
              <Link
                key={f.id}
                href={`/peta-bidang/${f.id}?kabupaten=${encodeURIComponent(kabupatenParam)}`}
                className={`shrink-0 px-3 py-1.5 rounded-xl font-display font-bold text-xs border-2 border-[#141413] transition-all ${
                  isCurrent
                    ? "bg-[#141413] text-[#B8F348] shadow-[2px_2px_0px_#3B66FF]"
                    : "bg-[#FAF7F2] text-[#52514E] hover:bg-[#F0ECE1] hover:text-[#141413]"
                }`}
              >
                {f.name}
              </Link>
            );
          })}
        </div>

        {/* Header Hero Section */}
        <div className="neo-card-lg rounded-3xl p-6 sm:p-8 bg-white space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="px-3.5 py-1 rounded-xl bg-[#3B66FF] text-white font-mono font-bold text-xs border-2 border-[#141413] shadow-[2px_2px_0px_#141413]">
              PETA BIDANG EDUKASI &bull; BALI 2026
            </span>
            <span className="text-xs font-mono font-bold text-[#52514E]">
              Klaster: {field.categoryName}
            </span>
          </div>

          <h1 className="font-display font-black text-3xl sm:text-5xl text-[#141413] leading-tight">
            {field.name}
          </h1>

          <p className="text-sm sm:text-base font-bold text-[#3B66FF]">
            {field.vibeTagline}
          </p>

          <p className="text-sm sm:text-base text-[#52514E] leading-relaxed">
            {field.shortDesc}
          </p>

          {/* Action Row */}
          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => triggerToast(`Panduan bidang ${field.name} disimpan ke perangkatmu!`)}
              className="px-4 py-2 rounded-xl border-2 border-[#141413] bg-[#FAF7F2] hover:bg-[#F0ECE1] font-mono font-bold text-xs text-[#141413] cursor-pointer"
            >
              + Simpan Rujukan Ini
            </button>
            <Link
              href="/eksplorasi"
              className="px-4 py-2 rounded-xl border-2 border-[#141413] bg-[#B8F348] hover:bg-[#a8e635] font-mono font-bold text-xs text-[#141413] cursor-pointer"
            >
              Uji Kecocokanmu Lewat Kuesioner &rarr;
            </Link>
          </div>
        </div>

        {/* SECTION 1: APA YANG DIPELAJARI (3 TABS JENJANG) */}
        <div className="neo-card rounded-3xl p-6 sm:p-8 bg-white space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b-2 border-[#141413]">
            <div>
              <span className="text-xs font-mono font-bold text-[#52514E] uppercase block">
                STRUKTUR PEMBELAJARAN
              </span>
              <h2 className="font-display font-black text-2xl text-[#141413]">
                Apa Saja yang Akan Kamu Pelajari?
              </h2>
            </div>

            {/* Level Switcher Tabs */}
            <div className="p-1 rounded-xl bg-[#F0ECE1] border-2 border-[#141413] flex gap-1">
              <button
                type="button"
                onClick={() => setCurrentLevelTab("smk")}
                className={`px-3 py-1.5 rounded-lg font-display font-bold text-xs transition-all cursor-pointer ${
                  currentLevelTab === "smk"
                    ? "bg-[#141413] text-[#B8F348]"
                    : "text-[#52514E] hover:text-[#141413]"
                }`}
              >
                Vokasi SMK
              </button>
              <button
                type="button"
                onClick={() => setCurrentLevelTab("vokasi")}
                className={`px-3 py-1.5 rounded-lg font-display font-bold text-xs transition-all cursor-pointer ${
                  currentLevelTab === "vokasi"
                    ? "bg-[#141413] text-[#B8F348]"
                    : "text-[#52514E] hover:text-[#141413]"
                }`}
              >
                Politeknik / D4
              </button>
              <button
                type="button"
                onClick={() => setCurrentLevelTab("akademik")}
                className={`px-3 py-1.5 rounded-lg font-display font-bold text-xs transition-all cursor-pointer ${
                  currentLevelTab === "akademik"
                    ? "bg-[#141413] text-[#B8F348]"
                    : "text-[#52514E] hover:text-[#141413]"
                }`}
              >
                Sarjana S1
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {field.whatYouLearn[currentLevelTab].map((topic, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-[#FAF7F2] border-2 border-[#141413] flex items-start gap-3"
              >
                <span className="w-6 h-6 rounded-lg bg-[#FFBE2E] border border-[#141413] font-mono font-bold text-xs flex items-center justify-center shrink-0">
                  {idx + 1}
                </span>
                <span className="font-display font-bold text-xs sm:text-sm text-[#141413] leading-snug">
                  {topic}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 2: MASALAH NYATA DI BALI YANG DISELESAIKAN */}
        <div className="neo-card rounded-3xl p-6 sm:p-8 bg-[#FAF7F2] space-y-4">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#1AD598] border border-[#141413]" />
            <h2 className="font-display font-black text-xl sm:text-2xl text-[#141413]">
              Contoh Masalah Nyata di Bali yang Bisa Kamu Selesaikan
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-[#52514E]">
            Belajar di bidang ini bukan hanya teori, tetapi langsung berdampak untuk masyarakat dan lingkungan pulau Bali:
          </p>

          <div className="space-y-3 pt-1">
            {field.realProblemsSolvedInBali.map((prob, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-white border-2 border-[#141413] shadow-[2px_2px_0px_#141413] text-xs sm:text-sm text-[#141413] font-medium leading-relaxed"
              >
                <strong>Tantangan #{idx + 1}:</strong> {prob}
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 3: KETERAMPILAN KUNCI & JALUR KARIER */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Keterampilan Kunci */}
          <div className="neo-card rounded-3xl p-6 bg-white space-y-4">
            <h3 className="font-display font-black text-lg text-[#141413]">
              Keahlian Kunci yang Perlu Diasah
            </h3>
            <div className="flex flex-wrap gap-2">
              {field.coreCompetencies.map((comp) => (
                <span
                  key={comp}
                  className="px-3 py-1 rounded-xl bg-[#F0ECE1] border border-[#141413] font-mono font-bold text-xs text-[#141413]"
                >
                  #{comp}
                </span>
              ))}
            </div>
            <div className="pt-2 border-t border-[#141413]/10">
              <span className="text-[11px] font-mono font-bold text-[#52514E] uppercase block mb-1">
                TIPS MENUTUP KESENJANGAN BELAJAR (READINESS BRIDGE):
              </span>
              <ul className="text-xs text-[#52514E] space-y-1 list-disc list-inside">
                {field.readinessBridgeTips.map((tip, idx) => (
                  <li key={idx}>{tip}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Jalur Karier & Wirausaha */}
          <div className="neo-card rounded-3xl p-6 bg-[#FFBE2E] space-y-4">
            <h3 className="font-display font-black text-lg text-[#141413]">
              Peluang Karier &amp; Wirausaha Lokal di Bali
            </h3>
            <div>
              <span className="text-[11px] font-mono font-bold text-[#141413] uppercase block mb-1.5">
                JALUR PROFESI UMUM:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {field.careerPaths.map((career) => (
                  <span
                    key={career}
                    className="px-2.5 py-1 rounded-lg bg-white border border-[#141413] font-display font-bold text-xs text-[#141413]"
                  >
                    {career}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-2 border-t border-[#141413]/20">
              <span className="text-[11px] font-mono font-bold text-[#141413] uppercase block mb-1.5">
                IDE WIRAUSAHA LOKAL DI BALI:
              </span>
              <ul className="text-xs text-[#141413] space-y-1.5 font-medium">
                {field.localEntrepreneurshipIdeas.map((idea, idx) => (
                  <li key={idx} className="p-2 rounded-xl bg-white/70 border border-[#141413]/30">
                    {idea}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* SECTION 4: INSTITUSI TERVERIFIKASI DI BALI */}
        <div className="neo-card rounded-3xl p-6 sm:p-8 bg-white space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b-2 border-[#141413]">
            <div>
              <span className="text-xs font-mono font-bold text-[#52514E] uppercase block">
                KATALOG TERVERIFIKASI
              </span>
              <h2 className="font-display font-black text-2xl text-[#141413]">
                Institusi Penyelenggara di Bali
              </h2>
            </div>
            <span className="text-xs font-mono font-bold text-[#141413] bg-[#B8F348] px-3 py-1 rounded-xl border border-[#141413]">
              {matchedInstitutions.length} Sekolah/Kampus Terdaftar
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {matchedInstitutions.map((inst) => (
              <div
                key={inst.institutionId}
                className="p-5 rounded-2xl bg-[#FAF7F2] border-2 border-[#141413] shadow-[3px_3px_0px_#141413] space-y-2.5"
              >
                <div className="flex items-center justify-between">
                  <span className="font-display font-black text-base text-[#141413]">
                    {inst.institutionName}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-[#3B66FF] text-white font-mono font-bold text-xs">
                    {inst.level}
                  </span>
                </div>

                <p className="text-xs font-bold text-[#3B66FF]">
                  {inst.programName}
                </p>

                <div className="flex items-center justify-between text-xs font-mono text-[#52514E]">
                  <span>{inst.district}, {inst.kabupaten}</span>
                  <span className="font-bold text-[#141413]">~{inst.estimatedDistanceKm} km</span>
                </div>

                <div className="pt-2 border-t border-[#141413]/10 space-y-1 text-xs text-[#52514E]">
                  <p><strong>Akreditasi:</strong> {inst.accreditation}</p>
                  <p><strong>Estimasi Biaya:</strong> {inst.tuitionFeeText}</p>
                  <p><strong>Fasilitas Unggulan:</strong> {inst.facilitiesText}</p>
                </div>

                <div className="pt-2 flex items-center justify-between text-[11px] font-mono text-[#52514E]">
                  <span>Sumber: {inst.source.publisher}</span>
                  <a
                    href={inst.source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-bold text-[#3B66FF] underline hover:text-[#141413]"
                  >
                    Cek Situs Resmi &nearr;
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Transparency Disclaimer Footer */}
        <div className="p-4 rounded-2xl bg-white border-2 border-[#141413] text-center text-xs font-mono text-[#52514E]">
          Katalog ini disusun untuk percontohan MVP Bali DigiFest 2026 berdasarkan data resmi BAN-PT dan PDDIKTI per 2 November 2026. Selalu periksa informasi jalur penerimaan terbaru melalui situs resmi masing-masing institusi.
        </div>
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
            <Link href="/katalog" className="hover:underline">Katalog Institusi</Link>
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
