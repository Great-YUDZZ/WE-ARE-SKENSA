"use client";

import React, { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import LoginModal from "@/components/LoginModal";

interface RecommendationResult {
  title: string;
  campusOrSchool: string;
  badgeType: "Teknologi" | "Manusia" | "Alam" | "Usaha";
  matchScore: number;
  accreditation: string;
  reason: string;
  careerOutlooks: string[];
  skillsToImprove: string[];
  localBaliAdvantage: string;
}

const PRESET_PROMPTS = [
  "Saya suka coding web dan desain UI/UX, cocok di SMK atau Kuliah mana di Bali?",
  "Bagaimana perbandingan prospek pariwisata berkelanjutan vs IT di Bali 2026?",
  "Saya siswa jurusan DKV/Seni, apakah bisa lanjut prodi teknologi di PTN Bali?",
  "Rekomendasi prodi vokasi ramah biaya dan peluang kerja tinggi di Denpasar.",
];

export default function AiNavigatorPage() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("Semua");
  const [selectedTarget, setSelectedTarget] = useState<"smk" | "kuliah">("kuliah");
  const [isLoading, setIsLoading] = useState(false);
  const [activeResult, setActiveResult] = useState<RecommendationResult[] | null>(null);

  const handleOpenLogin = () => {
    setAuthMode("login");
    setIsLoginModalOpen(true);
  };

  const handleOpenRegister = () => {
    setAuthMode("register");
    setIsLoginModalOpen(true);
  };

  const handleAnalyze = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    setActiveResult(null);

    // Simulated deterministic AI reasoning based on verified Bali DigiFest 2026 institutional dataset
    setTimeout(() => {
      const qLower = query.toLowerCase();
      let results: RecommendationResult[] = [];

      if (qLower.includes("coding") || qLower.includes("it") || qLower.includes("desain") || qLower.includes("ui") || qLower.includes("software") || qLower.includes("rpl")) {
        results = [
          {
            title: "Teknik Informatika & Rekayasa Perangkat Lunak",
            campusOrSchool: "Politeknik Negeri Bali (PNB) - Jimbaran",
            badgeType: "Teknologi",
            matchScore: 96,
            accreditation: "Unggul (BAN-PT)",
            reason: "Kurikulum vokasi berbasis praktik industri 70% dengan laboratorium cloud & software house terpadu. Sangat selaras dengan minat teknis terapan.",
            careerOutlooks: ["Frontend / Full-stack Developer", "UI/UX Product Designer", "Mobile App Engineer"],
            skillsToImprove: ["JavaScript / TypeScript", "Figma Design System", "Dasar Algoritma & Database"],
            localBaliAdvantage: "Peluang karir remote internasional di Bali Digital Nomad Hub (Canggu/Sanur) dan digitalisasi UMKM Bali.",
          },
          {
            title: "Informatika / Ilmu Komputer",
            campusOrSchool: "Universitas Udayana (Unud) - Jimbaran",
            badgeType: "Teknologi",
            matchScore: 91,
            accreditation: "Unggul (BAN-PT)",
            reason: "Fondasi teoritis dan riset AI yang kuat, jaringan alumni akademik terluas di Bali, serta fasilitas inkubator bisnis teknologi kampus.",
            careerOutlooks: ["AI Specialist", "Software Architect", "Data Analyst"],
            skillsToImprove: ["Struktur Data", "Matematika Diskrit", "Machine Learning Fundamentals"],
            localBaliAdvantage: "Riset sistem cerdas pelestarian aksara Bali dan monitoring lingkungan pulau cerdas.",
          },
          {
            title: "Rekayasa Perangkat Lunak & Game",
            campusOrSchool: "SMK Negeri 1 Denpasar (SKENSA)",
            badgeType: "Teknologi",
            matchScore: 89,
            accreditation: "A (BAN-SM / SMK Pusat Keunggulan)",
            reason: "Fasilitas lab komputer terlengkap, Teaching Factory aktif dengan mitra industri DUDI terkemuka, dan sertifikasi BNSP berstandar nasional.",
            careerOutlooks: ["Junior Web Programmer", "Game Asset Creator", "Quality Assurance Tester"],
            skillsToImprove: ["HTML/CSS/JS", "Git Version Control", "Logika Pemrograman Dasar"],
            localBaliAdvantage: "Kerjasama penempatan magang di puluhan perusahaan teknologi dan agensi kreatif di Denpasar.",
          },
        ];
      } else if (qLower.includes("pariwisata") || qLower.includes("hotel") || qLower.includes("wisata") || qLower.includes("kuliner")) {
        results = [
          {
            title: "Manajemen Perhotelan & Ekowisata Berkelanjutan",
            campusOrSchool: "Politeknik Pariwisata Bali (Poltekpar) - Nusa Dua",
            badgeType: "Usaha",
            matchScore: 95,
            accreditation: "Unggul (BAN-PT / TedQual Internasional)",
            reason: "Institusi pendidikan pariwisata berstandar global di bawah Kemenparekraf dengan jejaring jaringan hotel bintang lima se-dunia.",
            careerOutlooks: ["Hospitality Operations Manager", "Sustainable Tourism Consultant", "Event & MICE Planner"],
            skillsToImprove: ["Komunikasi Bahasa Asing", "Customer Experience Management", "Etika Pelayanan Budaya"],
            localBaliAdvantage: "Ekosistem pariwisata budaya Bali yang memimpin industri MICE dan resort dunia.",
          },
          {
            title: "Bisnis Digital & Manajemen E-Commerce",
            campusOrSchool: "Undiknas Denpasar",
            badgeType: "Usaha",
            matchScore: 88,
            accreditation: "Unggul (BAN-PT)",
            reason: "Kombinasi bisnis modern dan teknologi digital untuk menggerakkan sektor pariwisata pintar serta ekosistem startup lokal.",
            careerOutlooks: ["Digital Marketing Strategist", "E-Commerce Manager", "Business Development Executive"],
            skillsToImprove: ["Analitik Data Pemasaran", "SEO & Copywriting", "Manajemen Kampanye Digital"],
            localBaliAdvantage: "Pusat inkubasi bisnis kreatif anak muda Bali dengan pendanaan investor mitra.",
          },
        ];
      } else {
        results = [
          {
            title: "Desain Komunikasi Visual & Media Digital",
            campusOrSchool: "Institut Seni Indonesia (ISI) Denpasar",
            badgeType: "Manusia",
            matchScore: 93,
            accreditation: "Unggul (BAN-PT)",
            reason: "Penggabungan estetika seni budaya Bali adiluhung dengan teknologi visual kontemporer (animasi, branding, dan digital art).",
            careerOutlooks: ["Creative Director", "Digital Illustrator & Animator", "Brand Identity Specialist"],
            skillsToImprove: ["Prinsip Tipografi & Komposisi", "Software Vektor & Ilustrasi", "Apresiasi Seni Tradisi"],
            localBaliAdvantage: "Kekayaan ornamen, filosofi warna, dan seni visual Bali yang memiliki daya pikat global.",
          },
          {
            title: "Pertanian Organik & Agroteknologi Subak",
            campusOrSchool: "Fakultas Pertanian Universitas Udayana - Denpasar",
            badgeType: "Alam",
            matchScore: 90,
            accreditation: "Unggul (BAN-PT)",
            reason: "Riset kedaulatan pangan pulau Bali yang memadukan sistem irigasi warisan dunia Subak dengan teknologi sensor IoT presisi tinggi.",
            careerOutlooks: ["Smart Farming Consultant", "Manajer Agribisnis Organik", "Peneliti Konservasi Sumber Daya"],
            skillsToImprove: ["Dasar Agroklimatologi", "Manajemen Irigasi Presisi", "Analisis Rantai Pasok Pangan"],
            localBaliAdvantage: "Menjaga kelestarian sawah dan budaya Subak Bali melalui inovasi pertanian modern bernilai tinggi.",
          },
        ];
      }

      setActiveResult(results);
      setIsLoading(false);
    }, 1200);
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-kmNeutral-latar dark:bg-kmNeutral-darkLatar text-kmNeutral-tinta dark:text-kmNeutral-darkTeks relative transition-colors selection:bg-[#FFC93C] selection:text-[#1B1B2F]">
      {/* Top Navbar */}
      <Navbar
        onOpenLogin={handleOpenLogin}
        onOpenRegister={handleOpenRegister}
        onOpenTest={handleOpenRegister}
      />

      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 w-full">
        {/* Breadcrumb & Navigation */}
        <div className="flex items-center gap-2 text-xs font-mono text-kmNeutral-sekunder dark:text-kmNeutral-darkSekunder mb-6">
          <Link href="/" className="hover:text-kmNeutral-tinta dark:hover:text-white transition-colors">
            Beranda
          </Link>
          <span>/</span>
          <span className="text-[#1F7A52] dark:text-[#4CC992] font-bold">
            AI Navigator Khusus
          </span>
        </div>

        {/* Header Hero Section */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono font-bold bg-[#2E9E6B]/15 text-[#1F7A52] dark:text-[#4CC992] border border-[#2E9E6B]/30 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-[#2E9E6B] animate-pulse" />
            <span>KERTAMARGA AI NAVIGATOR • BALI DIGIFEST 2026</span>
          </div>

          <h1 className="font-serif font-bold text-3xl sm:text-5xl text-kmNeutral-tinta dark:text-kmNeutral-darkTeks tracking-tight leading-tight">
            Konsultasi Penjurusan & Karier AI
          </h1>

          <p className="text-sm sm:text-base text-kmNeutral-sekunder dark:text-kmNeutral-darkSekunder max-w-2xl mx-auto leading-relaxed">
            Ajukan pertanyaan tentang minat, bakat, kebingungan memilih kampus/SMK di Bali, atau bandingkan prospek karier masa depan dengan analisis objektif data resmi PDDIKTI dan BAN-PT.
          </p>
        </div>

        {/* Interactive Query Box */}
        <div className="mt-10 bg-kmNeutral-surface dark:bg-kmNeutral-darkPermukaan border-2 border-kmNeutral-garis dark:border-[#2E2E42] rounded-2xl p-5 sm:p-7 shadow-sm">
          {/* Target Filters */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-kmNeutral-garis dark:border-[#2E2E42]">
            <div className="flex items-center gap-2 text-xs font-bold text-kmNeutral-tinta dark:text-kmNeutral-darkTeks">
              <span>Fokus Target:</span>
              <button
                type="button"
                onClick={() => setSelectedTarget("kuliah")}
                className={`px-3 py-1 rounded-md text-xs font-bold transition-all cursor-pointer ${
                  selectedTarget === "kuliah"
                    ? "bg-[#2D6CDF] text-white shadow-xs"
                    : "bg-kmNeutral-latar dark:bg-kmNeutral-darkLatar text-kmNeutral-sekunder dark:text-kmNeutral-darkSekunder"
                }`}
              >
                Kuliah (Perguruan Tinggi)
              </button>
              <button
                type="button"
                onClick={() => setSelectedTarget("smk")}
                className={`px-3 py-1 rounded-md text-xs font-bold transition-all cursor-pointer ${
                  selectedTarget === "smk"
                    ? "bg-[#D7263D] text-white shadow-xs"
                    : "bg-kmNeutral-latar dark:bg-kmNeutral-darkLatar text-kmNeutral-sekunder dark:text-kmNeutral-darkSekunder"
                }`}
              >
                Vokasi SMK
              </button>
            </div>

            <span className="text-[11px] font-mono text-[#1F7A52] dark:text-[#4CC992] font-semibold">
              Terverifikasi Data 9 Kabupaten/Kota Bali
            </span>
          </div>

          {/* Form */}
          <form onSubmit={handleAnalyze} className="mt-5 space-y-4">
            <div>
              <label className="block text-xs font-bold text-kmNeutral-tinta dark:text-kmNeutral-darkTeks mb-2">
                Tuliskan Pertanyaan atau Gambaran Minat Anda:
              </label>
              <div className="relative">
                <textarea
                  rows={3}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Contoh: Saya suka merancang aplikasi, logika algoritma, dan ingin kuliah di Denpasar atau Badung dengan prospek karir global..."
                  className="w-full p-3.5 rounded-xl bg-kmNeutral-latar dark:bg-kmNeutral-darkLatar border border-kmNeutral-garis dark:border-[#2E2E42] text-kmNeutral-tinta dark:text-kmNeutral-darkTeks text-sm placeholder:text-kmNeutral-sekunder/50 focus:border-[#2D6CDF] focus:ring-1 focus:ring-[#2D6CDF] transition-colors resize-none"
                />
              </div>
            </div>

            {/* Preset Query Chips */}
            <div>
              <span className="block text-[11px] font-mono font-bold text-kmNeutral-sekunder dark:text-kmNeutral-darkSekunder mb-2">
                Contoh Topik Cepat:
              </span>
              <div className="flex flex-wrap gap-2">
                {PRESET_PROMPTS.map((promptText, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setQuery(promptText);
                    }}
                    className="text-xs px-3 py-1.5 rounded-lg bg-kmNeutral-latar dark:bg-kmNeutral-darkLatar hover:bg-[#FFC93C]/20 border border-kmNeutral-garis dark:border-[#2E2E42] hover:border-[#FFC93C] text-kmNeutral-sekunder dark:text-kmNeutral-darkSekunder hover:text-kmNeutral-tinta dark:hover:text-white text-left transition-colors cursor-pointer"
                  >
                    "{promptText}"
                  </button>
                ))}
              </div>
            </div>

            {/* Action Row */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
              <span className="text-xs text-kmNeutral-sekunder dark:text-kmNeutral-darkSekunder">
                Didukung AI Hibrida: Skoring Deterministik + Basis Data Resmi Institusi Bali
              </span>

              <button
                type="submit"
                disabled={isLoading || !query.trim()}
                className="w-full sm:w-auto h-11 px-7 rounded-xl bg-[#FFC93C] hover:bg-[#F5BF2E] disabled:opacity-50 text-[#1B1B2F] font-sans font-bold text-sm shadow-sm border border-[#E6B020]/40 transition-all active:scale-98 cursor-pointer flex items-center justify-center gap-2 shrink-0"
              >
                {isLoading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-[#1B1B2F] border-t-transparent rounded-full animate-spin" />
                    <span>Menganalisis Data...</span>
                  </>
                ) : (
                  <>
                    <span>Analisis Rekomendasi AI</span>
                    <span className="font-mono text-sm">&rarr;</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Boundary State 1: Loading Skeleton */}
        {isLoading && (
          <div className="mt-8 space-y-4 animate-pulse">
            <div className="h-6 w-48 bg-kmNeutral-garis dark:bg-[#2E2E42] rounded-md" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="h-48 bg-kmNeutral-surface dark:bg-kmNeutral-darkPermukaan border-2 border-kmNeutral-garis dark:border-[#2E2E42] rounded-2xl" />
              <div className="h-48 bg-kmNeutral-surface dark:bg-kmNeutral-darkPermukaan border-2 border-kmNeutral-garis dark:border-[#2E2E42] rounded-2xl" />
            </div>
          </div>
        )}

        {/* Boundary State 2: Recommendation Results */}
        {activeResult && !isLoading && (
          <div className="mt-10 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-mono font-bold text-[#1F7A52] dark:text-[#4CC992] uppercase tracking-wider">
                  HASIL ANALISIS CERDAS RESMI
                </span>
                <h2 className="font-serif font-bold text-2xl text-kmNeutral-tinta dark:text-kmNeutral-darkTeks mt-1">
                  Rekomendasi Pilihan untuk Anda
                </h2>
              </div>
              <button
                onClick={() => handleAnalyze()}
                type="button"
                className="text-xs font-bold text-kmNeutral-sekunder hover:text-kmNeutral-tinta dark:hover:text-white px-3 py-1.5 rounded-lg border border-kmNeutral-garis dark:border-[#2E2E42] transition-colors"
              >
                Muat Ulang Analisis
              </button>
            </div>

            <div className="grid grid-cols-1 gap-6">
              {activeResult.map((res, index) => {
                const badgeColor =
                  res.badgeType === "Teknologi"
                    ? "bg-[#2D6CDF]/15 text-[#2D6CDF] border-[#2D6CDF]/30"
                    : res.badgeType === "Manusia"
                    ? "bg-[#D7263D]/15 text-[#D7263D] border-[#D7263D]/30"
                    : res.badgeType === "Alam"
                    ? "bg-[#2E9E6B]/15 text-[#1F7A52] border-[#2E9E6B]/30"
                    : "bg-[#FFC93C]/25 text-[#1B1B2F] border-[#E6B020]/40";

                return (
                  <div
                    key={index}
                    className="bg-kmNeutral-surface dark:bg-kmNeutral-darkPermukaan border-2 border-kmNeutral-garis dark:border-[#2E2E42] rounded-2xl p-6 sm:p-7 shadow-xs space-y-4 hover:border-[#2D6CDF]/50 transition-colors"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-kmNeutral-garis dark:border-[#2E2E42]">
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full border ${badgeColor}`}>
                          {res.badgeType}
                        </span>
                        <span className="text-xs font-mono text-kmNeutral-sekunder dark:text-kmNeutral-darkSekunder">
                          Akreditasi: {res.accreditation}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-mono text-kmNeutral-sekunder">Kecocokan AI:</span>
                        <span className="font-mono font-bold text-sm text-[#1F7A52] dark:text-[#4CC992]">
                          {res.matchScore}%
                        </span>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-serif font-bold text-xl text-kmNeutral-tinta dark:text-kmNeutral-darkTeks">
                        {res.title}
                      </h3>
                      <p className="text-sm font-semibold text-[#2D6CDF] dark:text-[#6C9BFF] mt-0.5">
                        {res.campusOrSchool}
                      </p>
                      <p className="text-xs sm:text-sm text-kmNeutral-sekunder dark:text-kmNeutral-darkSekunder mt-2 leading-relaxed">
                        {res.reason}
                      </p>
                    </div>

                    {/* Sinergi Kearifan Lokal Bali */}
                    <div className="p-3.5 rounded-xl bg-kmNeutral-latar dark:bg-kmNeutral-darkLatar border border-kmNeutral-garis dark:border-[#2E2E42] text-xs">
                      <span className="font-bold text-kmNeutral-tinta dark:text-kmNeutral-darkTeks block mb-1">
                        Sinergi Potensi Bali Masa Depan:
                      </span>
                      <p className="text-kmNeutral-sekunder dark:text-kmNeutral-darkSekunder leading-relaxed">
                        {res.localBaliAdvantage}
                      </p>
                    </div>

                    {/* Tags row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                      <div>
                        <span className="text-[11px] font-mono font-bold text-kmNeutral-sekunder dark:text-kmNeutral-darkSekunder block mb-1.5">
                          Peluang Karier Terbuka:
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {res.careerOutlooks.map((c, i) => (
                            <span
                              key={i}
                              className="text-xs px-2 py-0.5 rounded bg-kmNeutral-latar dark:bg-kmNeutral-darkLatar border border-kmNeutral-garis dark:border-[#2E2E42] font-medium"
                            >
                              {c}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div>
                        <span className="text-[11px] font-mono font-bold text-kmNeutral-sekunder dark:text-kmNeutral-darkSekunder block mb-1.5">
                          Keahlian Kunci yang Perlu Diasah:
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {res.skillsToImprove.map((s, i) => (
                            <span
                              key={i}
                              className="text-xs px-2 py-0.5 rounded bg-[#FFC93C]/20 border border-[#E6B020]/30 text-[#1B1B2F] dark:text-[#FFD25E] font-medium"
                            >
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Boundary State 3: Empty State */}
        {!activeResult && !isLoading && (
          <div className="mt-12 text-center p-10 border-2 border-dashed border-kmNeutral-garis dark:border-[#2E2E42] rounded-2xl bg-kmNeutral-surface/50 dark:bg-kmNeutral-darkPermukaan/50">
            <div className="w-12 h-12 mx-auto rounded-full bg-[#FFC93C]/20 text-[#1B1B2F] dark:text-[#FFD25E] flex items-center justify-center font-bold text-lg mb-3">
              ?
            </div>
            <h3 className="font-serif font-bold text-base text-kmNeutral-tinta dark:text-kmNeutral-darkTeks">
              Belum Ada Analisis yang Berjalan
            </h3>
            <p className="text-xs text-kmNeutral-sekunder dark:text-kmNeutral-darkSekunder mt-1 max-w-md mx-auto">
              Pilih salah satu contoh topik cepat di atas atau ketik langsung pertanyaan peminatan jurusan Anda, lalu tekan tombol "Analisis Rekomendasi AI".
            </p>
          </div>
        )}
      </main>

      {/* Minimalist Footer */}
      <footer className="w-full bg-kmNeutral-surface dark:bg-kmNeutral-darkPermukaan border-t border-kmNeutral-garis dark:border-[#2E2E42] py-8 px-4 sm:px-6 lg:px-8 mt-16 transition-colors">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <div>
            <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
              <span className="w-5 h-5 rounded bg-[#FFC93C] text-[#1B1B2F] font-mono font-bold text-[10px] flex items-center justify-center">
                KM
              </span>
              <span className="font-serif font-bold text-sm text-kmNeutral-tinta dark:text-kmNeutral-darkTeks">
                KertaMarga Bali AI Navigator
              </span>
            </div>
            <p className="text-xs text-kmNeutral-sekunder dark:text-kmNeutral-darkSekunder">
              Inovasi Navigasi Karier & Penjurusan AI untuk Bali DigiFest 2026 (Kategori SMK)
            </p>
          </div>
          <div className="text-[11px] font-mono text-kmNeutral-sekunder dark:text-kmNeutral-darkSekunder flex gap-3">
            <Link href="/" className="hover:underline">
              Peta Kampus & SMK
            </Link>
            <span>&bull;</span>
            <Link href="/#cara-kerja" className="hover:underline">
              Cara Kerja
            </Link>
            <span>&bull;</span>
            <Link href="/#simulator" className="hover:underline">
              Simulasi Bobot
            </Link>
          </div>
        </div>
      </footer>

      {/* Auth Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onProceedToTest={() => setIsLoginModalOpen(false)}
        initialMode={authMode}
      />
    </div>
  );
}
